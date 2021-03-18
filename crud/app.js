var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const router = require('./routes/user_routes.js')
/**
 * parse requests of content-type - application/json
 */
app.use(bodyParser.json());
/**
 * parse requests of content-type - application/x-www-form-urlencoded
 */
app.use(bodyParser.urlencoded({ extended: false }));
// app.get('/', (req, res) => {
//     res.json({"message": "Congratulations! you are working great!"});
// });
app.listen(8000);
console.log("Listening to PORT 8000");

app.use("/", router);
app.use("/users", require("./routes/user_routes"));
