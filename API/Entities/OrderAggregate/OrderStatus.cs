using System;

namespace API.Entities.OrderAggregate
{
    /**
     * Enum representing the possible statuses of an order
     */
    public enum OrderStatus
    {
        Pending,
        PaymentReceived,
        PaymentFailed,
    }
}
