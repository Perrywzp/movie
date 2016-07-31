/**
 * Created by perry on 16/7/31.
 */
$(function () {
  $(".comment").click(function (e) {
    var target = $(this),
      toId = target.data("tid"),
      commentId = target.data("cid"),
      $toId = $('#toId'),
      $commentId = $("#commentId");
    if ($toId.length > 0) {
      $toId.val(toId)
    }
    else {
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId
      }).appendTo("#commentForm");
    }

    if ($commentId.length > 0) {
      $commentId.val(commentId);
    }
    else {
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[cid]',
        value: commentId
      }).appendTo('#commentForm');
    }
  });
});
