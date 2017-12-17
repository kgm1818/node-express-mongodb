/**
 * Created by Administrator on 2017/11/6 0006.
 */
$(function (){
    var logourl='';
    $('#btn').on('click',function (){
        var sellername= $('#sellername').val();
        var description= $('#description').val();
        var psw= $('#password').val();
        var repsw= $('#repassword').val();
        //console.log(logourl);
      $.post('/api/admin/register',{
          sellername:sellername,
          description:description,
          psw:psw,
          repsw:repsw,
          logourl:logourl
      },function (data){
          //console.log(data);
          if(data.status==1){
              location.href='/admin/login';
          }else{
              console.log(data.msg);
          }
      })
    })
    //上传图片
    $('#logo').on('change',function (){
        //获得表单数据
        var formData=new FormData($('#upload-logo')[0]);
        // 发送ajax请求，将图片传输给后台
        $.ajax({
            type:'post',
            url:'/api/admin/upload-logo',
            processData: false,//没有设置processData，默认按照jq方式处理请求
            contentType: false,//才能识别到enctype="multipart/form-data"
            data:formData,
            success:function (data){
                console.log(data);
                if(data.status==1){
                    logourl= document.querySelector('#logo-img').src=data.data.url;
                }else{
                    alert(data.msg);
                }
            },
            error:function (err){
                console.log(err);
            }
        })
    })

})