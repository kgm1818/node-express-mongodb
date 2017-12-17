/**
 * Created by Administrator on 2017/11/6 0006.
 */

const express=require('express');
const swig=require('swig');
const mainRouter=require('./router/buyer/mainRouter');
const apiRouter=require('./router/buyer/apiRouter');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Cookies=require('cookies');
const User=require('./models/User');
const Seller=require('./models/Seller');
const adminRouter=require('./router/seller/adminRouter');
const apiAdminRouter=require('./router/seller/apiAdminRouter');
//搭建服务器
const server=express();

//处理coookies
server.use((req,res,next)=>{
    let cookies = new Cookies(req, res);
    req.cookies = cookies;
    next();
})
//买家cookies
server.use((req,res,next)=>{
    let userId= req.cookies.get('USERID');
    if(userId){//登录了
        User.findById(userId).then(result=> {
            if (result) {//存在
                req.userInfo=result;
                next();
            } else {//不存在
               // console.log('cookie被修改');
                req.userInfo={};
                next();
            }
        })
    }else{//没登录
       // console.log('请登录');
        req.userInfo={};
        next();
    }
})
//卖家cookies
server.use((req,res,next)=>{
    let sellerId= req.cookies.get('SELLERID');
    if(sellerId){//登录了
        Seller.findById(sellerId).then(result=> {
            if (result) {//存在
                req.sellerInfo=result;
                next();
            } else {//不存在
                // console.log('cookie被修改');
                req.sellerInfo={};
                next();
            }
        })
    }else{//没登录
        // console.log('请登录');
        req.sellerInfo={};
        next();
    }
})

//配置模板引擎
//1.配置使用的模板引擎
server.engine('html',swig.renderFile);
//2.配置模板路径
server.set('views','./html');
//3.设置服务使用模板引擎
server.set('view engine','html');
//4关闭模板引擎缓存页面
swig.setDefaults({cache:false});

//静态请求处理(静态托管)
server.use('/public',express.static('./static'));
server.use('/images',express.static('./images'));

//买家页面请求处理
server.use('/',mainRouter);
//卖家页面请求处理
server.use('/admin',adminRouter);
server.use(bodyParser.urlencoded());
//ajax请求处理，(表单提交)
server.use('/api',apiRouter);
server.use('/api/admin',apiAdminRouter);

//监听服务器错误
server.on('listening',err=>{
    if(err){
        console.log('服务器错误');
        console.log(err);
    }
})
//连接数据库
mongoose.connect('mongodb://localhost:8000',err=>{
    if(err){
        console.log('数据库连接失败');
        console.log(err);
    }else{
        console.log('数据连接成功');
        //启动服务器
        server.listen('3000','localhost',()=>{
            console.log('服务器已启动');
        });
    }
})
