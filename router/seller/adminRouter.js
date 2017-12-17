/**
 * Created by Administrator on 2017/11/6 0006.
 */
const express=require('express');
const url=require('url');
const Goods=require('../../models/Goods');
const Order=require('../../models/Order');
const User=require('../../models/User');
//����·��
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
    // �ж��Ƿ����̼�id�����û����������ض��򵽵�¼ҳ��
    let sellerid = req.cookies.get('SELLERID');
    //console.log(sellerid);
    if(sellerid){
        next();
    }else{
        res.redirect('/admin/login');
    }
})

//��ҳ
router.get('/',(req,res,next)=>{
    res.render('seller/home',{
        homeActive:'active',
        username:req.userInfo.username
    });
})
//goodslist
router.get('/goodslist',(req,res,next)=>{
    let query=url.parse(req.url,true).query;
    //���Ҹ��̼ҵ�������Ʒ
   Goods.where({
       sellerId:req.sellerInfo._id
   }).count().then(sum=>{
      // console.log(sum);
       let page=Number(query.page) || 1;
       let count=Number(query.count) || 5;
       //������������
       let skip=(page-1)*count;
       //���ж���ҳ
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
    //���Ҹ��̼ҵ����ж���
    Order.find({
        sellerId:req.sellerInfo._id
    }).populate(['userId']).populate(['goodsId']).then(result=>{
        //console.log(result);
        let arrOeder=[];
        for(let i=0;i<result.length;i++){
            let obj={
                 username:result[i].userId.username,//����ǳ�
                goodsname:result[i].goodsId.goodsname,//��Ʒ����
                 price:result[i].goodsId.price,//��Ʒ�۸�
                 num:result[i].num,//��Ʒ����
                 size:result[i].size,//��Ʒ�ߴ�
                 style:result[i].style,//��Ʒ��ʽ
                 totalPrice:result[i].num*result[i].goodsId.price//�ö����ܼ�
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


//�޸���Ʒ
router.get('/updatagoods',(req,res,next)=>{
    let query=url.parse(req.url,true).query;
   // console.log(query.goodsid);
    //�����ݿ��������
    Goods.findById(query.goodsid).then(result=>{
       // console.log(result);
        res.render('seller/updatagoods',{
            addgoodsActive:'active',
            result:result
        });
    })

})


//�˳���¼
router.get('/loginout',(req,res,next)=>{
    req.cookies.set('SELLERID',null);
    //�ض���
    res.redirect('admin/login');
})
module.exports=router;