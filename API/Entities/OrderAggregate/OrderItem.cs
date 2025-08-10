using System;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    /**
     * C# model for an order item,
     * This represents a single item within an order
     */
    [Owned]
    public class OrderItem
    {
        public int Id { get; set; }
        public required ProductItemOrdered ItemOrdered { get; set; } 
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
