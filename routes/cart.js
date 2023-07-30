const route = require("express").Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Cart = require("../models/cart");

//CREATE
route.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedProduct = await newCart.save();
    res.status(201).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Update
route.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (erorr) {
    res.status(500).json(error);
  }
});

//DELETE
route.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    req.status(200).json("Cart has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET User Cart
route.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const Cart = await Cart.findOne({
      userId: req.params.userId,
    });
    res.status(200).json(Cart);
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET ALL
route.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = route;
