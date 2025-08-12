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
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            var orders = await context.Orders.
            ProjectToDto().
            Where(x => x.BuyerEmail == User.GetUsername()).
            ToListAsync();

            return orders;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderDto>> GetOrderDetails(int id)
        {
            var order = await context.Orders.
            ProjectToDto().
            Where(x => x.BuyerEmail == User.GetUsername() && x.Id == id).
            FirstOrDefaultAsync();
            if (order == null) return NotFound();

            return order;
        }


        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto orderDto)
        {
            var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]!);

            if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId)) return BadRequest(new ProblemDetails { Title = "Basket Not Found" });

            var items = CreateOrderItems(basket.Items);
            if (items == null) return BadRequest(new ProblemDetails { Title = "some items out of stock" });

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
            return CreatedAtAction(nameof(GetOrderDetails), new { id = order.Id }, order.ToDto());
        }

        private long CalculateDeliveryFee(long subtotal)
        {
            var deliveryFee = subtotal > 10000 ? 0 : 500;
            return deliveryFee;
        }

        private List<OrderItem> CreateOrderItems(List<BasketItem> items)
        {
            var orderItems = new List<OrderItem>();
            // loop through items and create order items
            foreach (var item in items)
            {
                // check if quantity in stock is enough
                if (item.Product.QuantityInStock < item.Quantity)
                    return null;

                // create order item
                var orderItem = new OrderItem
                {
                    ItemOrdered = new ProductItemOrdered
                    {
                        ProductId = item.ProductId,
                        Name = item.Product.Name,
                        PictureUrl = item.Product.PictureUrl,
                    },
                    Price = item.Product.Price,
                    Quantity = item.Quantity
                };
                // add order item to list
                orderItems.Add(orderItem);
            }
            // return list of order items
            return orderItems;
        }

    }
}