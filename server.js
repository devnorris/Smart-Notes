"use strict";

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
var cookieParser = require("cookie-parser");
const imdb = require("imdb-api");
const axios = require("axios");
const ebay = require("ebay-api");
var flash = require("express-flash-messages");
const yelpKey = process.env.yelpKey;
const ebayID = process.env.ebayID;
const imdbKey = process.env.imdbKey;
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require("morgan");
const knexLogger = require("knex-logger");
const imports = require("./data-helpers.js");
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
var cookieSession = require("cookie-session");
const yelpConfig = {
  headers: { Authorization: yelpKey },
  params: {
    name: "",
    location: "Montreal"
  }
};

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(flash());
// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2", "key3"],
    maxAge: 24 * 60 * 60 * 1000
  })
);
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
  req.flash("notify", "This is a test notification.");
  res.render("index", {
    user: req.currentUser,
    info: req.flash("info"),
    errors: req.flash("errors")
  });
});

app.get("/register", (req, res) => {
  // req.session = null;
  res.render("register");
});

app.post("/register", (req, res) => {
  knex("users")
    .insert({
      // user_id: 5,
      email: req.body.email,
      password: req.body.password
    })
    .then(console.log("done"))
    .catch(err => console.log("error: ", err));

  req.session.user = req.body.email;
  // console.log("register redirection: ", req.session);
  res.redirect("/smart");
});

app.post("/login", (req, res) => {
  var sessionID = "";
  knex
    .from("users")
    // .where({ email: req.body.Logemail })
    .then(result => {
      for (let user of result) {
        if (user.password !== req.body.Logpassword) {
          console.log("not you");
        } else if (user.email !== req.body.Logemail) {
          return;
        } else if (
          user.password === req.body.Logpassword &&
          user.email === req.body.Logemail
        ) {
          req.session.user = req.body.Logemail;
          res.redirect("/smart");
        }
      }
    })
    .catch(err => console.log("login db error.", err));

  // req.session.user = req.body.Logemail;
  // res.redirect("/smart");
});

app.get("/smart", (req, res) => {
  let ejsVars = { user: req.session.user };
  console.log("vars", ejsVars);
  res.render("usersHome", ejsVars);
});

app.post("/smart", (req, res) => {
  let anchorWord = req.body.search.split(" ")[0].toLowerCase();
  let taskAdded = req.body.search
    .split(" ")
    .slice(1)
    .join(" ")
    .toLowerCase();
  let responseObj = { keyword: anchorWord, value: taskAdded };
  if (anchorWord === "eat") {
    yelpConfig.params.term = taskAdded; // Find restaurants

    axios
      .get("https://api.yelp.com/v3/businesses/search", yelpConfig)
      .then(response => {
        let businessList = response.data.businesses;
        console.log(businessList[0].name);
      })
      .catch(error => {
        console.log("Error!");
      });
  } //if eat
  // // ----------------------------------------------------------------------------------------------------------
  else if (anchorWord === "watch") {
    const findMovie = search => {
      // Find movies
      imdb
        .search(
          {
            title: taskAdded
          },
          {
            apiKey: "b1b27127"
          }
        )
        .then(result => {
          let movieArray = result.results;
          for (let searchResult of movieArray) {
            if (searchResult.title.toLowerCase() === taskAdded.toLowerCase()) {
              console.log("caught", searchResult.title);
            }
          }
        })
        .catch(console.log);
    }; //else if watch

    findMovie(taskAdded);
  } else if (anchorWord === "read") {
    const paramsBooks = {
      keywords: `${taskAdded}, Books`, // Search Ebay for Books
      domainFilter: [{ name: "domainName", value: "Books" }]
    };

    ebay.xmlRequest(
      {
        serviceName: "Finding",
        opType: "findItemsByKeywords",
        appId: ebayID,
        params: paramsBooks,
        parser: ebay.parseResponseJson
      },
      // gets all the items together in a merged array
      function itemsCallback(error, itemsResponse) {
        if (error) throw error;

        let items = itemsResponse.searchResult.item;

        knexitems[0].title;
      }
    ); //ebay api call
  } else if (anchorWord === "buy") {
    const paramsProduct = {
      keywords: taskAdded, // Search Ebay for products
      domainFilter: [{ name: "domainName", value: "Books" }]
    };

    ebay.xmlRequest(
      {
        serviceName: "Finding",
        opType: "findItemsByKeywords",
        appId: ebayID,
        params: paramsProduct,
        parser: ebay.parseResponseJson
      },
      // gets all the items together in a merged array
      function itemsCallback(error, itemsResponse) {
        if (error) throw error;

        let items = itemsResponse.searchResult.item;
      }
    );
  } //else if buy
  res.send(responseObj);
}); //post "/smart"

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
