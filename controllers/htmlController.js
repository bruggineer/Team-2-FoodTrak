// Requiring path to so we can use relative routes to our HTML files
const router = require("express").Router();
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

/**
 * Home Page
 */
router.get("/", function(req, res) {
  res.render("index", { user: req.user})
});

/**
 * Home Page, again
 */
router.get("/home", function(req, res) {
  res.render("index", { user: req.user});
});

/**
 * Signup page
 */
router.get("/signup", function(req, res) {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("signup", { user: req.user});
  }
});

/**
 * Login page
 */
router.get("/login", function(req, res) {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login", { user: req.user});
  }
});

/**
 * Forum Page -
 * Notice loading our posts, with that include!
 */
router.get("/forum", isAuthenticated, function(req, res, next) {
  db.Post.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10, raw: true, include: [db.User] }) // Joins User to Posts! And scrapes all the seqeulize stuff off
    .then(dbModel => {
      res.render("forum", { user: req.user, posts: dbModel});
    })
    .catch(err => res.status(422).json(err))
});

/**
 * Forum Page -
 * Notice loading our posts, with that include!
 */
router.get("/forum/category/:category", isAuthenticated, function(req, res) {
  db.Post.findAll({ where: {category: req.params.category},
    order: [["createdAt", "DESC"]],
    limit: 10, raw: true, include: [db.User] }) // Joins User to Posts! And scrapes all the seqeulize stuff off
    .then(dbModel => {
      res.render("forum", { user: req.user, posts: dbModel });
    })
    .catch(err => res.status(422).json(err));
});

router.get("/logfood", isAuthenticated, function(req, res) {
  res.render("logfood", { user: req.user});
});

router.get("/dashboard", isAuthenticated, function(req, res) {
  db.UsersFood.findAll({
    include: [db.Food],
    where: {
      UserId: req.user.id
    }
  }).then(function(dbUsersFood) {
    console.log(dbUsersFood);
    res.render("dashboard", { user: req.user, usersFood: dbUsersFood});
  });
});
/**
 * Generic Error Page
 */
router.get("*", function(req, res) {
  res.render("errors/404", { user: req.user });
});

module.exports = router;
