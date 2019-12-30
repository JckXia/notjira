const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoClient = require("mongodb").MongoClient;

// GrpahQL related dependencies
const graphQLSchema = require("./graphql/schema/index");
const rootResolver = require("./graphql/resolver/index");
const graphQLHttp = require("express-graphql");
//-----------------------------

const user = require("./routes/user.route");
const github = require("./routes/github.route");
const auth = require("./routes/auth.route");
const task = require("./routes/task.route");

let dev_db_url =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/JiraBackEnd";
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

mongoose.connect(dev_db_url, { useNewUrlParser: true }, function(err, db) {
  if (err) {
    throw err;
  }
  console.log("Mongoose successfully connected to database");
});

mongoose.Promise = global.Promise;

MongoClient.connect(dev_db_url, { useNewUrlParser: true }, function(err, db) {
  if (err) {
    throw err;
  }
  console.log("Mongodb is running on port", db.topology.s.port);
});

console.log("Running passport related functions");

require("./services/gitpass")(passport);
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["indasjdNSd421$SDssssma$s"]
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Put all API endpoints under '/api'
app.use("/user", user);
//app.use('/card',card);
app.use("/", github);
app.use("/", auth);
app.use("/api", task);

app.use(
  "/graphql",
  graphQLHttp(req => ({
    schema: graphQLSchema,
    rootValue: rootResolver,
    context: { requestBody: req, user: req.user },
    graphiql: process.env.NODE_ENV !== "production"
  }))
);
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == "production") {
  app.get("*", (req, res) => {
    console.log("CAN YOU HEAR ME");
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}
const port = process.env.PORT || 8080;
app.listen(port);

console.log(`Password generator listening on ${port}`);
