require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const stripeRoute = require("./routes/stripe");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database Connection successfull!");
  })
  .catch((error) => {
    console.log(error);
  });

app.set("view engine", "ejs");

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/auths", authRoute);
app.use("/api/payments", stripeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `backend server is running at http://localhost:${process.env.PORT}`
  );
});
