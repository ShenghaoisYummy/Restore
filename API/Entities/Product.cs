using System;

namespace API.Entities;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public long Price { get; set; }
    public string PictureUrl { get; set; }
    public  required int Type { get; set; }
    public required int Brand { get; set; }
    public int QuantityInStock { get; set; }
    
}