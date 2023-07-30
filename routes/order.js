const route = require("express").Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/order");

//CREATE
route.post("/", verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedProduct = await newOrder.save();
    res.status(201).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Update
route.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (erorr) {
    res.status(500).json(error);
  }
});

//DELETE
route.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.status(200).json("Cart has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET User Order
route.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const Orders = await Order.findOne({
      userId: req.params.userId,
    });
    res.status(200).json(Orders);
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET ALL
route.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get Monthly Income
route.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousMonth,
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: {
            $sum: "$sales",
          },
        },
      },
    ]);

    res.status(200).json(income);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = route;
