/**
 * Created by Administrator on 2017/11/6 0006.
 */

const mongoose=require('mongoose');

//创建数据库表
let userTable=new mongoose.Schema({
    username:String,
    password:String
})
//建立模型
let User=mongoose.model('user',userTable);
module.exports=User;