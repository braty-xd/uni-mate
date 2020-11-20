const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");

const app = express();

mongoose.set("useCreateIndex", true);

mongoose
  .connect(
    "mongodb+srv://braty:gsyu6wzsgptB7K6e@cluster0.5ikxw.mongodb.net/places?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch(() => {
    console.log("cant connect to db");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// app.use("/api/posts", (req, res, next) => {
//   res.json();
// });

module.exports = app;

// gsyu6wzsgptB7K6e
// braty
