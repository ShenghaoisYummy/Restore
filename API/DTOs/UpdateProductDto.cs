using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProductDto
{
    [Required]
    public int Id { get; set; }

    [Required]
    public required string Name { get; set; } = string.Empty;

    [Required]
    public required string Description { get; set; }
    [Range(100, double.PositiveInfinity)]
    public long Price { get; set; }

    [Required]
    public IFormFile? File { get; set; }

    [Required]
    public required string Type { get; set; }

    [Required]
    public required string Brand { get; set; }

    [Required]
    [Range(0, 200)]
    public int QuantityInStock { get; set; }
}




