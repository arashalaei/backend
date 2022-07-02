const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController.js");
const authController = require("../controllers/authController")

router
    .route("/")
    .get(studentController.getAllStudents)
    .post(authController.protect,authController.restrictTo('admin'), studentController.createStudent);

router
    .route("/:id")
    .get(studentController.getStudent)
    .patch(authController.protect,authController.restrictTo('admin'), studentController.updateStudent)
    .delete(authController.protect,authController.restrictTo('admin'), studentController.deleteStudent);

module.exports = router;
