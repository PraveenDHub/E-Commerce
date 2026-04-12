import stripe from "../utils/stripe.js";

// export const processPayment = async (req, res) => {

//   try {
//     const { amount } = req.body;
//     console.log("Payment amount received:", amount);

//     if (!amount || isNaN(amount) || amount <= 0) {
//       return res.status(400).json({ message: "Invalid payment amount" });
//     }

//     const amountInPaise = Math.round(amount * 100);
//     console.log("Amount in paise:", amountInPaise);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInPaise,
//       currency: "inr",
//     });

//     res.status(200).json({
//       success: true,
//       client_secret: paymentIntent.client_secret,
//     });

//   } catch (error) {
//     console.error("Payment processing error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

//JVL Code

export const processPayment = async (req, res) => {
  try {
    const { amount, shipping } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100, // 💥 USD → cents
      currency: "usd", // ✅ change to USD

      shipping: {
        name: req.user?.name || shipping.name,
        phone: shipping.phone,
        address: {
          line1: shipping.address.line1,
          city: shipping.address.city,
          state: shipping.address.state,
          postal_code: shipping.address.pinCode,
          country: "US",
        },
      },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });

  } catch (error) {
    console.error("Payment processing error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendStripeApiKey = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      stripeApiKey: process.env.STRIPE_API_KEY,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      res.status(200).json({
        success: true,
        message: "Payment verified",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
