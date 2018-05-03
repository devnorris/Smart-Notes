"use strict";

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const imdb = require("imdb-api");

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require("morgan");
const knexLogger = require("knex-logger");

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Accessing IMDB hardCoded movies

function findMovie() {
  imdb
    .search(
      {
        title: "Toxic Avenger"
      },
      {
        apiKey: "b1b27127"
      }
    )
    .then(console.log)
    .catch(console.log);
}

// findMov
knex("midterm")
  .select()
  .from("users")
  .then(result => {
    console.log("done", result);
  });

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  console.log("loaded add code");
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/smart", (req, res) => {
  console.log("user logged in and verified");
  res.render("usersHome");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
