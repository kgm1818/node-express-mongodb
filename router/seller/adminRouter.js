/**
 * Created by Administrator on 2017/11/6 0006.
 */
const express=require('express');
const url=require('url');
const Goods=require('../../models/Goods');
const Order=require('../../models/Order');
const User=require('../../models/User');
//设置路由
const router=express.Router();

//login
router.get('/login',(req,res,next)=>{
    res.render('seller/login');
})
//register
router.get('/register',(req,res,next)=>{
    res.render('seller/register');
})
router.use((req, res, next)=>{
    // 判断是否有商家id，如果没有让浏览器重定向到登录页面
    let sellerid = req.cookies.get('SELLERID');
    //console.log(sellerid);
    if(sellerid){
        next();
    }else{
        res.redirect('/admin/login');
    }
})

//首页
router.get('/',(req,res,next)=>{
    res.render('seller/home',{
        homeActive:'active',
        username:req.userInfo.username
    });
})
//goodslist
router.get('/goodslist',(req,res,next)=>{
    let query=url.parse(req.url,true).query;
    //查找该商家的所有商品
   Goods.where({
       sellerId:req.sellerInfo._id
   }).count().then(sum=>{
      // console.log(sum);
       let page=Number(query.page) || 1;
       let count=Number(query.count) || 5;
       //跳过多少数据
       let skip=(page-1)*count;
       //共有多少页
       let num=Math.ceil(sum/count);
       let pageUrl=[];
       for(let i=1;i<=num;i++){
           let obj={
               url:'/admin/goodslist?page='+i+'&count='+count,
               class:page==i?'active':''
           };
            pageUrl.push(obj);
       }
       //s console.log(page);
       Goods.find({
           sellerId:req.sellerInfo._id
       }).skip(skip).limit(count).then(result=>{
           //console.log(result);
           res.render('seller/goodslist',{
               gooslistActive:'active',
               result:result,
               pre:page>1?'/admin/goodslist?page='+(page-1)+'&count='+count:'',
               next:page<num?'/admin/goodslist?page='+(page+1)+'&count='+count:'',
               pageUrl:pageUrl,
               page:page,
               isShow:sum>0
           });
       })
   })
})
//orderlist
router.get('/orderlist',(req,res,next)=>{
    //console.log(req.sellerInfo);
    //查找该商家的所有订单
    Order.find({
        sellerId:req.sellerInfo._id
    }).populate(['userId']).populate(['goodsId']).then(result=>{
        //console.log(result);
        let arrOeder=[];
        for(let i=0;i<result.length;i++){
            let obj={
                 username:result[i].userId.username,//买家昵称
                goodsname:result[i].goodsId.goodsname,//商品名称
                 price:result[i].goodsId.price,//商品价格
                 num:result[i].num,//商品数量
                 size:result[i].size,//商品尺寸
                 style:result[i].style,//商品款式
                 totalPrice:result[i].num*result[i].goodsId.price//该订单总价
             }
            arrOeder.push(obj);
        }
       // console.log(arrOeder);
        res.render('seller/orderlist',{
             orderlistActive:'active',
             sellername:req.sellerInfo.sellername,
             arrOeder:arrOeder
         });
    })
})
//addgoods
router.get('/addgoods',(req,res,next)=>{
    res.render('seller/addgoods',{
        addgoodsActive:'active',
        username:req.userInfo.username
    });
})


//修改商品
router.get('/updatagoods',(req,res,next)=>{
    let query=url.parse(req.url,true).query;
   // console.log(query.goodsid);
    //从数据库查找数据
    Goods.findById(query.goodsid).then(result=>{
       // console.log(result);
        res.render('seller/updatagoods',{
            addgoodsActive:'active',
            result:result
        });
    })

})


//退出登录
router.get('/loginout',(req,res,next)=>{
    req.cookies.set('SELLERID',null);
    //重定向
    res.redirect('admin/login');
})
module.exports=router;