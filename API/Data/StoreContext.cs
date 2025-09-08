using System;
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;


namespace API.Data;
/** Entity Framework Core DbContext for database
*   Database Tables(DbSets): represent the tables in the database
*/
public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }

    public required DbSet<Basket> Baskets { get; set; }

    public required DbSet<Order> Orders { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "1213weqweqwe123c", Name = "Member", NormalizedName = "MEMBER" },
            new IdentityRole { Id = "czvcvamksldassa", Name = "Admin", NormalizedName = "ADMIN" }
        );
    }
}
