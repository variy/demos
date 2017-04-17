(function (doc, win) {

    var ua = navigator.userAgent;
    var support = {
        isMobile: (/mobile/i).test(ua),

        Touch: ('ontouchstart' in win),

    };
    // 全局命名空间
    win.BAZI = {};

    // 全局变量
    win.clientHeight = window.innerHeight,
    win.clientWidth = window.innerWidth,
    win.scale = clientWidth/640;
    win.supportEvent = support.Touch ? 'tap' : 'click';
    win.$support = support;

    // 用户信息
    win.User = {};

    if(sessionStorage.User){
        User = JSON.parse(sessionStorage.User);
    }

    // 默认配置
    win.Config = _.defaults(win.Config || {}, {
        apiUrl: "http://bazi.oa.com/api/gateway.php",
        lang: "zh_cn",
        debug: 0
    });

    // debug / console
    if(Config.debug < 1){

        win.console = {
            log: function(){},
            error: function(){}
        }
    }

    BAZI.provinceData = ["北京","上海","天津","重庆","河北","山西","内蒙古","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南","四川","贵州","云南","西藏","陕西","甘肃","宁夏","青海","新疆","香港","澳门","台湾","其它"];
    BAZI.cityData = [
        "东城|西城|崇文|宣武|朝阳|丰台|石景山|海淀|门头沟|房山|通州|顺义|昌平|大兴|平谷|怀柔|密云|延庆",
        "黄浦|卢湾|徐汇|长宁|静安|普陀|闸北|虹口|杨浦|闵行|宝山|嘉定|浦东|金山|松江|青浦|南汇|奉贤|崇明",
        "和平|东丽|河东|西青|河西|津南|南开|北辰|河北|武清|红挢|塘沽|汉沽|大港|宁河|静海|宝坻|蓟县",
        "万州|涪陵|渝中|大渡口|江北|沙坪坝|九龙坡|南岸|北碚|万盛|双挢|渝北|巴南|黔江|长寿|綦江|潼南|铜梁|大足|荣昌|壁山|梁平|城口|丰都|垫江|武隆|忠县|开县|云阳|奉节|巫山|巫溪|石柱|秀山|酉阳|彭水|江津|合川|永川|南川",
        "石家庄|邯郸|邢台|保定|张家口|承德|廊坊|唐山|秦皇岛|沧州|衡水",
        "太原|大同|阳泉|长治|晋城|朔州|吕梁|忻州|晋中|临汾|运城",
        "呼和浩特|包头|乌海|赤峰|呼伦贝尔盟|阿拉善盟|哲里木盟|兴安盟|乌兰察布盟|锡林郭勒盟|巴彦淖尔盟|伊克昭盟",
        "沈阳|大连|鞍山|抚顺|本溪|丹东|锦州|营口|阜新|辽阳|盘锦|铁岭|朝阳|葫芦岛",
        "长春|吉林|四平|辽源|通化|白山|松原|白城|延边",
        "哈尔滨|齐齐哈尔|牡丹江|佳木斯|大庆|绥化|鹤岗|鸡西|黑河|双鸭山|伊春|七台河|大兴安岭",
        "南京|镇江|苏州|南通|扬州|盐城|徐州|连云港|常州|无锡|宿迁|泰州|淮安",
        "杭州|宁波|温州|嘉兴|湖州|绍兴|金华|衢州|舟山|台州|丽水",
        "合肥|芜湖|蚌埠|马鞍山|淮北|铜陵|安庆|黄山|滁州|宿州|池州|淮南|巢湖|阜阳|六安|宣城|亳州",
        "福州|厦门|莆田|三明|泉州|漳州|南平|龙岩|宁德",
        "南昌市|景德镇|九江|鹰潭|萍乡|新馀|赣州|吉安|宜春|抚州|上饶",
        "济南|青岛|淄博|枣庄|东营|烟台|潍坊|济宁|泰安|威海|日照|莱芜|临沂|德州|聊城|滨州|菏泽",
        "郑州|开封|洛阳|平顶山|安阳|鹤壁|新乡|焦作|濮阳|许昌|漯河|三门峡|南阳|商丘|信阳|周口|驻马店|济源",
        "武汉|宜昌|荆州|襄樊|黄石|荆门|黄冈|十堰|恩施|潜江|天门|仙桃|随州|咸宁|孝感|鄂州",
        "长沙|常德|株洲|湘潭|衡阳|岳阳|邵阳|益阳|娄底|怀化|郴州|永州|湘西|张家界",
        "广州|深圳|珠海|汕头|东莞|中山|佛山|韶关|江门|湛江|茂名|肇庆|惠州|梅州|汕尾|河源|阳江|清远|潮州|揭阳|云浮",
        "南宁|柳州|桂林|梧州|北海|防城港|钦州|贵港|玉林|南宁地区|柳州地区|贺州|百色|河池",
        "海口|三亚",
        "成都|绵阳|德阳|自贡|攀枝花|广元|内江|乐山|南充|宜宾|广安|达川|雅安|眉山|甘孜|凉山|泸州",
        "贵阳|六盘水|遵义|安顺|铜仁|黔西南|毕节|黔东南|黔南",
        "昆明|大理|曲靖|玉溪|昭通|楚雄|红河|文山|思茅|西双版纳|保山|德宏|丽江|怒江|迪庆|临沧",
        "拉萨|日喀则|山南|林芝|昌都|阿里|那曲",
        "西安|宝鸡|咸阳|铜川|渭南|延安|榆林|汉中|安康|商洛",
        "兰州|嘉峪关|金昌|白银|天水|酒泉|张掖|武威|定西|陇南|平凉|庆阳|临夏|甘南",
        "银川|石嘴山|吴忠|固原",
        "西宁|海东|海南|海北|黄南|玉树|果洛|海西",
        "乌鲁木齐|石河子|克拉玛依|伊犁|巴音郭勒|昌吉|克孜勒苏柯尔克孜|博尔塔拉|吐鲁番|哈密|喀什|和田|阿克苏",
        "",
        "",
        "台北|高雄|台中|台南|屏东|南投|云林|新竹|彰化|苗栗|嘉义|花莲|桃园|宜兰|基隆|台东|金门|马祖|澎湖",
        "北美洲|南美洲|亚洲|非洲|欧洲|大洋洲"
    ];

    // 公用方法
    BAZI.Common = {

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
            }else if(type == "lunar"){
                var zhiHour = utilities.zhiHour[parseInt(aBirthday.h)];
                var lunarInfo =  LunarCalendar.calendar(aBirthday.y, aBirthday.m,false).monthData[aBirthday.d-1];
                html += BAZI.Common.setLunarYearName(lunarInfo.lunarYear)+'年'+  lunarInfo.lunarMonthName + lunarInfo.lunarDayName +'&nbsp;'+ zhiHour +'时';
            }

            return html;
        },

        setLuck: function(aStartLuck){
            var html = '';
            html += "出生后 " + aStartLuck.y + " 年 " + aStartLuck.m + " 个月 " + aStartLuck.d + " 天 起运";
            return html;
        },

        setBtn: function(parent, str, cb){
            var me = this;
            parent.html(str);

            if(!str){
                parent.unbind(supportEvent);
                return;
            }

            var btnFunc = function(){};
            switch(str){
                case '编辑':
                    btnFunc = function(){
                        BAZI.router.pinfo();
                    }; break;
                case '存储':
                    btnFunc = function(){
                        if(!User.isLogin){
                            BAZI.router.login('paipan');
                        }else{
                            BAZI.router.pinfo({newInfo: true});
                        }
                    }; break;
                case '添加':
                    btnFunc = function(){
                        BAZI.router.events();
                    }; break;
                default: break;
            };

            if(cb){
                btnFunc = cb;
            }

            parent.unbind(supportEvent);
            parent.on(supportEvent, function(){
                btnFunc();
            });
        },

        showTips: function(content, cb){

            var tips = $('.error-tips');
            if(tips.length < 1){
               tips = $('<div class="error-tips">' + content + '</div>');
               $('#viewport').prepend(tips);
            }
            tips.show();

            setTimeout(function(){
                tips.remove();
                (cb||function(){})();
            }, 800);
        },

        showMyInfo: function(){
            var data = {
                sDate: User.birthsolar,
                sTime: User.birthtime,
                iGender: User.igender,
                rName: User.rname,
                fromRecord: false
            };
            $.extend(BAZI.userData, User);
            BAZI.router.paipan(data);
        },

        showCalendarBtn: function(parent, cb){
            var obj = BAZI.userData;
            if(! ('sDate' in obj) ){
                $.extend(obj,{
                    birthsolar: "1980-01-01",
                    birthtime: "12:00:00"
                });
            };

            var date = obj.sDate ? obj.sDate : obj.birthsolar;
            var time = obj.sTime ? obj.sTime : obj.birthtime;
            var birthsolar = date.split('-');
            var birthtime = time.split(':');

            var btnDate = {
                year: birthsolar[0],
                month: BAZI.Common.formatStoN(birthsolar[1]),
                day: BAZI.Common.formatStoN(birthsolar[2]),
                hour: BAZI.Common.formatStoN(birthtime[0])
            };

            var calendar = new Calendar({
                startYear: 1900,
                long: 200,
                defaultDate: btnDate,
                isLunarInput: false,
                chosenClass:'cur'
            }, function(data){
                // debugger;
                // // console.log("showCalendarBtn---------", data);
                // var hour = 0;
                // if(data.hour < 10){
                //     hour = "0"+data.hour;
                // };
                // $.extend(data, {hour: hour});

                var html = $.tmpl($('#calendarBtn-templates').html(), data);
                parent.html(html);

                var infoBox = $('.cal-lunar-info');
                var typeToggleBtn = $('.cal-toggle');
                var old_calType = typeToggleBtn.find('> .active').data('caltype');
                infoBox.find('[data-caltype ='+old_calType+']').show();

                parent.on(supportEvent, function(){
                    BAZI.Common.showCalendar(parent, btnDate, data, cb);
                });

            });


        },

        showCalendarPop: function(btnDate, cb){
            var calendar = new Calendar({
                startYear: 1900,
                long: 200,
                defaultDate: btnDate,
                isLunarInput: false,
                chosenClass:'cur'
            }, function(data){
                var hour = 0;
                if(data.hour < 10){
                    hour = "0"+data.hour;
                };
                $.extend(data, {hour: hour});

                var infoBox = $('.cal-lunar-info');
                var typeToggleBtn = $('.cal-toggle');
                var old_calType = typeToggleBtn.find('> .active').data('caltype');
                infoBox.find('[data-caltype ='+old_calType+']').show();

                BAZI.Common.showCalendar('pop', btnDate, data, cb);

            });
        },

        showCalendar: function(parent, btnDate, data, cb){
            // console.log('showCalendar---------', parent, data);
            var self = this;

            if(data){
                var calHtml = $.tmpl($('#calendarPop-templates').html(), data);
                $('#viewport').append(calHtml);

                var calParent = $('.calendar-pop');
                var infoBox = calParent.find('.cal-lunar-info');
                var gzinfoBox = calParent.find('.lunar-ganzhi').find('.ganzhi-info');

                setTimeout(function(){
                    gzinfoBox.find('.year').parent('li').trigger(supportEvent);
                }, 150);
            }else{
                var calHtml = $.tmpl($('#calendar-templates').html());
                parent.html(calHtml);

                var calParent = $('.calender-wrap');
                var infoBox = calParent.find('.cal-lunar-info');
                var gzinfoBox = calParent.find('.lunar-ganzhi').find('.ganzhi-info');
            }
            var typeToggleBtn = calParent.find('.cal-toggle');
            var datePageBox = calParent.find('.datetimepicker');

            var dateData = {};
            $('#viewport').find('.overlay,.close-pop,.finish-pop').on(supportEvent, function(){
                $('#viewport').find('.overlay, .calendar-pop').remove();
                if(cb){
                    var isChanged = BAZI.Common.isObjectValueEqual(dateData, btnDate);
                    if(!isChanged){
                        cb(dateData);
                    }
                }
            });

            var refreshDate = function(data, etype){

                if( etype !== undefined ){
                    infoBox.find('.cur').removeClass('cur').end().find('[data-send='+etype+']').addClass('cur');
                    gzinfoBox.find('li').removeClass('cur').end().find('span.'+etype).parent('li').addClass('cur');
                }
                var hour = data.hour;
                if(data.hour < 10){
                    hour = "0"+data.hour;
                }

                $('.cal-lunar-info .year-bar  .cal span').html(data.year);
                $('.cal-lunar-info .mouth-bar .cal span').html(data.month);
                $('.cal-lunar-info .day-bar   .cal span').html(data.day);
                $('.cal-lunar-info .time-bar  .simple-hour').html( hour + ':00 '+data.GanZhiHour.slice(1)+'时').show().siblings().hide();
                $('.cal-lunar-info .time-bar  .detail-hour').html( hour + ':00:00 '+data.GanZhiHour.slice(1)+'时').show().siblings().hide();
                // 把详细替换一下

                $('.cal-lunar-info .year-bar  .lunar span').html(data.lunarYear);
                $('.cal-lunar-info .mouth-bar .lunar span').html(data.lunarMonthName);
                $('.cal-lunar-info .day-bar   .lunar span').html(data.lunarDayName);

                $('.ganzhi-info .year').html(data.GanZhiYear);
                $('.ganzhi-info .month').html(data.GanZhiMonth);
                $('.ganzhi-info .day').html(data.GanZhiDay);
                $('.ganzhi-info .hour').html(data.GanZhiHour);
                // console.log('refreshDate----------', data);
                dateData = {
                    year: data.year.toString(),
                    month: data.month.toString(),
                    day: data.day.toString(),
                    hour: data.hour
                };

            };

            // 年份选择添加事件
            gzinfoBox.find('.year').parent('li').unbind(supportEvent);
            gzinfoBox.find('.year').parent('li').on(supportEvent, function(){
                $(this).addClass('cur').siblings('li').removeClass('cur');
                calParent.find('.cal-lunar-info .year-bar').trigger(supportEvent);
            });

            gzinfoBox.find('.month').parent('li').unbind(supportEvent);
            gzinfoBox.find('.month').parent('li').on(supportEvent, function(){
                $(this).addClass('cur').siblings('li').removeClass('cur');
                calParent.find('.cal-lunar-info .mouth-bar').trigger(supportEvent);
            });

            gzinfoBox.find('.day').parent('li').unbind(supportEvent);
            gzinfoBox.find('.day').parent('li').on(supportEvent, function(){
                $(this).addClass('cur').siblings('li').removeClass('cur');
                calParent.find('.cal-lunar-info .day-bar').trigger(supportEvent);
            });

            gzinfoBox.find('.hour').parent('li').unbind(supportEvent);
            gzinfoBox.find('.hour').parent('li').on(supportEvent, function(){
                $(this).addClass('cur').siblings('li').removeClass('cur');
                calParent.find('.cal-lunar-info .time-bar').trigger(supportEvent);
            });

            /*直接切换年月日函数  goStauts('')  参数 year month day */
            if(!btnDate){
                var obj = {
                    birthsolar: "1980-01-01",
                    birthtime: "12:00:00"
                };
                var birthsolar = obj.birthsolar.split('-');
                var birthtime = obj.birthtime.split(':');

                btnDate = {
                    year: birthsolar[0],
                    month: BAZI.Common.formatStoN(birthsolar[1]),
                    day: BAZI.Common.formatStoN(birthsolar[2]),
                    hour: BAZI.Common.formatStoN(birthtime[0])
                };
            };

            var calendar = new Calendar({
                boxEl:'.datetimepicker',
                startYear:1900,
                long:200,
                defaultDate: btnDate,
                isLunarInput: false,
                chosenClass:'cur'
            },function(data){
                refreshDate(data);
                // self.time = data;
                self.time = {};
                $.extend(self.time,data);
            });

            this.calendar = calendar;

            // 引入滑动小时插件
            calendar.el.hours.css('padding-top','0.83rem');
            var oHourTab = $('<div class="condensed-hd"><dl class="condensed-hd-tab col-tab clearfix"><dd class="col-bnt on" data-type="simple">简易</dd><dd class="col-bnt"  data-type="detail">详细</dd></dl></div>');
            oHourTab.prependTo(calendar.$el);

            var oDetailHour = $('<div class="datetimepicker-swiper"><div class="time-wrapper-bg"><span>:</span><span>:</span></div><div class="detail-hour-box"></div></div>');
            //oDetailHour[0].style.cssText = "";
            oDetailHour.prependTo(calendar.$el);

            oHourTab.delegate('.col-bnt', supportEvent, function(e,calendar){
                $(this).addClass('on').siblings().removeClass('on');

                var type = $(this).data('type');

                if( type ==='detail'){
                    oDetailHour.show();
                    self.calendar.hidePannels();
                   /* if( 'detailHourSlider' in self ){
                        self.detailHourSlider.sliderToHour(self.time.hour);
                    }else{*/
                        self.detailHourSlider = null;
                        $('.detail-hour-box').empty();

                        self.detailHourSlider = new DetailHour({
                            oBox:'.detail-hour-box',
                            startTime: [self.time.hour, self.time.min, self.time.second],
                            onSlideChangeEnd:function(data){
                                // console.log(data.timeStr)
                                infoBox.find('.detail-hour').html(data.timeStr);
                                $.extend(self.time, data.timeData);

                                self.detailHour = data.timeData;
                                // refreshDate(self.calendar.result);
                            },
                            onHourChangeEnd: function(hour){

                                var GanZhiHour = utilities.getGanZhiHour(self.time.GanZhiDay.charAt(0), hour );
                                gzinfoBox.find('.hour').html(GanZhiHour);
                                self.calendar.result.hour = hour;
                                self.calendar.hourHiddenChosen(hour);
                            }
                        });


                    // }
                }else {
                    oDetailHour.hide();
                    self.calendar.showPannel('hour');
                    self.calendar.hourHiddenChosen(self.time.hour);

                }

                var calendar = self.calendar;
            });

            calendar.$el.on('dateChange',function(e,data){
                $.extend(self.time, data.result, {min:0,second:0})
                if( data.nextShow === 'hour' || data.curShow === 'hour' ){
                    oHourTab.show();
                    oHourTab.find('[data-type=simple]').addClass('on').siblings().removeClass('on');
                }else{
                    oHourTab.hide();
                }
                if( data.nextShow === 'hour')self.isDetailTime = false;

                refreshDate(data.result,data.nextShow);
            });

            // 阴阳历切换
            // window.calendar = calendar;
            var old_calType = typeToggleBtn.find('> .active').data('caltype');

            infoBox.find('[data-caltype ='+old_calType+']').show();

            typeToggleBtn.on(supportEvent, function(){
                var calType = $(this).find('> .active').removeClass('active').siblings().addClass('active').data('caltype');
                infoBox.find('[data-caltype ='+old_calType+']').hide();
                infoBox.find('[data-caltype ='+calType+']').show();

                calendar.toggleCalType();

                old_calType = calType;
            });

            var setScrollTop = function(etype){
                var radix = 5;
                var target = datePageBox.find('> [data-acpt='+ etype+']');
                var index = target.find('.cur').index();
                var elHeight = target.find('.date-cell').outerHeight();

                switch(etype){
                    case 'year': radix = 5; break;
                    case 'month': radix = 4; break;
                    case 'day': radix = 7; break;
                    case 'hour': radix = 6; break;
                    default: break;
                }
                var topY = parseInt(index/5)*elHeight;
                target.scrollTop(topY);
            };
            // 日期切换
            infoBox.delegate('.control-bar', supportEvent, function(){
                $(this).addClass('cur').siblings('.control-bar').removeClass('cur');
                var dateType = $(this).data('send');
                gzinfoBox.find('[data-send='+dateType+']').addClass('cur').siblings().removeClass('cur');


                if( dateType == 'hour'){
                    oHourTab.show();
                    if( self.time.min === 0 && self.time.second === 0){
                        oHourTab.find('[data-type=simple]').addClass('on').siblings().removeClass('on');
                        self.calendar.showPannel('hour');
                    }else{
                        oDetailHour.show();
                        oHourTab.find('[data-type=detail]').addClass('on').siblings().removeClass('on');
                        self.calendar.hidePannels();
                    }
                }else{
                    oDetailHour.hide();
                    oHourTab.hide();
                    self.calendar.showPannel(dateType);
                }

                setScrollTop(dateType);

                if($('#index')[0] && $('#index')[0].style.display !== 'none'){
                    var user_sex = $('#sex').val() == 0 ? '男' : '女';
                    var user_name = $('#name').val() ? $('#name').val() : '未命名';
                    $('.name-input-wrap').slideUp();
                    $('.header-wrap h2').html('<span style="font-weight: 300;">'+user_name +' '+ user_sex+'</span>');
                    $('.header-wrap h2').on(supportEvent, function(){
                        $('.name-input-wrap').slideDown();
                        $(this).html("快速起盘");
                    });
                }
            });

            setTimeout(function(){
                calParent.find('.datetimepicker, .dates-tb').css('max-height', clientHeight-530*scale);
                calParent.find('.condensed-bd').css('max-height', clientHeight-613*scale);
            }, 100);

        }
    };

    // 模板快捷方式，（顺便兼容新版 undescore模板）
    $.tmpl = function(html, data){
        if(data){
            return _.template(html)(data);
        } else {
            return _.template(html);
        }
    };

    BAZI.Views = {};

})(document, window);
