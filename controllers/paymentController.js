import Stripe from "stripe";

// Initialize Stripe with your secret key and API version
const stripe = Stripe(
  "sk_test_51OfEXLSCJiXBzcNpQI9pWWWiiqFPA1fEFtXpDDnI3YGjN5pRtCBHPEojyl79Sa3Olka6khQyPQk6VSsp6qIrJR0800CMthjm7R"
);
export const getPaymentIntent = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "AED",
      amount: 1999,
      description: " 1999",
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    console.log(e);
  }
};

export const configPayment = async (req, res) => {
  try {
    res.send({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.log(error);
  }
};

export const payment = async (req, res) => {
  let { amount, id } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "AED",
      description: "Payment",
      payment_method: id,
      confirm: true,
      return_url: "http://localhost:3000/",
    });

    console.log("Payment", payment);
    res.json({
      message: "Payment was successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
};
export const pay = async (req, res) => {
  try {
    const amount = req.body.amount;
    const customerEmail = req.body.email;
    const customerName = req.body.name;
    const address = req.body.address;

    // Search for existing customers by email
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1, // Assuming we only care about the first match
    });
    let customerId;

    if (existingCustomers.data.length > 0) {
      // Use the existing customer's ID
      customerId = existingCustomers.data[0].id;
    } else {
      // No existing customer found, create a new one
      const newCustomer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        address: {
          line1: address,
          city: address,
          postal_code: "",
          state: "",
          country: "",
        },
      });
      customerId = newCustomer.id;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      description: `${req.body.name} has initiated a payment`,
      currency: "AED",
      payment_method_types: ["card"],
    });

    const clientSecret = paymentIntent.client_secret;
    res.json({ clientSecret, message: "Payment Initiated", customerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}; 
 