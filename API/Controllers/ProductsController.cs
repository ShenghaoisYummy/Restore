using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;
using API.RequestHelpers;
using API.Extentsions;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using API.Services;

namespace API.Controllers
{

    public class ProductsController(StoreContext context, IMapper mapper, ImageService imageService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery] ProductParams productParams)
        {

            var query = context.Products
            .Sort(productParams.OrderBy).
            Search(productParams.SearchTerm).
            Filter(productParams.Brands, productParams.Types).
            AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.Metadata);

            return products;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if (product == null) return NotFound();

            return product;

        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands = await context.Products.Select(x => x.Brand).Distinct().ToListAsync();
            var types = await context.Products.Select(x => x.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });
        }


        /*
         * AutoMapper is a library that helps us to map the CreateProductDto to a Product entity.
         * 
         * It automatically maps properties with matching names, eliminating the need for manual mapping:
         * 
         *     Name = productDto.Name,
         *     Description = productDto.Description,
         *     Price = productDto.Price,
         *     PictureUrl = productDto.PictureUrl,
         *     Type = productDto.Type,
         *     Brand = productDto.Brand,
         *     QuantityInStock = productDto.QuantityInStock
         * 
         * The mapping configuration is defined in MappingProfiles.cs
         */

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)

        {
            // create a new product and using automapper to map the productDto to a product
            // map same properties from productDto to product
            var product = mapper.Map<Product>(productDto);

            // upload the image to cloudinary, and get the url to product.PictureUrl
            if (productDto.File != null)
            {
                var imageResult = await imageService.AddImageAsync(productDto.File);
                if (imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });
                }

                product.PictureUrl = imageResult.SecureUrl.AbsoluteUri;
                product.PublicId = imageResult.PublicId;
            }

            //add the product to the database
            context.Products.Add(product);

            //save the changes to the database and check if it was successful
            var result = await context.SaveChangesAsync() > 0;

            //if the changes were successful, return the created product
            if (result) return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);

            //if the changes were not successful, return a bad request
            return BadRequest(new ProblemDetails { Title = "Problem creating product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct(UpdateProductDto updateProductDto)
        {
            // find the product to update
            var product = await context.Products.FindAsync(updateProductDto.Id);

            // if the product is not found, return a not found response
            if (product == null) return NotFound();

            // map the updateProductDto to the product
            mapper.Map(updateProductDto, product);

            // save the changes to the database and check if it was successful
            var result = await context.SaveChangesAsync() > 0;

            // if the changes were successful, return the updated product
            if (result) return Ok(product);

            // if the changes were not successful, return a bad request
            return BadRequest(new ProblemDetails { Title = "Problem updating product" });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            // find the product to delete
            var product = await context.Products.FindAsync(id);

            // if the product is not found, return a not found response
            if (product == null) return NotFound();

            // remove the product from the database
            context.Products.Remove(product);

            var result = await context.SaveChangesAsync() > 0;

            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });
        }
    }
}
