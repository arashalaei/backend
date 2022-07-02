const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController.js");
const authController = require("../controllers/authController")

router
    .route("/:id")
    .post(authController.protect,authController.restrictTo('admin'), emailController.sendEmailToAll);

module.exports = router;
