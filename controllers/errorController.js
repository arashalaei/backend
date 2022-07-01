/* jslint esversion:9 */

const AppError = require("./../utils/AppError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (err) => {
  const message = `Duplicate field value: *${err.keyValue.name}*. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(" / ")}`;
  return new AppError(message, 400);
};

const handlerJWTError = (err) => {
  const message = `Invalid token. Please log in again!`;
  return new AppError(message, 401);
};

const handlerJWTExpiredError = (err) => {
  const message = `Your token has expired! Please log in again`;
  return new AppError(message, 401);
};

const sendErrorDev = (err,req, res) => {
  if(req.originalUrl.startsWith('/api')){
    //API
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }else{
    console.error("ERROR", err);
    // RENDERING
    res.status(err.statusCode).render('error',{
      title:'Somthing went wrongs',
      msg:err.message
    });
  }
  
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    // Opertinoal, trusted err:send message to client
    if (err.isOpertional) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error:do't leak error details
    }
    // 1) Log error
    console.error("ERROR", err);
    // 2) Send generic message
    return res.status(500).json({
      status: "error",
      message: "Somthing went very wrong!",
    });
  }
  // RENDERING
  if (err.isOpertional) {
    return res.status(err.statusCode).render('error',{
      title:'Somthing went wrong',
      msg: err.message,
    });
    // Programming or other unknown error:do't leak error details
  }
  // 1) Log error
  console.error("ERROR", err);
  // 2) Send generic message
  return res.status(500).render('error',{
    title:'Somthing went wrong',
    msg: "Please try again",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "fail";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err,req,res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicatedFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handlerJWTError(error);
    if (error.name === "TokenExpiredError")
      error = handlerJWTExpiredError(error);
    sendErrorProd(error,req,res);
  }
  next();
};
