/**
 * Created by Administrator on 2017/11/6 0006.
 */
$(function () {
    $('#btn').on('click', function (){
        var sellername = $('#sellername').val();
        var psw = $('#password').val();
        //console.log(sellername+'--'+psw);
        $.post('/api/admin/login',{
            sellername: sellername,
            psw: psw
        }, function (data){
           /// console.log(data);
            if(data.status==1){
                location.href='/admin';
            }else{
                console.log(data.msg);
            }
        })
    })
})