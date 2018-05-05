"use strict";

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const imdb = require('imdb-api');
const axios = require('axios');
const ebay = require('ebay-api');

const yelpKey = process.env.yelpKey;
const ebayID = process.env.ebayID;
const imdbKey = process.env.imdbKey;

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

const yelpConfig = {
  headers: {Authorization: yelpKey},
  params: {
    name: '',
    location: 'Montreal'
      }
};

function findMovie(search) {
  imdb.search({
    title: search
  },
  { apiKey: imdbKey})
    .then(result => {
      let movieArray = result.results;
        for(let searchResult of movieArray) {
          if (searchResult.title.toLowerCase() === search.toLowerCase()) {
            (searchResult.title + ' ' + searchResult.year);
          }
        }
    })
    .catch(console.log);
};


const confirmEntry = (array, input) => {
  for (let i = 0; i < 3; i++) {
    if (array[i].name.toLowerCase() === input.toLowerCase()) {
      console.log(array[i].name);
      // console.log(array[i].location.address1);
    } else {
      console.log("Not found");
    }
  }
};




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
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  knex('users')
    .insert({user_id: 5,
             email: req.body.email,
             password: req.body.password})
    .then(console.log("done"))
    .catch(err => console.log("error: ", err))
    .finally(() => {
      console.log("kill connection");
      knex.destroy();
    });
  res.redirect("/smart");
});

app.get("/smart", (req, res) => {
  console.log("user logged in and verified");
  res.render("usersHome");
});


app.post("/smart", (req, res) => {
// yelpConfig.params.term = req.body.search; // Find restaurants
//   axios
//     .get("https://api.yelp.com/v3/businesses/search", yelpConfig)
//     .then(response => {
//       let businessList = response.data.businesses;
//       res.send(businessList[0].name);
//       // confirmEntry(businessList, req.body.search);
//     })
//     .catch(error => {
//       console.log("Error!");
//     });


// ----------------------------------------------------------------------------------------------------------
// function findMovie() {
//   imdb.search({
//     title: req.body.search
//   },
//   { apiKey: imdbKey})
//     .then(result => {
//       let movieArray = result.results;
//         for(let searchResult of movieArray) {
//          if (searchResult.title.toLowerCase() === req.body.search.toLowerCase()) {
//             res.send(searchResult.title + ' ' + searchResult.year);
//           }
//         }
//     })
//     .catch(console.log);
// };

// findMovie(req.body.search);

// ---------------------------------------------------------------------------------------------------------------
const paramsBooks = {
  keywords: `${req.body.search}, Books`, // Search Ebay for Books
  domainFilter: [
    {name: 'domainName', value: 'Books'}
  ]
};

ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: ebayID,
    params: paramsBooks,
    parser: ebay.parseResponseJson
  },
  // gets all the items together in a merged array
  function itemsCallback(error, itemsResponse) {
    if (error) throw error;

    let items = itemsResponse.searchResult.item;

    //for (let i = 0; i < items.length; i++) {

       console.log(items[0].title);

});
//---------------------------------------------------------------------------------------

// const paramsProduct = {
//   keywords: `${req.body.search}`, // Search Ebay for products
//   domainFilter: [
//     {name: 'domainName', value: 'Books'}
//   ]
// };

// ebay.xmlRequest({
//     serviceName: 'Finding',
//     opType: 'findItemsByKeywords',
//     appId: ebayID,
//     params: paramsProduct,
//     parser: ebay.parseResponseJson
//   },
//   // gets all the items together in a merged array
//   function itemsCallback(error, itemsResponse) {
//     if (error) throw error;

//     let items = itemsResponse.searchResult.item;

//     for (let i = 0; i < items.length; i++) {

//        res.send(items[0].primaryCategory);
//   }
// });


 });



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

