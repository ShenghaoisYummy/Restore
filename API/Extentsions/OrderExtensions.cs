using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        /**
         * Projects an Order entity to an OrderDto
         * 
         * @param query - IQueryable<Order> from context.Orders
         * @returns IQueryable<OrderDto> - Mapped order data
         * 
         * The mapping function order => new OrderDto creates a projection where:
         * - Each Order entity is transformed into an OrderDto
         * - Only the required fields are included in the DTO
         * - Nested OrderItems are also mapped to DTOs
         */
        public static IQueryable<OrderDto> ProjectToDto(this IQueryable<Order> query)
        {
            return query.Select(order => new OrderDto
            {
                Id = order.Id,
                BuyerEmail = order.BuyerEmail,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                PaymentSummary = order.PaymentSummary,
                DeliveryFee = order.DeliveryFee,
                Subtotal = order.Subtotal,
                Status = order.Status.ToString(),
                Total = (long)order.GetTotal(),
                OrderItems = order.OrderItems.Select(item => new OrderItemDto
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = (long)item.Price,
                    Quantity = item.Quantity
                }).ToList()
            }).AsNoTracking();
        }
        public static OrderDto ToDto(this Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                BuyerEmail = order.BuyerEmail,
                OrderDate = order.OrderDate,
                ShippingAddress = order.ShippingAddress,
                PaymentSummary = order.PaymentSummary,
                DeliveryFee = order.DeliveryFee,
                Subtotal = order.Subtotal,
                Status = order.Status.ToString(),
                Total = (long)order.GetTotal(),
                OrderItems = order.OrderItems.Select(item => new OrderItemDto
                {
                    ProductId = item.ItemOrdered.ProductId,
                    Name = item.ItemOrdered.Name,
                    PictureUrl = item.ItemOrdered.PictureUrl,
                    Price = (long)item.Price,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
    }
}
