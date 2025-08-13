using System;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace API.Entities.OrderAggregate
{
    /**
     * C# model for payment summary,
     * This represents payment information for an order
     */
    [Owned]
    public class PaymentSummary
    {
        public int Last4 { get; set; }
        public required string Brand { get; set; }
        [JsonPropertyName("exp_month")]
        public int ExpMonth { get; set; }
        [JsonPropertyName("exp_year")]
        public int ExpYear { get; set; }
    }
}
