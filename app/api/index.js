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
    .exec(function (err, categories) {
      if (err) {
        console.log(err);
        res.json({status: 'error', msg: '请求失败！', err: err});
      }
      res.json('index', {
        status: 'success',
        msg: '请求成功！',
        data: {
          title: 'index 首页',
          categories: categories
        }
      });
    });

};

// 搜索功能
exports.search = function (req, res) {
  var catId = req.query.cat;
  var q = req.query.q;
  var page = parseInt(req.query.p, 10) || 0;
  var count = 2;
  var index = page * count;

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'movies',
        select: 'title poster'
        // ,options: {limit: 2, skip: index} //mongo自带的分页方法有问题
      })
      .exec(function (err, categories) {
        if (err) {
          console.log(err);
          res.json({status: 'error', msg: '请求失败！', err: err});
        }

        var category = categories[0] || {};
        var movies = category.movies || [];
        var results = movies.slice(index, index + count);

        res.json('results', {
          status: 'success',
          msg: '请求成功！',
          data: {
            title: 'movie 结果列表页',
            keyword: category.name,
            currentPage: page + 1,
            query: 'cat=' + catId,
            totalPage: Math.ceil(movies.length / count),
            movies: results
          }
        });
      });
  }
  else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')}) //通过加正则,实现模糊匹配
      .exec(function (err, movies) {
        if (err) {
          console.log(err);
          res.json({status: 'error', msg: '请求失败！', err: err});
        }

        var results = movies.slice(index, index + count);

        res.json('results', {
          status: 'success',
          msg: '请求成功！',
          data: {
            title: 'movie 结果列表页',
            keyword: q,
            currentPage: page + 1,
            query: 'q=' + q,
            totalPage: Math.ceil(movies.length / count),
            movies: results
          }
        });
      });
  }
};
