/**
 * Created by perry on 16/7/30.
 */

var Comment = require('../models/comment');

// comment save
exports.save = function (req, res) {
  var _comment = req.body.comment;
  var movieId = _comment.movie;
  var comment = new Comment(_comment);
  comment.save(function (err, comment) {
    if (err) {
      console.log(err);
    }

    res.redirect('/movie/' + movieId);
  });
};

