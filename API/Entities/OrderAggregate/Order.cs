using System;
using System.Collections.Generic;
using API.Entities.OrderAggregate;

namespace API.Entities.OrderAggregate
{
    /**
     * C# model for an order,
     * This represents a customer order in the system
     */
    public class Order
    {
        public int Id { get; set; }
        public required string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public List<OrderItem> OrderItems { get; set; } = [];
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public required ShippingAddress ShippingAddress { get; set; }
        public required PaymentSummary PaymentSummary { get; set; }
        public required string PaymentIntentId { get; set; }
        public long Discount { get; set; }


        public decimal GetTotal()
        {
            return Subtotal + DeliveryFee - Discount;
        }
    }
}
