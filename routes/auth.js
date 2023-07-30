const User = require("../models/user");

const route = require("express").Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
route.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    console.log("savedUser: ", savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json(error);
  }
});

//LOGIN
route.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    console.log("user: ", !user);

    !user && res.status(401).json("Wrong credentails");

    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const decryptPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

    decryptPassword !== req.body.password &&
      res.status(401).json("Wrong Credentials");

    const { password, ...others } = user._doc;

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );

    res.status(200).json({...others, accessToken});
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json(error);
  }
});

module.exports = route;
