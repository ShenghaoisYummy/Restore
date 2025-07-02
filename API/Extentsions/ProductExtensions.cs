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

    public static IQueryable<Product> Filter(this IQueryable<Product> query, string? brands, string? types)
    {
        // create list variables to hold the brands and types
        var brandList = new List<string>();
        var typeList = new List<string>();

        // if the brands parameters is not null or empty, split it by comma and add it to the list
        if (!string.IsNullOrEmpty(brands))
        {
            brandList.AddRange(brands.ToLower().Split(",").ToList());
        }
        // if the types parameters is not null or empty, split it by comma and add it to the list
        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange(types.ToLower().Split(",").ToList());
        }

        query = query.Where(x => brandList.Count == 0 || brandList.Contains(x.Brand.ToLower()))
                     .Where(x => typeList.Count == 0 || typeList.Contains(x.Type.ToLower()));
        return query;
    }

}

