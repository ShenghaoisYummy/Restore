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
            // fetch the basket with the basket id stored in the cookies
            var basket = await context.Baskets.GetBasketWithItems(Request.Cookies["basketId"]!);

            // if the basket is not found or the items are empty or the payment intent id is null, return bad request
            if (basket == null || basket.Items.Count == 0 || string.IsNullOrEmpty(basket.PaymentIntentId)) return BadRequest(new ProblemDetails { Title = "Basket Not Found" });

            // create the order items
            var items = CreateOrderItems(basket.Items);

            // if the items are null, return bad request
            if (items == null) return BadRequest(new ProblemDetails { Title = "some items out of stock" });

            // calculate the subtotal and delivery fee
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var deliveryFee = CalculateDeliveryFee((long)subtotal);

            // fetch the existing order with the payment intent id
            var order = await context.Orders.
            Include(o => o.OrderItems).
            FirstOrDefaultAsync(o => o.PaymentIntentId == basket.PaymentIntentId);

            // if the order is not found, create a new order
            if (order == null)
            {
                order = new Order
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
            }
            // if the order is found, update the order items
            else
            {
                order.OrderItems = items;
            }

            // save changes to database
            var result = await context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem creating order" });

            // Return HTTP 201 Created response with location header pointing to the newly created order
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