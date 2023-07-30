const route = require("express").Router();

const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Product = require("../models/product");

//CREATE
route.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

route.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (erorr) {
    res.status(500).json(error);
  }
});

//DELETE
route.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.status(200).json("Product has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET Product
route.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e);
  }
});

// GET ALL USERS
route.get("/", verifyTokenAndAdmin, async (req, res) => {
  const qNew = req.query.new;
  const gCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find()
        .sort({
          createdAt: -1,
        })
        .limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products) ;
  } catch (e) {
    res.status(500).json(e);
  }
});
module.exports = route;
