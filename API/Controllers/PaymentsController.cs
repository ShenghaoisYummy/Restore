using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using API.Extentsions;
using Microsoft.AspNetCore.Authorization;
using Stripe;
using API.Entities.OrderAggregate;


namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService,
StoreContext context,
IConfiguration config,
ILogger<PaymentsController> logger) : BaseApiController
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
    {
        // get basket through basketId in cookies
        var basket = await context.Baskets
            .GetBasketWithItems(Request.Cookies["basketId"]);

        // if basket is null, return bad request
        if (basket == null) return BadRequest(new ProblemDetails { Title = "Basket not found" });

        // create or update payment intent
        var intent = await paymentsService.CreateOrUpdatePaymentIntent(basket);

        // if intent is null, return bad request
        if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

        // update basket with payment intent id and client secret
        basket.PaymentIntentId ??= intent.Id;
        basket.ClientSecret ??= intent.ClientSecret;


        if (context.ChangeTracker.HasChanges())
        {
            // save changes to database and return result (boolean)
            var result = await context.SaveChangesAsync() > 0;
            // if result is false, which means the basket is not updated, return bad request
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });
        }

        // return basket dto
        return basket.ToDto();
    }

    [HttpPost("webhook")]
    public async Task<ActionResult> StripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = ConstructStripEvent(json);

            if (stripeEvent.Data.Object is not PaymentIntent intent)
            {
                return BadRequest("Invalid payment intent");
            }

            if (intent.Status == "succeeded") await HandlePaymentIntentSucceeded(intent);
            else await HandlePaymentIntentFailed(intent);
            return Ok();

        }
        catch (StripeException e)
        {

            logger.LogError(e, "Error handling stripe event");
            return StatusCode(StatusCodes.Status500InternalServerError, "Webhook Error");
        }
        catch (Exception e)
        {
            logger.LogError(e, "An unexpected error occurred");
            return StatusCode(StatusCodes.Status500InternalServerError, "Unexpected Error");
        }

    }

    /**
     * Handle payment intent failed
     * This is called when the payment intent is failed
     * We need to add the quantity of the order items back to the stock
     * and set the order status to payment failed
     * @param intent The payment intent
     * @return void
    */
    private async Task HandlePaymentIntentFailed(PaymentIntent intent)
    {
        // fetch all the orders with related item lists
        var order = await context.Orders
        .Include(o => o.OrderItems)
        .FirstOrDefaultAsync(o => o.PaymentIntentId == intent.Id)
            ?? throw new Exception("Order not found");

        // loop through the order items and
        // add the quantity of the order item back to the stock
        foreach (var item in order.OrderItems)
        {
            var productItem = await context.Products.
            FindAsync(item.ItemOrdered.ProductId)
                ?? throw new Exception("Problem updating order stock");


            productItem.QuantityInStock += item.Quantity;
        }

        // set the order status to payment failed
        order.Status = OrderStatus.PaymentFailed;

        // save changes to database
        await context.SaveChangesAsync();

    }

    private async Task HandlePaymentIntentSucceeded(PaymentIntent intent)
    {
        // fetch all the orders with related item lists
        var order = await context.Orders
        .Include(o => o.OrderItems)
        .FirstOrDefaultAsync(o => o.PaymentIntentId == intent.Id)
            ?? throw new Exception("Order not found");

        var orderTotalInCents = (long)(order.GetTotal() * 100);
        logger.LogInformation("Payment intent succeeded. Order ID: {OrderId}, Order total (cents): {OrderTotal}, Intent amount (cents): {IntentAmount}", 
            order.Id, orderTotalInCents, intent.Amount);

        // if the order total is not the same as the intent amount,
        // we need to set the order status to payment mismatch
        if (orderTotalInCents != intent.Amount)
        {
            logger.LogWarning("Payment amount mismatch for order {OrderId}. Expected: {Expected}, Received: {Received}", 
                order.Id, orderTotalInCents, intent.Amount);
            order.Status = OrderStatus.PaymentMismatch;

        }
        else
        {
            logger.LogInformation("Payment successful for order {OrderId}", order.Id);
            order.Status = OrderStatus.PaymentReceived;
        }

        // fetch the basket with the payment intent id
        var basket = await context.Baskets.FirstOrDefaultAsync(b => b.PaymentIntentId == intent.Id);

        if (basket != null)
        {
            // delete the basket
            context.Baskets.Remove(basket);
        }

        // save changes to database
        await context.SaveChangesAsync();

    }

    private Event ConstructStripEvent(string json)
    {
        try
        {
            return EventUtility.ConstructEvent(
                json,
                Request.Headers["Stripe-Signature"],
                config["StripeSettings:WhSecret"],
                throwOnApiVersionMismatch: false
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Error constructing stripe event");
            throw new StripeException("Error constructing stripe event", e);
        }
    }
}








