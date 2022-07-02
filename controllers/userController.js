/* jshint esversion : 8 */

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');
const multer = require('multer');


const multerStorage = multer.diskStorage({
  destination:(req,file,cb) => {
    cb(null,'public/img/users');
  },
  filename:(req,file,cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null,`user-${req.user._id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req,file,cb) => {
   if(file.mimetype.startsWith('image')){
     cb(null,true);
   } else {
     cb(new AppError('Not an image ! please upload only images',400),false);
   }
};

const upload = multer({
  storage:multerStorage,
  fileFilter:multerFilter
});

exports.uploadUserPhoto = upload.single('photo');


const filterObj = (obj,...allowedFileds) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFileds.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async(req,res,next) => {
  console.log(req.file);
  console.log(req.body);
  // 1) Create error if POSTs password data
  if(req.body.password || req.body.passwordConfirm)  return next(new AppError('This route is not for password updates, Please use / updateMyPassword',400));
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body,'name','email');
  if(req.file) filteredBody.photo = req.file.filename;
  // 3) Update user documnet
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{ new:true,runValidators:true});
  res.status(200).json({
    status:'success',
    data:{
      user:updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req,res,next) => {
  await User.findByIdAndUpdate(req.user.id ,{active:false});

  res.status(204).json({
    status:'success',
    data: null
  });
});

exports.createUser = (rq, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route in not yet defiend',
  });
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//Do not update password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);


exports.getMe = (req,res,next) => {
  req.params.id = req.user._id;
  next();
};