const multer = require("multer");
const upload = multer({ dest: "temp/" });

const restController = require("../controllers/restController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
const user = require("../models/user.js");

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/signin");
  };
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };

  app.get("/", (req, res) => res.redirect("/restaurants"));
  app.get("/restaurants", authenticated, restController.getRestaurants);

  app.get("/admin", authenticatedAdmin, (req, res) =>
    res.redirect("/admin/restaurants")
  );
  app.get(
    "/admin/restaurants",
    authenticatedAdmin,
    adminController.getRestaurants
  );
  app.post(
    "/admin/restaurants",
    authenticatedAdmin,
    upload.single("image"),
    adminController.postRestaurant
  );
  app.get(
    "/admin/restaurants/create",
    authenticatedAdmin,
    adminController.createRestaurant
  );
  app.get(
    "/admin/restaurants/:id/edit",
    authenticatedAdmin,
    adminController.editRestaurant
  );
  app.get(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.getRestaurant
  );
  app.put(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    upload.single("image"),
    adminController.putRestaurant
  );
  app.delete(
    "/admin/restaurants/:id",
    authenticatedAdmin,
    adminController.deleteRestaurant
  );

  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true,
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);

  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);
};
