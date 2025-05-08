const express = require("express");
const session = require("express-session");
const axios = require("axios");
const app = express();
const multer = require("multer");
const path = require("path");

app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({ secret: "mysession", resave: false, saveUninitialized: true })
);

const url = "http://localhost:3000";

app.get("/", (req, res) => {
  res.render("test");
});

// app.get("/test", (req, res) => {
//     res.render("test",);
// });

app.listen(5500, () => {
  console.log(`Server is running on http://localhost:5500`);
});
