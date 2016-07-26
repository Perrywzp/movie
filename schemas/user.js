var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTORY = 10;
var UserSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String
    },
    password:{
        unique:true,
        type:String
    },
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});


UserSchema.pre('save',function(next){
    var user = this;
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now();
    }else{
        this.meta.updateAt = Date.now();
    }
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTORY);
    var hash = bcrypt.hashSync(user.password,salt);
    user.password = hash;
    next();
});

UserSchema.statics = {
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAr')
            .exec(cb);
    },
    findById:function(id,cb){
        return this
            .findOne({id:id})
            .exec(cb);
    },
    findByName:function(name,cb){
        return this
            .findOne({name:name})
            .exec(cb);
    }
};

module.exports = UserSchema;