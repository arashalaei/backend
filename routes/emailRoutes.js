const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController.js");

router
    .route("/:id")
    .post(emailController.sendEmailToAll);

module.exports = router;
