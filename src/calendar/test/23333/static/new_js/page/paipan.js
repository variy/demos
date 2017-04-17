// 流运表
function data_show(index){
    if (index == 1) {
        $('.user-data-table .lunar-side.shiShen').css('display','inline-block').siblings('.lunar-side').hide();
    }else if (index == 2) {
        $('.user-data-table .lunar-side.cangGan').css('display','inline-block').siblings('.lunar-side').hide();
    }else if (index == 3) {
        $('.user-data-table .lunar-side.wuXing').css('display','inline-block').siblings('.lunar-side').hide();
    }else{
        $('.user-data-table .lunar-side').hide();
    }
}

// 顶部选项卡
$(".tb-nav-wrap1 .tb-nav li").on('click', function(){
    var sizhu_index = $(this).index();
    $(this).addClass("cur").siblings().removeClass("cur");
    data_show(sizhu_index);
});

//选择流运
$(".subdiv").delegate(".liuyun-item","click",function(){
    var subdiv = $(this).parents('.subdiv'),
        type = subdiv.attr('liuyun-data'),
        item_index = $(this).index();

    $(this).addClass('cur').siblings().removeClass('cur');

    if (type === 'liushi') {
        return;
    };

    // 流年四柱请求
    $.ajax({
        type: 'POST',
        url: '/pop/paipan',
        data: {
            liuyun_sizhu:type,
            item_index:item_index
        },
        success: function (data) {
            $('#up-data-liuyun').html(data);
            var sizhu_index = $(".tb-nav-wrap1 .tb-nav li.cur").index();
            data_show(sizhu_index);
        }
    });

    // 流年表请求
    $.ajax({
        type: 'POST',
        url: '/pop/paipan',
        data: {
            act:type,
            item_index:item_index
        },
        success: function (data) {
            subdiv.hide().next().show().find('table').html(data);
        }
    });
})

//删除流运
$('.user-data-table').delegate(".upclose","click",function(){
    var tab = $(this).parent('.tab');
    var liuyun = $('#liuyun');
    $('.liuyun-item').removeClass('cur');
    if(tab.hasClass('dayun')){
        $('.user-data-table .tab').hide();
        liuyun.find('.dayun').show().siblings('.subdiv').hide();
    }else if(tab.hasClass('liunian')){
        $('.user-data-table .liunian,.user-data-table .liuyue,.user-data-table .liuday').hide();
        liuyun.find('.liunian').show().siblings('.subdiv').hide();
    }else if(tab.hasClass('liuyue')){
        $('.user-data-table .liuyue,.user-data-table .liuday').hide();
        liuyun.find('.liuyue').show().siblings('.subdiv').hide();
    }else if(tab.hasClass('liuday')){
        $('.user-data-table .liuday').hide();
        liuyun.find('.liuday').show().siblings('.subdiv').hide();
    }
})

//保存记录
function recordData(){
    return {
        sDate:$('#birthsolar').val(),
        Pbirth:$('.paipan-info').find('.time').html(),
        sTime:$('#birthtime').val(),
        iGender:$('#igender').val(),
        rName:$('#userName').html(),
        udid:$('#udid').val()
    };
}

function recordData(){
    return {
        sDate:$('#birthsolar').val(),
        Pbirth:$('.paipan-info').find('.time').html(),
        sTime:$('#birthtime').val(),
        iGender:$('#igender').val(),
        rName:$('#userName').html(),
        udid:$('#udid').val()
    };
}

$('#dorcd-btn').on('click',function(){
    Bazi.pop.show({
        src:'/pop/record?'+'&From=addRecord',
        width:600,
        title:'保存记录',
        data:recordData()
    });
})

// 编辑记录
$('#edit-t-dorcd').on('click',function(){
    Bazi.pop.show({
        src:'/pop/record?'+'&From=editRecord',
        width:650,
        title:'修改记录',
        data:recordData()
    });
})