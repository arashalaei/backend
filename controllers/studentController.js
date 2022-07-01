/* jshint esversion : 9 */

const Student = require("../models/studentModel");
const factory = require("./handlerFactory");

exports.getAllStudents = factory.getAll(Student);
exports.getStudent = factory.getOne(Student, { path: "course" });
exports.createStudent = factory.createOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.deleteStudent = factory.deleteOne(Student);