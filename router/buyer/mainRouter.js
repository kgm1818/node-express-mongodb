/**
* Created by Administrator on 2017/11/6 0006.
*/
const express=require('express');
const Goods=require('../../models/Goods');
const Seller=require('../../models/Seller');
const Order=require('../../models/Order');
const Number=require('../../models/Number');
const url=require('url');
const async=require('async');
//设置路由
const router=express.Router();

//首页
router.get('/',(req,res,next)=>{
    res.render('buyer/home',{
        homeActive:'active',
        username:req.userInfo.username
    });
})
//goodslist
router.get('/goodslist',(req,res,next)=>{
    //分页处理
    let query=url.parse(req.url,true).query;
    //排序
    let sort=url.parse(req.url,true).query.sort*1||0;
    //console.log(sort);
    //查找该商家的所有商品
    if(sort){//排序
        Goods.find().count().then(sum=> {
             //console.log(sum);
            let page = query.page*1 || 1;
            let count = query.count*1 || 5;
            //跳过多少数据
            let skip = (page - 1) * count;
            //共有多少页
            let num = Math.ceil(sum / count);
          //  console.log(num);
            let pageUrl = [];
            for (let i = 1; i <= num; i++) {
                let obj = {
                    url: '/goodslist?page=' + i + '&count=' + count+'&sort='+sort ,
                    class: page == i ? 'active' : ''
                };
                pageUrl.push(obj);
            }
             //console.log(pageUrl);
            Goods.find().sort({price:sort}).populate(['sellerId']).skip(skip).limit(count).then(result=> {
                //console.log('111');
                //console.log(result);
                res.render('buyer/goodslist', {
                    goodslistActive: 'active',
                    username:req.userInfo.username,
                    result: result,
                    pre: page > 1 ? '/goodslist?page=' + (page - 1) + '&count=' + count+'&sort='+sort:'',
                    next: page < num ? '/goodslist?page=' + (page + 1) + '&count=' + count+'&sort='+sort:'',
                    pageUrl: pageUrl,
                    page: page,
                    isShow: sum > 0,
                    sortpage: '/goodslist?page=' + page + '&count=' + count
                });
            })
        })
    }else {
        //console.log('222');
        Goods.find().count().then(sum=> {
            // console.log(sum);
            let page = query.page*1 || 1;
            let count = query.count*1 || 5;
            //跳过多少数据
            let skip = (page - 1) * count;
            //共有多少页
            let num = Math.ceil(sum / count);
            let pageUrl = [];
            for (let i = 1; i <= num; i++) {
                let obj = {
                    url: '/goodslist?page=' + i + '&count=' + count,
                    class: page == i ? 'active' : ''
                };
                pageUrl.push(obj);
            }
            //console.log(page);
            Goods.find().populate(['sellerId']).skip(skip).limit(count).then(result=>{
                //console.log(result);
                res.render('buyer/goodslist', {
                    goodslistActive: 'active',
                    username: req.userInfo.username,
                    result: result,
                    pre: page > 1 ? '/goodslist?page=' + (page - 1) + '&count=' + count : '',
                    next: page < num ? '/goodslist?page=' + (page + 1) + '&count=' + count : '',
                    pageUrl: pageUrl,
                    page: page,
                    isShow: sum > 0,
                    sortpage: '/goodslist?page=' + page + '&count=' + count
                })
            })
        })
    }
})

//商品详情页
router.get('/detail',(req,res,next)=>{
    //res.send('详情页');
    let query=url.parse(req.url,true).query;
    Goods.findById(query.id).populate(['sellerId']).then(result=>{
        //console.log(result);
        res.render('buyer/detail',{
            detailActive: 'active',
            username: req.userInfo.username,
            result:result
        })
    })
})

//store所有店铺
router.get('/store',(req,res,next)=>{
//console.time('async');//*定义时间的开始
    async.parallel({
        count:function (callback){
            //总订单表
            Number.find().then(numInfo=>{
                callback(null,numInfo);
            })
        },
        list:function (callback){
            Seller.find().then(result=>{
                callback(null,result);
            })
        }
    },function (err,data){
        //最终数据
        let storeArr=[];
        //console.log(data.list);
        //console.log(data.count);
        for(let i=0;i<data.list.length;i++){
            let obj={
                _id:data.list[i]._id,
                sellername: data.list[i].sellername,
                description: data.list[i].description || '无',
                sellerlogo: data.list[i].sellerlogo,
                numAll:0
            }
            //console.log(obj);
            for(let j=0;j<data.count.length;j++){
                if(data.list[i]._id.toString()==data.count[j].sellerId){
                    obj.numAll=data.count[j].sum;
                    //console.log(obj.numAll);
                }
            }
            storeArr.push(obj);
        }
        //console.log(storeArr);
        res.render('buyer/store',{
            storeActive:'active',
            username:req.userInfo.username,
            storeArr:storeArr
        });
    })
})


