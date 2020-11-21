const express = require("express");
const Place = require("../models/place");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");

const User = require("../models/user");
const { json } = require("body-parser");
const e = require("express");
//const user = require("../models/user");

router.post("/sign-up", (req, res, next) => {
  bcrypt.hash(req.body.passwd, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      passwd: hash,
      hasPlace: false,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

router.post("/sign-in", (req, res, next) => {
  let newUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Aith failed",
        });
      }
      newUser = user;
      return bcrypt.compare(req.body.passwd, user.passwd);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      const token = jwt.sign(
        { email: newUser.email, userId: newUser._id },
        "secretofmine",
        { expiresIn: "3h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 10800,
        userId: newUser._id,
        hasPlace: newUser.hasPlace,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: err,
      });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  User.findById(req.params.id).then((user) => {
    if (user) {
      res.status(200).json({
        hasPlace: user.hasPlace,
      });
    } else {
      res.status(401).json({
        message: "user not found",
      });
    }
  });
});

module.exports = router;
