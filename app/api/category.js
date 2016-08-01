/**
 * Created by perry on 16/7/31.
 * 后台分类管理
 */
var Category = require('../models/category');

// category 新建

exports.new = function (req, res) {
  res.json('category_admin', {
    status: 'success',
    msg: '请求成功！',
    data: {
      title: 'movie 后台分类录入页',
      category: {}
    }
  });
};


// category save
exports.save = function (req, res) {
  var _category = req.body.category;

  var category = new Category(_category);

  category.save(function (err, movie) {
    if (err) {
      console.log(err);
      res.json({status: 'error', msg: '保存失败！', err: err});
    }

    res.json({status: 'success', msg: '保存成功！'});
  });
};

// category list page
exports.list = function (req, res) {

  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err);
      res.json({status: 'error', msg: '请求失败！', err: err});
    }

    res.json('category_list', {
      status: 'success',
      msg: '请求成功！',
      data: {
        title: 'movie 分类列表页',
        categories: categories
      }
    })

  });
};


