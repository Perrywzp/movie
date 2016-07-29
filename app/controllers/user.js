/**
 * Created by perry on 16/7/29.
 */
var User = require('../models/user');

//singup
exports.singup = function (req, res) {
  var _user = req.body.user;
  console.log(_user.name);
  User.find({name: _user.name}, function (err, user) {
    if (err) console.log(err);
    console.log(user);
    if (user.length) {
      return res.redirect("/");
    }
    else {
      var user = new User(_user);
      user.save(function (err, user) {
        if (err) console.log(err);

        res.redirect("/admin/userlist");

      })
    }
  });
};

// logout
exports.logout = function (req, res) {
  delete req.session.user;
  delete app.locals.user;

  res.redirect('/');
};

// user list page
exports.list = function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err);
    }

    res.render('userlist', {
      title: 'movie 用户列表页',
      users: users
    })

  });

};

// delete user
exports.del = function (req, res) {
  var id = req.query.id;
  if (id) {
    User.remove({_id: id}, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.json({success: 1});
      }
    });
  }
};

//登录
exports.singin = function (req, res) {
  var _user = req.body.user,
    name = _user.name,
    password = _user.password;
  console.log(name);
  User.findOne({name: name}, function (err, user) {
    if (err) console.log(err);

    if (!user) {
      return res.redirect('/');
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) console.log(err);

      if (isMatch) {
        console.log("Password is matched!");
        console.log(user);
        req.session.user = user;
        return res.redirect('/');
      }
      else {
        console.log("Password is not matched!");
      }
    })
  });
};
