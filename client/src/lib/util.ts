import { Order } from "../app/models/order";

export function currencyFormat(amount: number) {
  return "$" + (amount / 100).toFixed(2);
}

export function filterEmptyValues(values: object) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
}

  // create a function to format the address string
  export const addressString = (order: Order) => {
    const address = order.shippingAddress;

    return `${address?.name}
    ${address?.line1}
    ${address?.line2}
    ${address?.city}
    ${address?.state}
    ${address?.postal_code}
    ${address?.country}
    `; 
  };

  // create a function to format the payment string
  export const paymentString = (order: Order) => {
    const card = order.paymentSummary;
    return `${card?.brand?.toUpperCase()} ending in ${card?.last4}, Exp: ${
      card?.exp_month
    }/${card?.exp_year}`;
  };