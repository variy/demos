var formatdate = require('./formatdate');

// 公用方法
module.exports = {

    isObjectValueEqual: function(a, b){
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];
            if (a[propName] !== b[propName]) {
                return false;
            }
        }
        return true;
    },

    formatStoN: function(str){
        if(!str){ return; }
        var arrData = str.split('');
        var html = "";
        $.each(arrData, function(i, num){
            if(num > 0){
                html += num;
            }
        });
        return html;
    },

    setLunarYearName: function(year){
        var lunarNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var arr = (year+'').split(''),
            str = '';

        arr.forEach(function(num){
            str += lunarNum[parseInt(num)];
        });

        return str;
    },

    setBirthday: function(aBirthday, type){
        var html = '';
        if( aBirthday === undefined){
            var aBirthday = {y:1980,m:1,d:1,h:12,min:0}
        }
        if(type == "solar"){
            html += aBirthday.y+'年'+  aBirthday.m+'月' + aBirthday.d+'日'+ aBirthday.h+'时'+ aBirthday.min+'分';
        }
        // else if(type == "lunar"){
        //     var zhiHour = formatdate.get.zhiHour[parseInt(aBirthday.h)];
        //     var lunarInfo =  LunarCalendar.calendar(aBirthday.y, aBirthday.m,false).monthData[aBirthday.d-1];
        //     html += common.setLunarYearName(lunarInfo.lunarYear)+'年'+  lunarInfo.lunarMonthName + lunarInfo.lunarDayName +'&nbsp;'+ zhiHour +'时';
        // }

        return html;
    },

    getMingjuVal: function(id){
        for (var i = 0,len = BAZI.lang.mingju.length; i < len; i++) {
            if( BAZI.lang.mingju[i][0] === parseInt(id) ){
                return BAZI.lang.mingju[i][1];
            }
        };
        throw new Error('没有这个id的命局！')
        
    },
    getBirthdayStr: function(dateArr, isLunar){
        var html = '';
        if( isLunar === undefined){
            isLunar = true;
        }
        if(isLunar){
            html += dateArr[0] +'年'+  dateArr[1] +'月' + dateArr[2] +'日'+ dateArr[3] +'时'+ dateArr[4] +'分';
        }else{
            var zhiHour = BAZI.utilities.zhiHour[parseInt(dateArr[3])];
            var lunarInfo =  LunarCalendar.calendar(dateArr[0], dateArr[1],false).monthData[dateArr[2]-1];
            html = BAZI.Common.setLunarYearName(lunarInfo.lunarYear)+'年'+  lunarInfo.lunarMonthName + lunarInfo.lunarDayName +'&nbsp;'+ zhiHour +'时';
        }

        return html;
    },
    transUnixTimeToDateStr: function(unix){
        var date = new Date( parseInt(unix)*1000 );
        return (date.getMonth()+1) +'月'+ date.getDate() + '日 '+ this.fotmatNum( date.getHours() )+':'+ this.fotmatNum( date.getMinutes() );
    },
    setLuck: function(aStartLuck){
        var html = '';
        html += "出生后 " + aStartLuck.y + " 年 " + aStartLuck.m + " 个月 " + aStartLuck.d + " 天 起运";
        return html;
    },
    getCurTimeStr: function(){
        var date = new Date;
        return (date.getMonth()+1) +'月'+ date.getDate() + '日 '+ this.fotmatNum( date.getHours() )+':'+ this.fotmatNum( date.getMinutes() );
    },    
    showMyInfo: function(){
        var data = {
            sDate: BAZI.User.birthsolar,
            sTime: BAZI.User.birthtime,
            iGender: BAZI.User.igender,
            rName: BAZI.User.rname,
            fromRecord: false
        };
        $.extend(BAZI.userData, BAZI.User);
        new BAZI.Views.Paipan(data);
    },

    showUserInfo: function(){

    },

    formatDate: function(data,type){

        var fotmatNum =  function(num){
            var html = '';
            if(num < 10){
                html = '0' + num;
            }else{
                html += num;
            }
            return html;
        };

        var html = '';
        switch (type){
            case 'date':
                html = data.year + '-' + fotmatNum(data.month) + '-' + fotmatNum(data.day);
                break;
            case 'time':
                html = fotmatNum(data.hour) + ':' +fotmatNum(data.min) + ':' + fotmatNum(data.second);
                break;
            default: break;
        }
        return html;
    },

    fotmatNum: function(num) {
        var html = '';
        if (num < 10) {
            html = '0' + num;
        } else {
            html += num;
        }
        return html;
    },

    formatDateData: function(year,month,day){
        return year + '-' + this.fotmatNum(month) + '-' + this.fotmatNum(day);
    },
    formatTimeData: function(hour,min,second){
        return this.fotmatNum(hour) + ':' + this.fotmatNum(min) + ':' + this.fotmatNum(second);
    },
    addClassify: function(opts) {
        var settings = {
            recordsData: [],
            beforeOpenBtnClick: function(){
                return true;
            },
            onaddclassify: function(){

            },
            onmoveclassify: function(cid){

            },
            validateNew: function(val) {
                addForm.validate({
                    rules: {
                        add_classify: {
                            required: true,
                            minlength: 2,
                            maxlength: 10
                        }
                    },
                    messages: {
                        add_classify: {
                            required: '请输入新分类名称',
                            minlength: '分类名称长度不能少于2位'
                        }
                    }
                });
            }
        };

        $.extend(settings, opts);

        var oBox = settings.oBox;
        var html = _.template(BAZI.tpls.tpls_plugins_handle_classify)({
            recordList: settings.recordsData
        });
        oBox.html(html);

        var dropdownEl = oBox.find('.dropdown');
        var oList = oBox.find('.dropdown-menu');
        var dropdownBtn = oBox.find('.dropdown-toggle');

        var addBtn = oBox.find('[data-type=add]');
        var addForm = oBox.find('form');
        var addInput = addBtn.find('input');
        var addTips = addBtn.find('p');

        dropdownBtn.click(function() {
            if( settings.beforeOpenBtnClick() ){
                dropdownEl.addClass('open');
            }   
        });

        oList.delegate('li', 'click', function(event) {
            if ($(this).data('type') === 'add') {
                $(this).find('p').hide().siblings().show();
            }else{
                addInput.val('').parent('form').hide().siblings('p').html('+ 新的分类').show();
                if(  $(this).attr('showbtn') === undefined ||  $(this).attr('showbtn') === '0' ){
                    oList.find('button').remove();
                    oList.find('[showbtn=1]').attr('showbtn', '0');
                    $(this).attr('showbtn', '1' );

                    var confirmBtn = $('<button class="btn-xs btn btn-primary fn-right">确认</button>');
                    var txt = $(this).find('a').text();
                    var cid = $(this).data('id');
                    $(this).find('a').append(confirmBtn);

                    confirmBtn.click(function(e){
                        dropdownEl.removeClass('open');
                        settings.onmoveclassify(cid, txt);
                        e.stopPropagation();
                    });
                }
                    
            }

        });
        settings.validateNew();
        addInput.keydown(function(e) {
            if (e.keyCode === 13) {
                
                addForm.valid();
                if( addForm.validate().form()){
                    settings.onaddclassify(addInput.val(), addBtn);
                    addInput.val('').parent('form').hide().siblings('p').html('+ 新的分类').show();
                }
                    
            }
        });

        $('body').click(function(e) {

            if (oList.is(":visible")) {

                function has(obj1, obj2 ){
                    if( obj1 === document.body)return false;
                    if( obj1 === obj2) {
                        return true;
                    }else{
                        obj1 = obj1.parentNode;
                        return has(obj1, obj2);
                    } 
                };
                if ( !has( e.target, oBox[0]) ) {
                    dropdownEl.removeClass('open');
                    addTips.show().siblings().hide();
                }
            }

        });

        return {
            listEl: oList
        }
    }
};