using System;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;


namespace API.Data;

public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
{
    public required DbSet<Product> Products { get; set; }

    public required DbSet<Basket> Baskets { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = "1213weqweqwe123c", Name = "Member", NormalizedName = "MEMBER" },
            new IdentityRole { Id = "czvcvamksldassa", Name = "Admin", NormalizedName = "ADMIN" }
        );
    }
}
 