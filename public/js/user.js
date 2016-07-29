/**
 * [desc]
 * @author wangzhipei
 * @date 2016/7/29/0029.
 */
$(function(){
  $('.del-user').click(function(e){
    var target = $(e.target);
    var id = target.data('id');
    var tr = $('.item-id-' + id);

    $.ajax({
        type:'DELETE',
        url:'/admin/userlist?id=' + id,
        cache:'false'
      })
      .done(function(results){
        if(results.success === 1){
          if(tr.length > 0){
            tr.remove();
          }
        }
      });
  });
});
