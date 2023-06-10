const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./user");
const jwt = require("jsonwebtoken");
const { wrapper, isAuth } = require("./utils");
const passport = require("passport");

mongoose.set("strictQuery", false);
mongoose
  .connect("mongodb://127.0.0.1:27017/passportJWT")
  .then((res) => console.log("Connection Successful to MongoDB"))
  .catch((err) => console.log("Connection error"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
require("./passportConfig");

app.post(
  "/register",
  wrapper(async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 2);
    const newUser = new User({
      username,
      password: hashPassword,
    });
    await newUser.save();
    return res.send({
      message: "User registered",
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    });
  })
);

app.post(
  "/login",
  wrapper(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.send({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const payload = {
        id: user._id,
        username: user.username,
      };
      // jwt.sign(payload,secret,[options,options])
      const token = jwt.sign(payload, "12345@abc", { expiresIn: "1d" });
      //-------
      await User.findByIdAndUpdate(user._id, {
        token: { token, signedAt: Date.now().toString() },
      });
      //--------
      return res.send({
        message: "Logged in successfully!",
        token: "bearer " + token,
      });
    } else {
      return res.send({
        message: "Incorrect password",
      });
    }
  })
);

app.post(
  "/logout",
  isAuth,
  wrapper(async (req, res) => {
    // console.log(req.user);
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.send({ message: "Failed to sign out!" });
      }

      await User.findByIdAndUpdate(req.user._id, { token: {} });
      return res.send({ message: "You have signed out!" });
    }
  })
);

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    if (req.user.token.token === token) {
      return res.send({
        message: "You are logged in",
        info: "This is sensitive data",
        user: {
          id: req.user._id,
          username: req.user.username,
        },
      });
    } else {
      return res.send({
        message: "Your token has expired",
      });
    }
  }
);

app.use((err, req, res, next) => {
  res.send({ message: "ERROR!", error: err });
});

app.listen(4000, () => console.log("Live at 4000"));
