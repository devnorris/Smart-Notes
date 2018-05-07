// "use strict";
// const express = require("express");
// const PORT = process.env.PORT || 8080;
// const router = express.Router();
// const ENV = process.env.ENV || "development";
// const knexConfig = require("../knexfile");
// const app = express();
// const knex = require("knex")(knexConfig[ENV]);

// module.exports = login => {
//   app.post("/login", (req, res) => {
//     knex
//       .from("users")
//       .then(result => {
//         for (let user of result) {
//           if (user.password !== req.body.Logpassword) {
//             console.log("not you");
//           } else if (user.email !== req.body.Logemail) {
//             return;
//           } else if (
//             user.password === req.body.Logpassword &&
//             user.email === req.body.Logemail
//           ) {
//             req.session.user = req.body.Logemail.split("@")[0];
//             res.redirect("/smart");
//           }
//         }
//       })
//       .catch(err => console.log("login db error.", err));
//   });
//   return router;
//   app.listen(PORT, () => {
//     console.log("Example app listening on port " + PORT);
//   });
// };
