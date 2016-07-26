/**
 * Created by perry on 15/9/26.
 */

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt-nodejs');
var multipart = require('connect-multiparty');
var session = require('express-session');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user');
var port = process.env.PORT || 3000;
var app = express();
mongoose.connect('mongodb://localhost/movie');
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multipart());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port);

console.log('movie started on port ' + port);

// index page

app.get('/', function (req, res) {
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

app.get('/admin/del', function (req, res) {
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
    var _user,
        name = req.body.user.name,
        password = req.body.user.password;

    if (name) {
        User.findByName(name, function (err,user) {
            if (err) {
                console.log(err);
            }
            console.log("该用户名已存在!");
        });
        res.redirect('/');
    }

    if (!password) {
        console.log("密码不能为空！");
        res.redirect("/");

    }

    _user = new User({
        name: name,
        password: password
    });
    _user.save(function (err,user) {
        if (err) console.log(err);
        res.redirect("/");

    });

    console.log(_user);
});


//登录
app.post('/user/signin', function (req, res) {
    var _user = req.body.user,
        name = _user.name,
        password = _user.password;

    if (name) {
        User.findByName(name, function (err, user) {
            if (err) {
                console.log(err);
            }

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(user.password, salt);
            if(!bcrypt.compareSync(password, hash)){
                console.log("密码输入有误！");
            }
            res.redirect('/');
        })
    } else {
        console.log("请输入用户名!");
        res.redirect('/');
    }
});

// detail page

app.get('/movie/:id', function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
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


