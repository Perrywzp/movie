/**
 * [desc]
 * @author wangzhipei
 * @date 2016/8/1/0001.
 */
var Index = require('../app/api/controllers/index');
var User = require('../app/api/controllers/user');
var Movie = require('../app/api/controllers/movie');
var Comment = require('../app/api/controllers/comment');
var Category = require('../app/api/controllers/category');

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
  app.get('/api/', Index.index);

  // Movie
  app.get('/api/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
  app.delete('/api/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);
  app.get('/api/movie/:id', Movie.detail);
  app.get('/api/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
  app.get('/api/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  app.post('/api/admin/movie', User.signinRequired, User.adminRequired, Movie.savePoster,Movie.save);

  // User
  app.post('/api/user/signup', User.singup);
  app.post('/api/user/signin', User.singin);
  app.get('/api/signin', User.showSignin);
  app.get('/api/signup', User.showSignup);
  app.get('/api/logout', User.logout);
  app.get("/api/admin/user/list", User.signinRequired, User.adminRequired, User.list);
  app.delete("/api/admin/user/list", User.signinRequired, User.adminRequired, User.del);


  //Comment
  app.post('/api/user/comment', User.signinRequired, Comment.save);

  //Category
  app.get('/api/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  app.post('/api/admin/category', User.signinRequired, User.adminRequired, Category.save);
  app.get('/api/admin/category/list', User.signinRequired, User.adminRequired, Category.list);


  //results
  app.get('/results',Index.search);
};