const express = require("express");
const handlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("./config/passport");
const methodOverride = require("method-override");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const db = require("./models");
const app = express();
const PORT = process.env.PORT || 3000;

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use("/upload", express.static(__dirname + "/upload"));

app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});

require("./routes")(app, passport);

module.exports = app;
