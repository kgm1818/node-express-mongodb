/**
 * Created by Administrator on 2017/11/7 0007.
 */

$(function (){
    //尺寸
    var sizes=[];
    $('#sizeAdd').on('click',function (){
        if($('#size').val()!=''){
            if(sizes.indexOf($('#size').val())==-1){
                sizes.push($('#size').val());
                // console.log(sizes);
                var  str='<span class="btn relative">'+$('#size').val()+'<span class="Close">X</span></span>';
                $(this).parent().append(str);
            }
        }
        $(this).siblings('.form-control').val('');
    })
    $('.form-group').on('click','.Close',function (){
        sizes.splice($(this).index('.Close'),1);
        $(this).parent().remove();
        //console.log(sizes);
    })

    //款式
    var styles=[];
    $('#styleAdd').on('click',function (){
        if($('#style').val()!=''){
            if(styles.indexOf($('#style').val())==-1){
                styles.push($('#style').val());
                // console.log(styles);
                var  str='<span class="btn relative">'+$('#style').val()+'<span class="Close">X</span></span>';
                $(this).parent().append(str);
            }
        }
        $(this).siblings('.form-control').val('');
    })
    $('.form-group').on('click','.Close',function (){
        styles.splice($(this).index('.Close'),1);
        $(this).parent().remove();
        // console.log(styles);
    })
    var picUrlArr=[];
    $('#btn').on('click',function (){
        //var sellername=$('#username').val();
        //var decription=$('#decription').val();
        //var price=$('#price').val();

        var obj={
            goodsname:$('#goodsname').val(),
            picUrlArr:picUrlArr,
            description:$('#description').val(),
            sizes:sizes,
            styles:styles,
            price:$('#price').val()
        }
        console.log(obj);
        $.post('/api/admin/add-shop',obj,function (data){
             //console.log(data);
            $('#msg').css({display:'block'});

            if(data.status==1){
                $('.success').html(data.msg);
            }else{
                $('.success').html('<span class="erricon">x</span>'+data.msg);
                $('.success .erricon').css({display:'block'});
            }
            $('.x_close').on('click',function (){
                $('#msg').css({display:'none'});
            })
        });
    })
//取消添加
    $('#cancel').on('click',function (){
        location.href='/admin/goodslist';
    })

    $('#pic').on('change',function (){
        //console.log('111');
        //获取表单数据
        var formData=new FormData($('#upload-pic')[0]);
        //console.log(formData);
        $.ajax({
            type:'POST',
            url:'/api/admin/upload-pic',
            processData: false,//没有设置processData，默认按照jq方式处理请求
            contentType: false,//才能识别到enctype="multipart/form-data"
            data:formData,
            success:function (data){
                //console.log(data);
                //console.log(picUrl);
                if(data.status==1){
                    picUrlArr=data.data.urlArr;
                    for(var i=0;i<picUrlArr.length;i++){
                       var li=$('<li></li>').appendTo($('.pic_ul'));
                        $('<img src='+picUrlArr[i]+'>').appendTo(li);
                    }
                }else{
                    console.log(data.msg);
                }
            },
            error:function(err){
                console.log('上传失败');
                console.log(err)
            }
        })
    })
})
