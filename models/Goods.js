/**
 * Created by Administrator on 2017/11/6 0006.
 */

const mongoose=require('mongoose');
//创建数据库表
let GoodsTable=new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        //设置关联，于商家的表名字一致
        ref: 'Seller'
    },
    goodsname:String,
    goodspic:Array,
    description:String,
    styles:Array,
    sizes:Array,
    price:Number
})
//建立模型
let Goods=mongoose.model('Goods',GoodsTable);
module.exports=Goods;
