/**
 * Created by Administrator on 2017/11/9 0009.
 */

const mongoose=require('mongoose');

let OrderTable=new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        //设置关联，商品的表名字一致
        ref: 'Seller'
    },
    goodsId:{
        type: mongoose.Schema.Types.ObjectId,
        //设置关联，商品的表名字一致
        ref: 'Goods'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        //设置关联，与用户的表名字一致
        ref: 'user'
    },
    size:String,
    style:String,
    num:Number
})

//建立模型
let Order=mongoose.model('Order',OrderTable);
module.exports=Order;