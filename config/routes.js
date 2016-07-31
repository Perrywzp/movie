/**
 * Created by perry on 16/7/29.
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');
var Comment = require('../app/controllers/comment');
var Category = require('../app/controllers/category');

module.exports = function (app) {
// pre handle user
  app.use(function (req, res, next) {
    var _user = req.session.user;

    if (_user) {
      app.locals.user = _user;
    } else {
      delete app.locals.user;
    }

    return next();
  });

  // Index
  app.get('/', Index.index);

  // Movie
  app.get('/admin/list', User.signinRequired, User.adminRequired, Movie.list);
  app.delete('/admin/list', User.signinRequired, User.adminRequired, Movie.del);
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.new);
  app.get('/admin/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.post('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.save);

  // User
  app.post('/user/signup', User.singup);
  app.post('/user/signin', User.singin);
  app.get('/signin', User.showSignin);
  app.get('/signup', User.showSignup);
  app.get('/logout', User.logout);
  app.get("/admin/userlist", User.signinRequired, User.adminRequired, User.list);
  app.delete("/admin/userlist", User.signinRequired, User.adminRequired, User.del);


  //Comment
  app.post('/user/comment', User.signinRequired, Comment.save);

  //Category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

};
