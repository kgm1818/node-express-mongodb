/**
 * Created by Administrator on 2017/11/6 0006.
 */

const mongoose=require('mongoose');
//�������ݿ��
let GoodsTable=new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        //���ù��������̼ҵı�����һ��
        ref: 'Seller'
    },
    goodsname:String,
    goodspic:Array,
    description:String,
    styles:Array,
    sizes:Array,
    price:Number
})
//����ģ��
let Goods=mongoose.model('Goods',GoodsTable);
module.exports=Goods;
