using API.Entities.OrderAggregate;


namespace API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public required string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = [];
        public decimal Subtotal { get; set; }
        public decimal DeliveryFee { get; set; }
        public required string Status { get; set; }
        public required ShippingAddress ShippingAddress { get; set; }
        public required PaymentSummary PaymentSummary { get; set; }
        public long Total { get; set; }
        public long Discount { get; set; }
    }
}
