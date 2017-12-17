/**
 * Created by Administrator on 2017/11/6 0006.
 */

const express=require('express');
const Seller=require('../../models/Seller');
const Goods=require('../../models/Goods');
const multiparty = require('multiparty');//处理图片
const router=express.Router();
//register
router.post('/register',(req,res,next)=>{
    let responseData={
        msg:'',
        status:''
    }
    let query=req.body;
    // console.log(query);
    if(query.sellername==''||query.psw==''||query.repsw==''){
        responseData.msg='用户名，密码不能为空';
        responseData.status=0;
        res.json(responseData);
    }else if(query.psw!=query.repsw){
        responseData.msg='密码与确认密码不一致';
        responseData.status=2;
        res.json(responseData);
    }else{//查找数据库有没有该用户
        Seller.findOne({
            sellername:query.sellername
        }).then(result=>{
            if(result){//有该用户
                responseData.msg='该商家已存在';
                responseData.status=3;
                res.json(responseData);
            }else{//保存数据
                let data=new Seller({
                    sellername:query.sellername,
                    password:query.psw,
                    description:query.description,
                    sellerlogo:query.logourl
                })
                data.save().then(sellerInfo=>{//保存数据成功
                    if(sellerInfo){
                        responseData.msg='注册成功';
                        responseData.status=1;
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
//卖家头像上传
router.post('/upload-logo',(req,res,next)=>{
    //接收浏览器传输过来的图片
    //1.创建接收表单数据的对象
    let form = new multiparty.Form();
    // 2.设置文件缓存路径 // 保存图片
    form.uploadDir = './images/logo';//根路径
    /// 3.解析request中表单数据
    form.parse(req,(err,fields,files)=>{
        //console.log(err);
        //console.log(fields);
        //console.log(files);
        if(!err){
            res.json({
                msg:'上传成功',
                status:1,
                data:{
                    url:'/'+files.test[0].path // 将保存好的图片路径返回给浏览器
                }
            })
        }else{
            res.json({
                msg:'上传失败',
                status:0
            })
        }
    })
})



//login
router.post('/login',(req,res,next)=>{
    let query=req.body;
    //console.log(query);
    let responseData={
        msg:'',
        status:''
    }
    if(query.sellername==''||query.psw==''){
        responseData.msg = '用户名，密码不能为空';
        responseData.status = 0;
        res.json(responseData);
    }else{//查找数据库有没有该用户
        Seller.findOne({
            sellername:query.sellername
        }).then(result=>{
            if(result){//有
              if(query.psw==result.password){
                  responseData.msg = '登录成功';
                  responseData.status = 1;
                  req.cookies.set('SELLERID',result._id);
                  res.json(responseData);
              }
            }else{//不存在
                responseData.msg = '该用户不存在';
                responseData.status = 2;
                res.json(responseData);
            }
        })
    }
})

//卖家添加商品
router.post('/add-shop',(req,res,next)=>{
    let query=req.body;
   // console.log(query);
    let responseData={
        msg:'',
        status:''
    }
    if(query.goodsname){
       // console.log( req.sellerInfo);
        let goods = new Goods({
            sellerId: req.sellerInfo._id,
            goodsname: query.goodsname,
            goodspic:query.picUrlArr,
            description: query.description,
            sizes: query.sizes,
            styles: query.styles,
            price: query.price
        })
        goods.save().then(result=> {
            if (result) {//添加成功
                responseData.msg = '商品添加成功';
                responseData.status = 1;
                res.json(responseData);
            } else {//添加失败
                responseData.msg = '商品添加失败';
                responseData.status = 0;
                res.json(responseData);
            }
        })
    }else{
        responseData.msg = '请填商家名称';
        responseData.status = 2;
        res.json(responseData);
    }
})
//上传商品图片
router.post('/upload-pic',(req,res,next)=>{
    //创建接收表单数据的对象
    let form=new multiparty.Form();
    //设置文件保存路径///根路径
    form.uploadDir='./images/image';
    //解析表单中数据
    form.parse(req,(err,fields,files)=>{
        //console.log(err);
        //console.log(fields);
        //console.log(files);
        let urlArr=[];
        for(let i=0;i<files.test.length;i++){
            urlArr.push('/' + files.test[i].path)
        }
        //console.log(urlArr);
        if(!err) {
            res.json({
                msg: '上传成功',
                status: 1,
                data: {
                    urlArr: urlArr,
                }
             })
        }else{
            res.json({
                msg: '上传失败',
                status: 0,
            })
        }
    })
})

//修改商品
router.post('/updatagoods',(req,res,next)=>{
    let query=req.body;
    //console.log(query)
    let responseData={
        msg:'',
        status:''
    }
    Goods.findByIdAndUpdate(query.goodsid,{
        goodsname:query.goodsname,
        description:query.description,
        sizes:query.sizes,
        styles:query.styles,
        price:query.price
    }).then(result=>{
        console.log(result);
        if(result){
            responseData.msg='修改成功';
            responseData.status=1;
            res.json(responseData);
        }else{
            responseData.msg='修改失败';
            responseData.status=0;
            res.json(responseData);
        }
    })
})
//删除商品
router.post('/delete',(req,res,next)=>{
    let query=req.body;
   // console.log(query);
    let responseData={
        msg:'',
        status:''
    }
    Goods.findByIdAndRemove(query.goodsid).then(result=>{
       // console.log(result);
        if(result){//删除成功
            responseData.msg='删除成功';
            responseData.status=1;
            res.json(responseData);
        }else{//删除失败
            responseData.msg='删除失败';
            responseData.status=0;
            res.json(responseData);
        }
    })
})

module .exports=router;