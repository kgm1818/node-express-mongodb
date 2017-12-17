/**
 * Created by Administrator on 2017/11/9 0009.
 */

$(function (){
    //大小
    $('.sizes span').on({
        'mouseenter': function () {
            $(this).addClass('check');
        },
        'mouseleave': function () {
            $(this).removeClass('check');
        }
    })
    $('.sizes span').on('click',function (){
        $(this).addClass('tb-check').siblings().removeClass('tb-check');
    })

    //款式
    $('.styles span').on({
        'mouseenter': function () {
            $(this).addClass('check');
        },
        'mouseleave': function () {
            $(this).removeClass('check');
        }
    })
    $('.styles span').on('click',function (){
        $(this).addClass('tb-check').siblings().removeClass('tb-check');
    })
    //数量加减
    $('#btn-decrease').click(function (){
        var value=Number($('.shop_num').val());
        if(value<=1){
            value=2;
        }
        $('.shop_num').val(--value);
    })
    $('#btn-increase').click(function (){
        var value=Number($('.shop_num').val());
        $('.shop_num').val(++value);
    })
    $('.buy').on('click',function (){
        var obj={
            sellerId:$('.sellername').attr('data-sellerid'),
            goodsId:$(this).attr('data-aid'),
            size:$('.sizes .tb-check').html(),
            style:$('.styles .tb-check').html(),
            num:$('.shop_num').val()
        }
        // console.log(obj);
        if(obj.size!=undefined && obj.style!=undefined){
            $.post('/api/detail',obj,function (data){
                // console.log(data);
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
            })
        }else{
            $('#msg').css({display:'block'});
            $('.success').html('<span class="erricon">x</span>'+'请选择尺寸和款式');
            $('.success .erricon').css({display:'block'});
        }
        $('.x_close').on('click',function (){
            $('#msg').css({display:'none'});
        })
    })
})