const Course = require("../models/courseModel");
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email')

exports.sendEmailToAll = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const course = await Course.findById(id).populate({path: 'students', select: 'name email score -course' })
    if(!course) return next(new AppError("No course found with that id", 404));

    const promises = []
    const course_name = course.course_name;
    const instructor = course.instructor;
    let msg = ``;
    for(const student of course.students){
        msg += `student's name: ${student['name']}
                Course name: ${course_name}
                Instructor: ${instructor}
                Score: ${student['score']}
                Body: ${req.body.body ?req.body.body : 'empty'}
        `;

        promises.push(sendEmail({email: student['email'],subject: `Hi ${student['name']}`,message:msg}))
        msg = '';
    }

    let results = await Promise.all(promises)
    let finalres = []
    for(const r of results){
        if(!r) finalres.push({code: 200})
        else finalres.push({code: 500})
    }

    res.status(200).json({
        status: 'success', 
        data: {
            finalres        
        }
    })
})