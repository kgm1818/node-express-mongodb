/**
 * Created by Administrator on 2017/11/9 0009.
 */

const mongoose=require('mongoose');

let OrderTable=new mongoose.Schema({
    sellerId:{
        type: mongoose.Schema.Types.ObjectId,
        //���ù�������Ʒ�ı�����һ��
        ref: 'Seller'
    },
    goodsId:{
        type: mongoose.Schema.Types.ObjectId,
        //���ù�������Ʒ�ı�����һ��
        ref: 'Goods'
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        //���ù��������û��ı�����һ��
        ref: 'user'
    },
    size:String,
    style:String,
    num:Number
})

//����ģ��
let Order=mongoose.model('Order',OrderTable);
module.exports=Order;