using System;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    /**
    * C# model for the shipping address,
    * This is used to represent the shipping address for an order
    */


    /**
    * This is an owned entity, which means it is part of the order entity
    * and is not a separate entity in the database
    */
    [Owned] 
    public class ShippingAddress
    {
    public required string Name { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }

    [JsonPropertyName("postal_code")] // JSON name mapping for the postal code
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    }
}
