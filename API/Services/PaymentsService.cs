using System;
using API.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;

namespace API.Services
{   
    // PaymentsService is a service for creating and updating payment intents
    // Use Dependency Injection to inject the IConfiguration service
    // to get the secret key from the configuration
    public class PaymentsService(IConfiguration configuration)
    {
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            
            // get secret key from configuration
            StripeConfiguration.ApiKey = configuration["StripeSettings:SecretKey"];

            // get intet service from stripe
            var service = new PaymentIntentService();

            // get payment intent from stripe
            var intent = new PaymentIntent();

            // caculate and get subtotal count from basket
            var subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
            
            // set delivery fee to 500 if subtotal is less than 10000
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            // check if the payment intent id is not null
            // if it is empty, create a new payment intent
            // if it is not empty, update the payment intent
            // if the payment intent id is not null, update the payment intent
            if (string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                // create a new payment intent object
                var options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                // create a new payment intent
                intent = await service.CreateAsync(options);
            }
            else
            {
                // update the payment intent object
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };
                // update the payment intent
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            // return the payment intent
            return intent;
        }
    }
}
