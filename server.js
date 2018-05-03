"use strict";

require("dotenv").config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const axios       = require('axios');
const imdb        = require('imdb-api');
var amazon        = require('amazon-product-api');


const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");


// Accessing IMDB hardCoded movies

function findMovie() {
  imdb.search({
  title: 'Lost in Space'
}, {
  apiKey: 'b1b27127'
}).then(console.log).catch(console.log);
}

findMovie();


// AMAZON

var client = amazon.createClient({
  awsId: "AKIAJHKSTWB2FNG277KQ",
  awsSecret: "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",
  awsTag: "aws Tag"
});


client.itemSearch({
  director: 'Quentin Tarantino',
  actor: 'Samuel L. Jackson',
  searchIndex: 'DVD',
  audienceRating: 'R',
  responseGroup: 'ItemAttributes,Offers,Images'
}, function(err, results, response) {
  if (err) {
    console.log(err);
  } else {
    console.log(results);  // products (Array of Object)
    console.log(response); // response (Array where the first element is an Object that contains Request, Item, etc.)
  }
});


// YELP

var options = {
  url: "https://api.yelp.com/v3/businesses/WavvLdfdP6g8aZTtbBQHTw", // /WavvLdfdP6g8aZTtbBQHTw -> this will need to be replaced with the ID or the name of the business somehow
  method: "GET",
  headers: {
  Authorization: 'Bearer ljvAkdySd47VOtVuRevvA2gDzWV7HY_ygpueNz8upFoAxREDaKk9PFPqaIzUvnzWIqV1pbah3RyJRldy5JZm3HnNR28Ywfnah9gP_orRGh31nshwVNccAP5D-jnrWnYx'
  }
};

axios(options)
.then(response => {
  console.log(response.data);
  console.log(response.status)
})
.catch(error => {
  console.log("Oh No!");
});


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded"
  })
);
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
