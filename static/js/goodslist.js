
$(function (){
    //ɾ����Ʒ
    $('.table').on('click','#delete',function (){
       //console.log( $(this).attr('data-delete'));
        $.post('/api/admin/delete',{goodsid:$(this).attr('data-delete')},function (data){
            //console.log(data);
            if(data.status==1){
                location.reload();
            }else{
                alert(data.msg);
            }
        })
    })

    //������Ʒ
    $('#btn').on('click',function (){
        var value=$('#text').val();
       // console.log(value);
       location.href='search?keyword='+value;
    })
    //�س�������
    $('#text').on('keyup',function (event){
        var value=$('#text').val();
        if(event.keyCode==13){
            location.href='search?keyword='+value;
        }
    })

})