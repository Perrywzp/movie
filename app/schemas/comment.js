/**
 * Created by perry on 16/7/30.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

// mongoose封装了一个Populate方法来实现了关联查询
// populate方法
// 参数:
// path 用空格分隔引用字段的名称
// select 填充引用这个document的字段
// match 指定附加的查询条件
// modal 指定可用的modal
// options 指定排序和条数的限制等
//

// mongodb 会默认生成一个主键 主键名就是_id,其值是唯一的
var CommentSchema = new mongoose.Schema({
  movie:{type: ObjectId, ref: 'Movie'},
  from:{type: ObjectId, ref: 'User'},
  to:{type: ObjectId, ref: 'User'},
  content: 'string',
  meta:{
    createAt:{
      type:Date,
      default: Date.now()
    },
    updateAt:{
      type:Date,
      default: Date.now()
    }
  }
});

CommentSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Date.now();
  }
  next();
});

CommentSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  findById:function(id,cb){
    return this
      .findOne({_id:id})
      .exec(cb);
  }
};

module.exports = CommentSchema;
