/* jshint esversion : 9 */

const Course = require("../models/courseModel");
const factory = require("./handlerFactory");
const multer = require('multer');
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const multerStorage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,'public/course');
  },
  filename:(req,file,cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null,`course-${req.user._id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req,file,cb) => {
    console.log(file.mimetype)
   if(file.mimetype.includes('csv') || file.mimetype.includes('excel') || file.mimetype.includes('xml')){
     cb(null,true);
   } else {
     cb(new AppError('Not a valid file ! please upload only csv, excel or xml',400),false);
   }
};

const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
});

exports.uploadFile = upload.single('file');

exports.getAllCourses = factory.getAll(Course);
exports.getCourse = factory.getOne(Course, { path: "students" });
exports.createCourse = factory.createOne(Course);
// exports.updateCourse = factory.updateOne(Course);
exports.updateCourse = catchAsync(async (req, res, next) => {
    if(req.file) req.body.file = req.file.filename;
    const doc = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!doc) {
        return next(new AppError("No document found with that id", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
        data: doc,
        },
    });
});

exports.deleteCourse = factory.deleteOne(Course);