using System;
using System.Linq;
using API.Entities;

namespace API.Extensions;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string? orderBy)
    {
        query = orderBy switch
        {
            "price" => query.OrderBy(x => x.Price),
            "priceDesc" => query.OrderByDescending(x => x.Price),
            _ => query.OrderBy(x => x.Name)
        };
        return query;
    }

    public static IQueryable<Product> Search(this IQueryable<Product> query, string? SearchTerm)
    {   
        // if the search term is null or empty, return the original query
        if (string.IsNullOrEmpty(SearchTerm)) return query;
        // convert the serach term to lower case
        var lowerCaseSearchTerm = SearchTerm.Trim().ToLower();

        
        return query.Where(x => x.Name.ToLower().Contains(lowerCaseSearchTerm));
    }

}

