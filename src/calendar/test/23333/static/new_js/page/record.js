// 名字
var name = $('#recordName').val();
if (name === '') {
    $('#name-input').parent().show();
}else{
    $('#user-name').show().html(name);
}

// 生日
$('#user-lunar').html($('#user-lunar-input').val());

// 关系分类
function has(obj1, obj2) {
    if (obj1 === document.body) return false;
    if (obj1 === obj2) {
        return true;
    } else {
        obj1 = obj1.parentNode;
        return has(obj1, obj2);
    }
};

$('.dropdown .dropdown-toggle').click(function(e){
    $(e.currentTarget).parent('.dropdown').toggleClass('open');
});
$('.filter-relclass-dropdown .dropdown-menu').delegate('li', 'click', function(e){
    var classId = $(e.currentTarget).data('id');
    var val = $(e.currentTarget).text();
    $(e.currentTarget).parents('.dropdown').removeClass('open').find('button .txt').html(val).attr('data-id',classId);
});
$('body').click(function(e){
    $('.dropdown').each(function(){
        if( $(this).hasClass('open') && !has(e.target, this) ){
            $(this).removeClass('open');
        }
    });
});
// 关系分类 end

// 保存记录
function valid(){
    var formAddRecord = $('#formAddRecord');
    formAddRecord.validate({
        rules: {
            telephone: {
                required: true,
                mobile: true
            },
            username: {
                required: true,
                minlength: 2
            }
        },
        messages: {
            telephone: {
                required: '请输入手机'
            },
            username: {
                required: '请输入姓名',
                minlength: '姓名长度不能少于2位'
            }
        }
    });
    return flag = formAddRecord.valid();
}

function recordData(){
    return {
        rname:$('#name-input').val(),
        relation:$('#u-relation').find('.txt').attr('data-id'),
        umobile:$('#mobile-input').val(),
        From:'addRecord'
    };
}

$('#btnAddRecord').on('click',function(){
    valid();
    if(!flag){
        return;
    }

    $.ajax({
        type: 'POST',
        url: location.href,
        data: recordData(),
        success: function (data){
            var pop = Bazi.pop.cur();
            var paipan = Bazi.pop.get('pop_paipan');

            if(data.ret !== 0){
                Bazi.pop.show({
                    prompt:'保存记录失败',
                    title:'提示',
                    timeout:600
                });
            }else{
                Bazi.pop.show({
                    prompt:'保存记录成功',
                    title:'提示',
                    timeout:600,
                    after_hide:function(){
                        pop.hide();
                        paipan.frame.$('#userName').text($('#name-input').val());
                        paipan.frame.$('#edit-t-dorcd').show();
                        paipan.frame.$('#dorcd-btn').hide();
                    }
                });
            }
        }
    });
})

// 修改记录

// 编辑性别
var sexInput = $('#edit-sex');
var isex = sexInput.val();
$('input[data-isex='+ isex+']').attr('checked','checked').parent('label').addClass('on');
$('#edit-sex-tab').find('label').on('click', function(){
    var el = $(this).find('input[type=radio]');
    $(this).addClass('on').siblings().removeClass('on');
    $('#edit-sex').val(el.val());
});

// 编辑日历控件
var dateInfo = [];//日历控件日期
var timeInfo = [];//日历控件时间
var qipan_data;

new Bazi.calCtrlBar({
    oBoxEl: $('#editRecord-calendar'),
    activeClass: 'cur',
    updateDate: function(data) {
        dateInfo = [data.year, data.month, data.day];
        timeInfo = [data.hour, data.min, data.second];
    }
});

function editRecordData(){
    var year = dateInfo[0];
    var mouth = dateInfo[1];
    var day = dateInfo[2];

    var hour = timeInfo[0];
    var min =  timeInfo[1];
    var second = timeInfo[2];

    var format = function(num){
        if(num < 10){
            return '0' + num;
        }
        return ''+num;
    };

    return {
        rname:$('#edit-name-input').val(),
        relation:$('#u-relation').find('.txt').attr('data-id'),
        umobile:$('#edit-mobile-input').val(),
        igender:$('#edit-sex').val(),
        birthsolar:year+'-'+ format(mouth)+'-'+ format(day),
        birthtime:format(hour)+':'+ format(min)+':'+ format(second),
        From:'editRecord'
    };
}

$('#btnEditRecord').on('click',function(){
    valid();
    if(!flag){
        return;
    }

    $.ajax({
        type: 'POST',
        url: location.href,
        data: editRecordData(),
        success: function (data){
            var pop = Bazi.pop.cur();
            var paipan = Bazi.pop.get('pop_paipan');

            if(data.ret !== 0){
                Bazi.pop.show({
                    prompt:'修改记录失败',
                    title:'提示',
                    timeout:600
                });

            }else{
                Bazi.pop.show({
                    prompt:'修改记录成功',
                    title:'提示',
                    timeout:600,
                    after_hide:function(){
                        pop.hide();
                    }
                });
            }
        }
    });
})