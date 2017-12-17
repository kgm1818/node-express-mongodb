/**
 * Created by Administrator on 2017/11/6 0006.
 */

const express=require('express');
const User=require('../../models/User');
const Order=require('../../models/Order');
const Number=require('../../models/Number');
const Goods=require('../../models/Goods');
//创建路由
const router=express.Router();
//register
router.post('/register',(req,res,next)=>{
    let responseData={
        msg:'',
        status:''
    }
    let query=req.body;
    // console.log(query);
    if(query.username==''||query.password==''||query.repassword==''){
        responseData.msg='用户名，密码不能为空';
        responseData.status=0;
        res.json(responseData);
    }else if(query.password!=query.repassword){
        responseData.msg='密码与确认密码不一致';
        responseData.status=2;
        res.json(responseData);
    }else{//查找数据库有没有该用户
        User.findOne({
            username:query.username
        }).then(result=>{
            if(result){//有该用户
                responseData.msg='该用户已存在';
                responseData.status=3;
                res.json(responseData);
            }else{//保存数据
                let data=new User({
                    username:query.username,
                    password:query.password
                })
                data.save().then(userInfo=>{//保存数据成功
                    if(userInfo){
                        responseData.msg='注册成功';
                        responseData.status=1;
                        res.redirect('/login');//跳到登录页面
                        res.json(responseData);
                    }else{
                        responseData.msg='注册失败';
                        responseData.status=4;
                        res.json(responseData);
                    }
                })
            }
        })
    }
})

//login
router.post('/login',(req,res,next)=>{
    let query=req.body;
   // console.log(query);
    let responseData={
        msg:'',
        status:''
    }
    if(query.username==''||query.password==''){
        responseData.msg = '用户名，密码不能为空';
        responseData.status = 0;
        res.json(responseData);
    }else{//查找数据库有没有该用户
        User.findOne({
            username:query.username
        }).then(result=>{
            if(result){//有
              if(query.password==result.password){
                  responseData.msg = '登录成功';
                  responseData.status = 1;
                  req.cookies.set('USERID',result._id);
                  res.redirect('/');
                  res.json(responseData);
                  return false;
              }
                return false;
            }else{//不存在
                responseData.msg = '该用户不存在';
                responseData.status = 2;
                res.json(responseData);
            }
        })
    }
})

//购买商品
router.post('/detail',(req,res,next)=>{
    //用户ID
    let userid=req.userInfo._id;
    //判断买家有没有登录
    if(userid) {
        let query = req.body;
        //console.log(query);
        //查看每个商家总订货数量表；
        Number.find({
            sellerId: query.sellerId
        }).then(numberInfo=> {
            //console.log(numberInfo);
            if (numberInfo.length <= 0) {
                let sumData = new Number({
                    sellerId: query.sellerId,
                    sum: query.num
                })
                sumData.save().then(dataInfo=> {
                    //console.log(dataInfo);
                });
            } else {
                let sum = numberInfo[0].sum + query.num * 1
                //console.log(numberInfo[0].sum+query.num*1);
                Number.findByIdAndUpdate(numberInfo[0]._id, {
                    sum: sum
                }).then(sumInfo=> {
                    //console.log(sumInfo);更新前的数据
                })
            }
        })
        let data = new Order({
            sellerId: query.sellerId,
            goodsId: query.goodsId,
            userId: userid,
            size: query.size,
            style: query.style,
            num: query.num
        })
        data.save().then(result=> {
            if (result) {//保存成功
                res.json({
                    msg: '购买成功',
                    status: 1
                })
            } else {//保存失败
                res.json({
                    msg: '购买失败',
                    status: 0
                })
            }
        })
    }else{
        res.json({
            msg: '请先登录',
            status: 2
        })
    }
})

module .exports=router;