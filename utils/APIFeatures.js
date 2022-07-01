/* jshint esversion : 9 */

class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    fillter() {
      // 1A.FILTERING
      const queryObject = { ...this.queryString };
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((el) => delete queryObject[el]);
  
      // 1B. ADVANCE FILTERING
      let queryStr = JSON.stringify(queryObject);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
  
      this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("-createdAt");
      }
  
      return this;
    }
  
    limitFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select("-__v");
      }
  
      return this;
    }
  
    paginate() {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  }
  
  module.exports = APIFeatures;
  
  
  
  
   // BUILD QUERRY
      // // 1A.FILTERING
      // const queryObject = { ...req.query };
      // const excludedFields = ["page", "sort", "limit", "fields"];
      // excludedFields.forEach(el => delete queryObject[el]);
  
      // // 1B. ADVANCE FILTERING
      // let queryStr = JSON.stringify(queryObject);
      // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match => `$${match}`);
  
      // let query = Tour.find(JSON.parse(queryStr));
  
      // 2. SORTING
      // if(req.query.sort){
      //   const sortBy = req.query.sort.split(',').join(' ');
      //   query = query.sort(sortBy);
      // } else {
      //   query = query.sort('-createdAt');
      // }
      
      // 3. Filed limiting
      // if(req.query.fields){
      //   const fields = req.query.fields.split(',').join(' ');
      //   query = query.select(fields);
      // } else {
      //   query = query.select('-__v');
      // }
  
      // 4. Pagination
      // const page = +req.query.page || 1;
      // const limit = +req.query.limit || 100;
      // const skip = (page - 1) * limit;
      // query = query.skip(skip).limit(limit);
  
      // if(req.query.page){
      //   const numTour = await Tour.countDocuments();
      //   if(skip >= numTour){
      //     throw new Error('This page not exist');
      //   }
      // }