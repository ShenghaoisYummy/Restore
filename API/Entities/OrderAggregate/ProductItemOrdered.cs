using System;
using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    /**
     * C# model for the product item ordered,
     * This is used to represent a snapshot of the product at the time it was ordered
     */

    [Owned]
    public class ProductItemOrdered
    {
        public int ProductId { get; set; }
        public required string Name { get; set; }
        public required string PictureUrl { get; set; }
    }
}
