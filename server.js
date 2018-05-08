"use strict";

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const cookieParser = require("cookie-parser");
const imdb = require("imdb-api");
const axios = require("axios");
const ebay = require("ebay-api");
const flash = require("express-flash-messages");
const yelpKey = process.env.yelpKey;
const cookieSession = require("cookie-session");
const ebayID = process.env.ebayID;
const imdbKey = process.env.imdbKey;
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require("morgan");
const knexLogger = require("knex-logger");
const imports = require("./data-helpers.js");
// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
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
// app.use(loginRoutes);

// Home page
app.get("/", (req, res) => {
  let ejsVars = { user: req.session.user };
  res.render("index", ejsVars);
});

app.get("/register", (req, res) => {
  let ejsVars = { user: req.session.user };
  res.render("register", ejsVars);
});

app.post("/register", (req, res) => {
  knex("users")
    .insert({
      email: req.body.email,
      password: req.body.password
    })
    .then(console.log("done"))
    .catch(err => console.log("error: ", err));
  knex("todo")
    .insert({
      user_id: 1
    })
    .then(console.log("done"))
    .catch(err => console.log("error: ", err));

  req.session.user = req.body.email.split("@")[0];
  res.redirect("/smart");
});

app.post("/login", (req, res) => {
  knex
    .from("users")
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
          req.session.user = req.body.Logemail.split("@")[0];
          res.redirect("/smart");
        }
      }
    })
    .catch(err => console.log("login db error.", err));
});

app.get("/smart", (req, res) => {
  let ejsVars = { user: req.session.user, todoName: "", todoRef: "" };
  knex("todo")
    .where({ user_id: 1 })
    .then(response => {
      for (let objects of response) {
        ejsVars.todoName = objects.todo_name;
        ejsVars.todoRef = objects.todo_reference;
        // console.log("added obj ", ejsVars);
      }
    });
  // console.log("vars", ejsVars);
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
  if (anchorWord === "eat at" || anchorWord === "manger chez") {
    yelpConfig.params.term = taskAdded; // Find restaurants

    axios
      .get("https://api.yelp.com/v3/businesses/search", yelpConfig)
      .then(response => {
        let businessList = response.data.businesses;
        res.json(
          responseObj,
          `${businessList[0].name}, ${businessList[0].rating}, ${
            businessList[0].location.address1
          }`
        );

        knex("todo") // knex call to add api item to todo_reference
          .insert({
            todo_name: `${responseObj.keyword} ${responseObj.value}`,
            todo_reference: `${businessList[0].name}`
          })
          .then(console.log("done"))
          .catch(err => console.log("error: ", err));
      });
  } //if eat
  // // ----------------------------------------------------------------------------------------------------------
  else if (anchorWord === "watch" || anchorWord == "regarder") {
    console.log("watch executed");
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
          responseObj.movieResult = result;
          res.json(responseObj); //entire result of API, tested and functionnal
          let movieArray = result.results;
          knex("todo") // knex call to add api item to todo_reference
            .insert({
              todo_name: `${responseObj.keyword} ${responseObj.value}`,
              todo_reference: `${movieArray[0].title}, ${movieArray[0].year}`,
              user_id: 1
            })
            .then(console.log("done"))
            .catch(err => console.log("error: ", err));
        });
    }; //else if watch

    findMovie(taskAdded);
  } else if (anchorWord === "read" || anchorWord === "lire") {
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
        let items = itemsResponse.searchResult.item;
        responseObj.bookResults = items;
        res.json(responseObj);

        if (error) throw error;
        knex("todo") // knex call to add api item to todo_reference
          .insert({
            todo_name: `${responseObj.keyword} ${responseObj.value}`,
            todo_reference: `${items[0].title}`
          })
          .then(console.log("done"))

          .catch(err => console.log("error: ", err));
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
        // res.json("ebay merchandise ", itemsResponse);

        knex("todo") // knex call to add api item to todo_reference
          .insert({
            todo_name: `${responseObj.keyword} ${responseObj.value}`,
            todo_reference: `${items[0].title}`
          })
          .then(console.log("done"))
          .catch(err => console.log("error: ", err));
      }
    );
  } //else if buy

  knex("category")
    .insert({
      category_name: `${responseObj.keyword}`
    })
    .then(console.log("done"))
    .catch(err => console.log("error: ", err));

  // res.json(responseObj);
}); //post "/smart"

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
