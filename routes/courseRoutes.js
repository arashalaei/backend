const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController.js");
const authController = require("../controllers/authController")

router
    .route("/")
    .get(courseController.getAllCourses)
    .post(authController.protect,authController.restrictTo('admin'), courseController.createCourse);

router
    .route("/:id")
    .get(courseController.getCourse)
    .patch(authController.protect,authController.restrictTo('admin'), courseController.uploadFile, courseController.updateCourse)
    .delete(authController.protect,authController.restrictTo('admin'), courseController.deleteCourse);

module.exports = router;
