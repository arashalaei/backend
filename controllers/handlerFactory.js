/* jslint esversion : 8 */
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const APIFeatures = require("../utils/APIFeatures");

exports.deleteOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("No document found that ID", 404));
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
};



exports.updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
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
};


exports.createOne =   (Model) => {
  return catchAsync(async (req,res,next) => {
    const newDoc = await Model.create(req.body);
    res.status(200).json({
      status:'success',
      data:{
        data:newDoc
      }
    });
  });
};

exports.getOne = (Model, popOptions) => {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if(popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("Not fond", 400));
    }
    res.status(200).json({
      status: "success",
      data: {
        data:doc,
      },
    });
  });
};

exports.getAll = Model => {
  return catchAsync(async (req, res, next) => {
    // to allow to nested get reviews on tours(hack)
    let filter = {};
    if(req.params.tourId) filter = {tour:req.params.tourId};
    const features = new APIFeatures(Model.find(filter), req.query)
      .fillter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
  
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data:doc,
      },
    });
  });
};

