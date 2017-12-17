/**
 * Created by Administrator on 2017/11/6 0006.
 */

const mongoose=require('mongoose');
//创建数据库表
let SellerTable=new mongoose.Schema({
    sellername:String,
    sellerlogo:String,
    description:String,
    password:String
})
//建立模型
let Seller=mongoose.model('Seller',SellerTable);
module.exports=Seller;
