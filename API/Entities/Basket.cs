using System;

namespace API.Entities;

public class Basket
{
    public int Id { get; set; }
    public required string BasketId { get; set; }
    public List<BasketItem> Items { get; set; } = [];

    // use to set and get the client secret for the payment intent
    // the client secret is used to authenticate and authorize actions on the payment intent
    // it is safe to expose, because it is only only for confirming/completing this specific payment
    public string? ClientSecret { get; set; }

    // use to set and get the payment intent id for the payment intent
    public string? PaymentIntentId { get; set; }

    public void AddItem(Product product, int quantity)
    {
        if (product == null) ArgumentNullException.ThrowIfNull(product);
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be greater than zero.");

        var existingItem = FindItem(product.Id);
        if (existingItem == null)
        {
            Items.Add(new BasketItem
            {
                Quantity = quantity,
                Product = product
            });
        }
        else
        {
            existingItem.Quantity += quantity;
        }
    }

    public void RemoveItem(int productId, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException(nameof(quantity), "Quantity must be greater than zero.");
        var item = FindItem(productId);

        if (item == null) return;

        item.Quantity -= quantity;
        if (item.Quantity <= 0) 
        {
            Items.Remove(item);
        }
    }


    private BasketItem? FindItem(int productId)
    {
        return Items.FirstOrDefault(item => item.ProductId == productId);
    }
}
