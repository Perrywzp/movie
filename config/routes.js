/**
 * Created by perry on 16/7/29.
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');

module.exports = function (app) {
// pre handle user
  app.use(function (req, res, next) {
    var _user = req.session.user;

    if (_user) {
      app.locals.user = _user;
    }

    return next();
  });

  // Index
  app.get('/', Index.index);

  // Movie
  app.get('/admin/list', Movie.list);
  app.delete('/admin/list', Movie.del);
  app.get('/movie/:id', Movie.detail);
  app.get('/admin/movie', Movie.new);
  app.get('/admin/update/:id', Movie.update);
  app.post('/admin/movie/new', Movie.save);

  // User
  app.post('/user/signup', User.singup);
  app.post('/user/signin', User.singin);
  app.get('/logout', User.logout);
  app.get("/admin/userlist", User.list);
  app.delete("/admin/userlist", User.del);

};
