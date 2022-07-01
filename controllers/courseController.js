/* jshint esversion : 9 */

const Course = require("../models/courseModel");
const factory = require("./handlerFactory");

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, { path: "students" });
exports.createCourse = factory.createOne(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);