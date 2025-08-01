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

namespace API.Controllers;

public class PaymentsController(PaymentsService paymentsService, StoreContext context) : BaseApiController
{   [Authorize]
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


        if(context.ChangeTracker.HasChanges())
        {
            // save changes to database and return result (boolean)
            var result = await context.SaveChangesAsync() > 0;
            // if result is false, which means the basket is not updated, return bad request
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating basket with intent" });
        } 

        // return basket dto
        return basket.ToDto();
    }
}








