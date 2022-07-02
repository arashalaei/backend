/* jslint esversion:8 */

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    course_name: {
        type: String,
        required: [true, "Please tell us course name"],
    }, 
    instructor: {
        type: String,
        required: [true, "Please provide an instructor"],
    }, 
    file: String
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

// Virtual populate
courseSchema.virtual('students',{
    ref:'Student',
    foreignField:'course',
    localField:'_id'
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;