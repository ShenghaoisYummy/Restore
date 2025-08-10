using System;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    /**
     * C# model for payment summary,
     * This represents payment information for an order
     */
    [Owned]
    public class PaymentSummary
    {
        public int Last4 {get; set;}
        public required string Brand {get; set;}
        public int ExpMonth {get; set;}
        public int ExpYear {get; set;}
    }
}
