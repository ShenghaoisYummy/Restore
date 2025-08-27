using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

/*
 * Dto is a data transfer object, it is used to transfer data between the client and the server
 * it is used to validate the data that is sent to the server
 * it is like a gatekeeper between the client and the server
 */
public class CreateProductDto
{
    [Required]
    public required string Name { get; set; } = string.Empty;

    [Required]
    public required string Description { get; set; }
    [Range(100, double.PositiveInfinity)]
    public long Price { get; set; }

    [Required]
    public IFormFile File { get; set; } = null!;

    [Required]
    public required string Type { get; set; }

    [Required]
    public required string Brand { get; set; }

    [Required]
    [Range(0, 200)]
    public int QuantityInStock { get; set; }
}
