/**
 * Created by perry on 16/7/29.
 */
var User = require('../models/user');
var app = require('express')();
// middleware for user
exports.signinRequired = function (req, res, next) {
  var user = req.session.user;

  if (!user) {
    //return res.redirect('/signin');
    return res.json({status: 'error', msg: '请先登录！'});
  }

  next();
};

exports.adminRequired = function (req, res, next) {
  var user = req.session.user;

  if (user.role <= 10) {
    //return res.redirect('/signin');
    return res.json({status: 'error', msg: '请先登录！'});
  }

  next();
};

// showSingin
exports.showSignin = function (req, res) {
  res.json({
    title: '登录页面'
  });
};

// showSignup
exports.showSignup = function (req, res) {
  res.json({
    title: '注册页面'
  });
};

//singup
exports.singup = function (req, res) {
  var _user = req.body.user;
  console.log(_user.name);
  User.find({name: _user.name}, function (err, user) {
    if (err) console.log(err);
    console.log(user);
    if (user.length) {
      //return res.redirect("/signin");
      return res.json({status: 'error', msg: '用户名已被占用！'});
    }
    else {
      var user = new User(_user);
      user.save(function (err, user) {
        if (err){
          console.log(err);
          return res.json({status: 'error', msg: '注册失败！'});
        }

        //return res.redirect("/signin");
        return res.json({status: 'success', msg: '注册成功，前往登录！'});
      })
    }
  });
};

// logout
exports.logout = function (req, res) {
  delete req.session.user;
  return res.json({status: 'success', msg: '成功退出！'});
  //res.redirect('/');
};

//登录
exports.singin = function (req, res) {
  var _user = req.body.user,
    name = _user.name,
    password = _user.password;
  User.findOne({name: name}, function (err, user) {
    if (err) {
      console.log(err);
      return res.json({status: 'error', msg: '请求失败！', err: err});
    }

    if (!user) {
      //return res.redirect('/');
      return res.json({status: 'error', msg: '请先登录！'});
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err);
        return res.json({status: 'error', msg: '请先登录！'});
      }

      if (isMatch) {
        console.log("Password is matched!");
        req.session.user = user;
        //return res.redirect('/');
        res.json({status: 'success', msg: '登录成功！'});
      }
      else {
        console.log("Password is not matched!");
        return res.json({status: 'error', msg: '登录失败！'});
        //return res.redirect('/signin');
      }
    })
  });
};

// user list page
exports.list = function (req, res) {

  User.fetch(function (err, users) {
    if (err) {
      console.log(err);
      res.json({status: 'error', msg: '请求失败！', err: err});
    }

    res.json({
      status: 'success',
      msg: '请求成功！',
      data: {
        title: 'movie 用户列表页',
        users: users
      }
    });

  });
};

// delete user
exports.del = function (req, res) {
  var id = req.query.id;
  if (id) {
    User.remove({_id: id}, function (err, user) {
      if (err) {
        console.log(err);

        res.json({status: 'error', msg: '删除失败！', err: err});
      } else {
        //res.json({success: 1});
        res.json({status: 'success', msg: '删除成功！'});
      }
    });
  }
};
