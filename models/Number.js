/**
 * Created by Administrator on 2017/11/10 0010.
 */

const mongoose=require('mongoose');

const numberTable=new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    },
    sum:Number
});
let Num=mongoose.model('Number',numberTable);
module.exports=Num;

