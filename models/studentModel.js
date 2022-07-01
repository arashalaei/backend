/* jslint esversion:8 */

const mongoose = require("mongoose");
const validator = require('validator');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us student's name"]
        }, 
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please privide a valid email"],
    }, 
    course: {
        type: mongoose.Schema.ObjectId,
        ref: "Course",
        required:[true,'Student must belong to a courses']
    }, 
    score: {
        type: Number, 
        required: [true, "Please provide a score"],
        min:[0,'Score must be above 0.0'], 
        max:[20,'Score must be below 20.0']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

studentSchema.pre(/^find/,function(next){
    this.populate({
        path:'course'
    });
    next();
});


const Student = mongoose.model("Student", studentSchema);
module.exports = Student;