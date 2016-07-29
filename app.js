/**
 * Created by perry on 15/9/26.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user');
var port = process.env.PORT || 3030;
var app = express();

var dbUrl = 'mongodb://localhost/movie';
mongoose.connect(dbUrl);

app.set('views', './views/pages');
app.set('view engine', 'jade');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser());
app.use(cookieParser());
app.use(multipart());
app.use(session({
    secret:'movie'
    ,store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.listen(port);

console.log('movie started on port ' + port);

// index page

app.get('/', function (req, res) {
    console.log("user in session:");
    console.log(req.session.user);
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: 'index 首页',
            movies: movies
        });
    });
});

// list page

app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'list 列表页',
            movies: movies
        });
    });
});

// list delete page

app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({success: 1});
            }
        });
    }
});

//singup
app.post('/user/signup', function (req, res) {
    var _user = req.body.user;
    console.log(_user.name);
    User.find({name:_user.name},function(err,user){
        if(err) console.log(err);
        console.log(user);
        if(user.length){
            return res.redirect("/");
        }
        else{
            var user = new User(_user);
            user.save(function(err,user){
                if(err) console.log(err);

                res.redirect("/admin/userlist");

            })
        }
    });




});

// user list page
app.get("/admin/userlist",function(req,res){
    User.fetch(function(err, users){
        if(err){
            console.log(err);
        }

        res.render('userlist',{
            title: 'movie 用户列表页',
            users: users
        })

    });

});

// delete user
app.delete("/admin/userlist",function(req, res){
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
});

//登录
app.post('/user/signin', function (req, res) {
    var _user = req.body.user,
        name = _user.name,
        password = _user.password;
        console.log(name);
    User.findOne({name:name}, function(err, user){
        if(err) console.log(err);

        if(!user){
            return res.redirect('/');
        }

        user.comparePassword(password, function(err, isMatch){
            if(err) console.log(err);

            if(isMatch) {
                console.log("Password is matched!");
                console.log(user);
                req.session.user = user;
                return res.redirect('/');
            }
            else{
                console.log("Password is not matched!");
            }
        })
    });
});

// detail page

app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        console.log(movie);
        res.render('detail', {
            title: 'movie ' + movie.title,
            movie: movie
        });
    });
});
// admin page

app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: 'admin 后台管理页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

//admin update
app.get('/admin/update/:id', function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: 'movie 后台管理更新页',
                movie: movie
            });
        });
    }
});

// admin post  movie
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _.extend(movie, movieObj);
            console.log(_movie);
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        });
    }
});


