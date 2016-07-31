/**
 * Created by perry on 16/7/29.
 * 首页
 */
var Movie = require('../models/movie');
var Category = require('../models/category');
// index page
exports.index = function (req, res) {
  console.log("user in session:");
  console.log(req.session.user);

  Category
    .find({})
    .populate({path: 'movies', options: {limit: 5}})
    .exec(function(err, categories){
      if (err) {
        console.log(err);
      }
      res.render('index', {
        title: 'index 首页',
        categories: categories
      });
    });

};
