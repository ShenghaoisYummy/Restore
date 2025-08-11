using Microsoft.AspNetCore.Mvc;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Authorization;
using API.DTOs;
using API.Extentsions;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController(StoreContext context) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Order>>> GetOrders()
        {
            var orders = await context.Orders.
            Include(x => x.OrderItems).
            Where(x => x.BuyerEmail == User.GetUsername()).
            ToListAsync();
            return orders;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Order>> GetOrderDetails(int id)
        {
            var order = await context.Orders.
            Where(x => x.BuyerEmail == User.GetUsername() && x.Id == id).
            FirstOrDefaultAsync();
            if (order == null) return NotFound();

            return order;
        }


        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]!);

            if (basket == null) return BadRequest(new ProblemDetails { Title = "Basket Not Found" });

            var items = CreateOrderItems(basket.Items);
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = CalculateDeliveryFee((long)subtotal);

            var order = new Order
            {
                OrderItems = items,
                BuyerEmail = User.GetUsername(),
                ShippingAddress = orderDto.ShippingAddress,
                DeliveryFee = deliveryFee,
                Subtotal = subtotal,
                PaymentSummary = orderDto.PaymentSummary,
                PaymentIntentId = basket.PaymentIntentId,
            };
            context.Orders.Add(order);

            context.Baskets.Remove(basket);
            Response.Cookies.Delete("basketId");

            var result = await context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem creating order" });

            // This is CreatedAtAction - a special ASP.NET Core method that 
            // returns a HTTP 201 Created response with additional metadata.
            return CreatedAtAction(nameof(GetOrderDetails), new { id = order.Id }, order);
        }

        private long CalculateDeliveryFee(long subtotal)
        {
            throw new NotImplementedException();
        }

        private List<OrderItem> CreateOrderItems(List<BasketItem> items)
        {
            throw new NotImplementedException();
        }
    }
}