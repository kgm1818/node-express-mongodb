/**
 * Created by Administrator on 2017/11/6 0006.
 */

const mongoose=require('mongoose');
//�������ݿ��
let SellerTable=new mongoose.Schema({
    sellername:String,
    sellerlogo:String,
    description:String,
    password:String
})
//����ģ��
let Seller=mongoose.model('Seller',SellerTable);
module.exports=Seller;
