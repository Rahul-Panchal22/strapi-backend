const route = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

route.get("/paymentCheckout", (req, res) => {
  console.log(req.protocol);
  console.log(req.get("host"));
  const url = "http://localhost:3001/api/payments/checkout?amount=500";
  res.status(200).json(url);
});

route.get("/success", (req, res) => {
  res.render("success");
});

route.get("/cencel", (req, res) => {
  res.render("cancel");
});

route.post("/pay", async (req, res) => {
  const { amount, currency, payment_method_id } = req.body;

  try {
    let paymentIntent;

    if (payment_method_id) {
      // If payment method ID is provided, use it to create a Payment Intent
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        payment_method: payment_method_id,
        confirm: true,
      });
    } else {
      // If no payment method ID is provided, create Payment Intent without it
      paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
      });
    }

    console.log(req.originalUrl);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    res.json({ success: true, paymentIntent, baseUrl: baseUrl });
  } catch (err) {
    console.error("Error creating Payment Intent:", err.message);
    res
      .status(500)
      .json({ success: false, error: "Failed to create Payment Intent" });
  }
});

route.get("/checkout", (req, res) => {
  const preFilledAmount = req.query.amount;
  const preFilledCurrency = "usd";

  res.render("checkout", { preFilledAmount, preFilledCurrency });
});

route.get("/sucess");

module.exports = route;