//该店铺的所有商品
router.get('/storelist',(req,res,next)=>{
    let sellerid=url.parse(req.url,true).query.sellerid;
    //console.log(sellerid);
    Goods.find({
            sellerId:sellerid
    }).populate('sellerId').then(result=>{
        //console.log(result);
        //console.log(result[0].sellerId.sellername);
            res.render('buyer/storelist',{
                result:result,
                isShow:result.length>0
            })
    })
})
//个人中心
router.get('/personal',(req,res,next)=>{
    Order.find({
        userId:req.userInfo._id
    }).populate(['goodsId', 'sellerId']).then(result=>{
      //  console.log(result);
        let arrOeder=[];
        for(let i=0;i<result.length;i++){
            let obj={
                sellername:result[i].sellerId.sellername,//卖家昵称
                goodsname:result[i].goodsId.goodsname,//商品名称
                price:result[i].goodsId.price,//商品价格
                num:result[i].num,//商品数量
                size:result[i].size,//商品尺寸
                style:result[i].style,//商品款式
                totalPrice:result[i].num*result[i].goodsId.price//该订单总价
            }
            arrOeder.push(obj);
        }
        res.render('buyer/personal',{
            username: req.userInfo.username,
            arrOeder:arrOeder
        });
    })
})

//搜索商品
router.get('/search',(req,res,next)=>{
    //let keyword=url.parse(req.url,true).query.keyword;
    //let reg=new RegExp(keyword);
    //Goods.find({
    //    goodsname:reg
    //}).then(result=>{
    //    console.log(result.length);
    //    res.render('buyer/goodslist',{
    //        result
    //    })
    //})
    //分页处理
    let query=url.parse(req.url,true).query;
    let keyword=query.keyword;
    //console.log(keyword);
    let reg=new RegExp(keyword);
    //排序
    let sort=url.parse(req.url,true).query.sort*1||0;
    //console.log(sort);
    //查找该商家的所有商品
    if(sort){//排序
        Goods.find({ goodsname:reg}).count().then(sum=> {
            //console.log(sum);
            if(sum>0) {
                let page = query.page * 1 || 1;
                let count = query.count * 1 || 5;
                //跳过多少数据
                let skip = (page - 1) * count;
                //共有多少页
                let num = Math.ceil(sum / count);
                //console.log(num);
                let pageUrl = [];
                for (let i = 1; i <= num; i++) {
                    let obj = {
                        url: '/search?page=' + i + '&count=' + count + '&sort=' + sort + '&keyword=' + keyword,
                        class: page == i ? 'active' : ''
                    };
                    pageUrl.push(obj);
                }
                //console.log(pageUrl);
                Goods.find({goodsname: reg}).sort({price: sort}).populate(['sellerId']).skip(skip).limit(count).then(result=> {
                    //console.log('111');
                    //console.log(result);
                    res.render('buyer/goodslist', {
                        gooslistActive: 'active',
                        username: req.userInfo.username,
                        result: result,
                        pre: page > 1 ? '/search?page=' + (page - 1) + '&count=' + count + '&sort=' + sort + '&keyword=' + keyword : '',
                        next: page < num ? '/search?page=' + (page + 1) + '&count=' + count + '&sort=' + sort + '&keyword=' + keyword : '',
                        pageUrl: pageUrl,
                        page: page,
                        isShow: sum > 0,
                        num: num,
                        sortpage: '/search?page=' + page + '&count=' + count + '&keyword=' + keyword
                    });
                })
            }else{
                res.render('buyer/notsearch');
            }
        })
    }else {
        Goods.find({ goodsname:reg}).count().then(sum=> {
            // console.log(sum);
            if(sum>0) {
                let page = query.page * 1 || 1;
                let count = query.count * 1 || 5;
                //跳过多少数据
                let skip = (page - 1) * count;
                //共有多少页
                let num = Math.ceil(sum / count);
                let pageUrl = [];
                for (let i = 1; i <= num; i++) {
                    let obj = {
                        url: '/search?page=' + i + '&count=' + count + '&keyword=' + keyword,
                        class: page == i ? 'active' : ''
                    };
                    pageUrl.push(obj);
                }
                //console.log(page);
                Goods.find({goodsname: reg}).populate(['sellerId']).skip(skip).limit(count).then(result=> {
                    //console.log(result);
                    res.render('buyer/goodslist', {
                        gooslistActive: 'active',
                        username: req.userInfo.username,
                        result: result,
                        pre: page > 1 ? '/search?page=' + (page - 1) + '&count=' + count + '&keyword=' + keyword : '',
                        next: page < num ? '/search?page=' + (page + 1) + '&count=' + count + '&keyword=' + keyword : '',
                        pageUrl: pageUrl,
                        page: page,
                        isShow: sum > 0,
                        num: num,
                        sortpage: '/search?page=' + page + '&count=' + count + '&keyword=' + keyword
                    })
                })
            }else{
                res.render('buyer/notsearch');
            }
        })
    }
})

//login
router.get('/login',(req,res,next)=>{
    res.render('buyer/login',{
        loginActive:'active'
    });
})
//register
router.get('/register',(req,res,next)=>{
    res.render('buyer/register',{
        registerActive:'active'
    });

})
//退出登录
router.get('/loginout',(req,res,next)=>{
    req.cookies.set('USERID',null);
    //重定向
    res.redirect('/');
})
module.exports=router;