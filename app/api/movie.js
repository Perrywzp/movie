/**
 * Created by perry on 16/7/29.
 *
 */

var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

// admin page

exports.new = function (req, res) {
  Category.find({}, function (err, categories) {
    res.json({
      status: 'success',
      msg: '请求成功！',
      data: {
        title: 'movie 后台录入页',
        categories: categories,
        movie: {}
      }
    });
  });
};

//admin update
exports.update = function (req, res) {
  var id = req.params.id;
  if (id) {
    Category.find({}, function (err, categories) {
      Movie.findById(id, function (err, movie) {
        res.json({
          status: 'success',
          msg: '更新成功！',
          data: {
            title: 'movie 后台管理更新页',
            categories: categories,
            movie: movie
          }
        });
      });
    });
  }

};

// list page
exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
      res.json({status: 'error', msg: '请求失败！', err: err});
    }
    res.json({
      status: 'success',
      msg: '请求成功！',
      data: {
        title: 'list 列表页',
        movies: movies
      }
    });
  });
};

// detail page
exports.detail = function (req, res) {
  var id = req.params.id;

  Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
    if (err) {
      console.log(err);
      res.json({status: 'error', msg: '请求失败！', err: err});
    }
  });
  Movie.findById(id, function (err, movie) {
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec(function (err, comments) {
        res.json({
          status: 'success',
          msg: '请求成功！',
          data: {
            title: 'movie 详情页',
            movie: movie,
            comments: comments
          }
        });
      });
  });
};
// list delete page
exports.del = function (req, res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({_id: id}, function (err, movie) {
      if (err) {
        console.log(err);
        res.json({status: 'error', msg: '删除失败！', err: err});
      } else {
        res.json({status: 'success', msg: '删除成功！'});
      }
    });
  }
};


// admin post  movie
exports.save = function (req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  // 判断是否是上传
  if (req.poster) {
    movieObj.poster = req.poster;
  }

  if (id) {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err);
        res.json({status: 'error', msg: '保存失败！', err: err});
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err);
          res.json({status: 'error', msg: '保存失败！', err: err});
        }

        res.json({status: 'success', msg: '保存成功！'});
      });
    });
  } else {
    _movie = new Movie(movieObj);
    var categoryId = movieObj.category;
    var categoryName = movieObj.categoryName;
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
        res.json({status: 'error', msg: '保存失败！', err: err});
      }
      if (categoryId) {
        Category.findById(categoryId, function (err, category) {
          category.movies.push(movie._id);

          category.save(function (err, category) {
            res.json({status: 'success', msg: '保存成功！'});
          });
        });
      }
      else if (categoryName) {
        var category = new Category({
          name: categoryName,
          movies: [movie._id]
        });

        category.save(function (err, category) {
          movie.category = category._id;
          movie.save(function (err, movie) {
            res.json({status: 'success', msg: '保存成功！'});
          });
        })

      }
      else {
        console.log("未选择分类或自定义分类");
        res.json({status: 'error', msg: '请求失败！', err: '未选择分类或自定义分类'});
      }
    });
  }
};

// admin poster
exports.savePoster = function (req, res, next) {
  var posterData = req.files.uploadPoster;
  var filepath = posterData && posterData.path;
  var originalFilename = posterData && posterData.originalFilename;
  console.log(req.files);

  if (originalFilename) {
    fs.readFile(filepath, function (err, data) {
      var timestamp = Date.now();
      var type = posterData.type.split('/')[1];
      var poster = timestamp + '.' + type;
      var newPath = path.join(__dirname, '../../', '/public/upload/images/' + poster);

      fs.writeFile(newPath, data, function (err) {
        req.poster = poster;
        next();
      });
    })
  }
  else {
    next();
  }
};
