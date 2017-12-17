/**
 * Created by Administrator on 2017/11/7 0007.
 */

$(function (){
    //尺寸
    var sizes=$('#sizeAdd').attr('data-sizes');
     sizes=sizes==''?[]:sizes.split(',');
   // console.log(sizes);
    var styles=$('#styleAdd').attr('data-styles');
    styles=styles==''?[]:styles.split(',');
    //console.log(styles);
        $('#sizeAdd').on('click',function (){
            if($('#size').val()!=''){
                if(sizes.indexOf($('#size').val())==-1){
                    sizes.push($('#size').val());
                   // console.log(sizes);
                    var  str='<button class="btn btn-primary relative">'+$('#size').val()+'<span class="Close">X</span></button>';
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
    $('#styleAdd').on('click',function (){
        if($('#style').val()!=''){
            if(styles.indexOf($('#style').val())==-1){
                styles.push($('#style').val());
               // console.log(styles);
                var  str='<button class="btn btn-primary relative">'+$('#style').val()+'<span class="Close">X</span></button>';
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
//修改
    $('#btn').on('click',function (){
       //var sellername=$('#username').val();
       //var decription=$('#decription').val();
       //var price=$('#price').val();
        var obj={
            goodsid:$(this).attr('data-id'),
            goodsname:$('#goodsname').val(),
            description:$('#description').val(),
            sizes:sizes,
            styles:styles,
            price:$('#price').val()
        }
        console.log(obj);
        $.post('/api/admin/updatagoods',obj,function (data){
            //console.log(data);
            if(data.status==1){
                //location.href='/admin/goodslist';
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
            }else{
                alert(data.msg);
            }
        });
   })

    //取消修改
    $('#cancel').on('click',function (){
        location.href='/admin/goodslist';
    })
})
