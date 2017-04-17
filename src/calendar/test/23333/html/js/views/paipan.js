
var Paipan = Backbone.View.extend({

    id: 'paipan',

    events: {
        'click #back-btn': 'switchBack'
    },

    initialize: function(data){
        this.render();
        this.init(data);
    },

    render: function(){
        var el = $.tmpl($('#paipan-templates').html());
        this.$el.append(el);
        $('#viewport').append(this.$el);

        this.tipEl = $('.error-tips');
    },

    init: function(data){
        var me = this;
        $.extend(BAZI.userData, data);

        BAZI.requestData = {};
        BAZI.responseData = {};
        BAZI.sizhuTab = {
            "dayun": 0,
            "liunian": 0,
            "liuyue": 0,
            "liuday": 0
        };

        if(data.fromRecord){
            BAZI.Common.setBtn($('#dorcd-btn'), '编辑');
        }else{
            BAZI.Common.setBtn($('#dorcd-btn'), '存储');
        };

        if(!BAZI.userData.udid){
            BAZI.Common.setBtn($('#dorcd-btn'), '存储');
        }else{
            BAZI.Common.setBtn($('#dorcd-btn'), '编辑');
        }

        if(BAZI.fromEvents){
            $('.detail-tabMenu').find('.detail-tabMenu-item').eq(2).trigger(supportEvent);
        }else{
            $('.detail-tabMenu').find('.detail-tabMenu-item').eq(0).trigger(supportEvent);
        }

        if(data.sDate){
            this.requestPaiPanData(data);
        }else{
            this.requestPaiPanData({
                sDate: BAZI.userData.sDate,
                sTime: BAZI.userData.sTime,
                iGender: BAZI.userData.iGender,
                rName: BAZI.userData.rName
            });
        }

        // 详情页内容区域适配 start
        var detail_height = clientHeight - 238*scale;
        $('.user-data').height(detail_height*0.5 + 'px');
        $('.user-data table').height((detail_height*0.5-50*scale) + 'px');
        $('.detail-info, .detail-liuyun').height(detail_height*0.5 + 'px');
        $('.detail-tb-bd,.detail-tb-bd .tb-bd-item').height((detail_height*0.5-80*scale) + 'px');
        // 详情页内容区域适配 end
    },

    showTips: function(){
        BAZI.Common.showTips('敬请期待~');
    },

    switchBack: function(){
        $("#up-data").html('');
        $("#step-data ul").html('');

        if(BAZI.userData.fromRecord){
            BAZI.router.record();
        }else{
            BAZI.router.index();
        }
    },

    showEvents: function(parent){
        var me = this;
        var params = {
            mkey: User.mkey,
            udid: BAZI.userData.udid
        };
        BAZI.Api.ievents.get(params, function(data){
            // console.log('ievents----------get', data);
            if(!data.list.length){ return; }
            var listArr = [];
            $.each(data.list, function(i, item){
                var label = item[4] ? '['+item[4]+']' : '';
                var data = {};
                data = {
                    id: item[0],
                    date: item[1],
                    time: item[2],
                    ganzhi: BAZI.lang.tianGan[item[5]] + BAZI.lang.diZhi[item[6]],
                    year: item[1].split('-')[0],
                    label: label,
                    desc: item[3]
                };
                listArr.push(data);
            })
            var html = $.tmpl($('#eventsList-templates').html(), listArr);
            parent.html(html);
            me.bindEvents();
        });
    },

    bindEvents: function(id){
        var me = this;
        $('.detail-event').find('.tenth-9').each(function(){
            var $this = $(this);
            var $el = $this.parent();
            var deleteEl = $el.find('.tenth-2');
            var id = $this.data('id');
            // console.log('bindEvents------------', id, $support.isMobile);

            // 绑定删除按钮事件
            deleteEl.unbind(supportEvent);
            deleteEl.on(supportEvent, function(){
                me.deleteEvents(id);
            });

            // 显示删除按钮
            var startEvent = $support.Touch ? 'touchstart' : 'mousedown';
            var endEvent = $support.Touch ? 'touchend' : 'mouseup';

            var bindShow = function(){
                $el.on(startEvent, function(){
                    var flag = false;
                    var stop;
                    stop = setTimeout(function() {
                        flag = true;
                        deleteEl.show();
                        $this.attr("colspan", 1);
                        bindHide();
                    }, 1000);
                    $el.on(endEvent, function() {
                        if (!flag) {
                            clearTimeout(stop);
                        }
                    });
                });
            };

            // 隐藏删除按钮
            var bindHide = function(){
                $el.unbind();
                setTimeout(function(){
                    $el.unbind(supportEvent);
                    $el.on(supportEvent, function(){
                        deleteEl.hide();
                        $this.attr("colspan", 2);
                        bindShow();
                    });
                }, 1000);
            };

            bindShow();
        });

    },

    deleteEvents: function(id){
        var params = {evid: id};
        BAZI.Api.ievents.del(params, function(data){
            if(data.ret === 0){
                console.log('ievents----------del', data);
                $('.detail-event').find('[data-id ='+id+']').remove();
            }
        });
    },

    initEvent: function(){
        var me = this;

        // 底部选项卡
        $('.detail-tabMenu').find('.detail-tabMenu-item').unbind(supportEvent);
        $('.detail-tabMenu').find('.detail-tabMenu-item').on(supportEvent, function(){
            var index = $(this).index();

            if(index == 1){
                me.showDetails('dayun', BAZI.userData.goodLuckYears);
            }

            if(index == 2 && !BAZI.userData.udid){
                if(!User.isLogin){
                    BAZI.Common.showTips('请先登录并存储记录，再添加事件', function(){
                        BAZI.router.login('pinfo', {newInfo: true, fromEvents: true});
                    });
                }else{
                    BAZI.Common.showTips('请先存储记录，再添加事件', function(){
                        BAZI.router.pinfo({newInfo: true});
                    });
                }
                return;
            }

            $(this).addClass('cur').siblings().removeClass('cur');
            $('.detail-tabContent').eq(index).show().siblings().hide();
            $('#user-info,#step-data').show();
            $('.user-data').removeClass('event-user-data');
            if(index == 2){
                BAZI.fromEvents = true;
                BAZI.Common.setBtn($('#dorcd-btn'), '添加');
                me.showEvents($('.detail-tabContent').eq(index));
                $('#user-info,#step-data').hide();
                $('.user-data').addClass('event-user-data');
                $('.detail-event').height(clientHeight - 344*scale);
            }else{
                BAZI.fromEvents = false;
            };
        });

        // 资料内部选项卡
        $('.detail-tb-hd .tb-hd-item').unbind(supportEvent);
        $('.detail-tb-hd .tb-hd-item').on(supportEvent, function(){
            $(this).addClass('cur').siblings().removeClass('cur');
            var index = $(this).index();
            $('.detail-tb-bd').find('.tb-bd-item').eq(index).show().siblings().hide();
        });

        // 顶部选项卡
        $(".header-wrap .tb-nav.clearfix li").unbind(supportEvent);
        $(".header-wrap .tb-nav.clearfix li").on(supportEvent, function() {
            $(this).addClass("cur").siblings().removeClass("cur");
            var index = $(this).index();
            $.each(BAZI.responseData, function(i, obj){
                // console.log('BAZI.responseData-----------each', i, obj);
                var item = "";
                if(i == "sizhu"){
                    item = "#up-data .col-6.off .lunar-side";
                }else{
                    item = "#liuyun ."+i+" .subdiv-ul .liuyun-item .lunar-side";
                }
                me.changeRight(obj[index].length, item, obj[index]);
            });

            var tabType = index === 0 ? "ganzhi" : "";
            setTimeout(function(){
                me.changeTabRight(tabType);
            }, 100);
        });

    },

    changeRight: function (length, tabMenu, data) {
        if(!length){
            var l = $(tabMenu).length;
            for (var x = 0; x < l; x++) {
                $(tabMenu).eq(x).html('').hide();
            }
            return;
        };
        for (var i = 0; i < length; i++) {
            var html = '<sup>' + data[i][0] + '</sup><sub>' + data[i][1] + '</sub>';
            // 暂时先隐藏掉详细页面列表的右下角数据
            if(tabMenu.indexOf("#liuyun") !== -1){
                $(tabMenu).eq(i).html(html).hide();
            }else{
                $(tabMenu).eq(i).html(html).show();
            }
        };
    },

    requestPaiPanData: function(data){
        var me = this;
        BAZI.Api.paipan.getBase(data, function(d){
            console.log('requestPaiPanData------------', d);
            d.rName = data.rName;
            me.paipan(d);
        });
    },

    requestLiuNianData: function(data, success){
        BAZI.requestData = $.extend(BAZI.requestData, { "liunian": data });
        BAZI.Api.paipan.getLiuYear(data, function(d){
            success(d);
        });
    },

    requestJieQiData: function(data, success){
        BAZI.requestData = $.extend(BAZI.requestData, { "liuyue": data });
        BAZI.Api.paipan.getJie(data, function(d){
            success(d);
        });
    },

    requestLiuDaysData: function(data, success){
        BAZI.requestData = $.extend(BAZI.requestData, { "liuday": data });
        BAZI.Api.paipan.getLiuDays(data, function(d){
            success(d);
        });
    },

    requestLiuHoursData: function(data, success){
        BAZI.requestData = $.extend(BAZI.requestData, { "liushi": data });
        BAZI.Api.paipan.getLiuHours(data, function(d){
            success(d);
        });
    },

    paipan: function(data) {
        var userData = {
            rName: data.rName,
            aBirthday: data.aBirthday,          //生辰
            iGender: data.iGender,              //性别
            shengXiao: data.shengXiao,          //生肖
            solarOrLunar: data.solarOrLunar,    //阴或阳
            vage: data.vage,                    //虚岁
            aStartLuck: data.aStartLuck,        //起运时间
            startLuckAge: data.startLuckAge,    //起运岁数
            startLuckYear: data.startLuckYear,  //起运年份
            goodLuckYears: data.goodLuckYears,  //排大运
            intersectLuck: data.intersectLuck   //交大运详细
        };

        $.extend(BAZI.userData, data);
        console.log('全部信息:', data, BAZI.userData);
        //---------------------------------------------------------
        this.showUserInfo(userData);
        this.showInfo(userData);

        this.showSiZhu(data.aSiZhu);
        this.showNB(data.aSiZhu);

        this.initEvent();
    },

    showUserInfo: function(data){
        var name = data.rName ? data.rName : "未命名";
        $('#user-info').find('.name').html(name);
        $('#user-info').find('.gender').html(BAZI.lang.gender[data.iGender]);
        $('#user-info').find('.time').html(data.aBirthday.solar);
    },

    //个人信息
    showInfo: function(data) {
        var info = data.rName+ ' ' +BAZI.lang.solarOrLunar[data.solarOrLunar] + BAZI.lang.gender[data.iGender]  + " 属" + BAZI.lang.shengXiao[data.shengXiao] + " 虚岁" + data.vage;
        var time = BAZI.Common.setBirthday(data.aBirthday, 'solar') + '</br>' + BAZI.Common.setBirthday(data.aBirthday, 'lunar');
        var luck = BAZI.Common.setLuck(data.aStartLuck);
        var luckGanZhiYear = BAZI.lang.tianGan[data.intersectLuck.firstTg] + BAZI.lang.tianGan[data.intersectLuck.secondTg];
        var lunarLuckStr = '逢'+luckGanZhiYear+'年 '+BAZI.lang.jieqi[data.intersectLuck.jieVal].name +'后 '+ data.intersectLuck.days+'天'+ data.intersectLuck.hours+'小时'+ data.intersectLuck.min+'分交大运';

        $(".text-list-tb").find('.info').html(info);
        $(".text-list-tb").find('.time').html(time);
        $(".text-list-tb").find('.luck').html(luck);
        $(".text-list-tb").find('.intersect').html(lunarLuckStr);
    },

    //四柱
    showSiZhu: function(aSiZhu) {
        var me = this;
        var siZhu = [aSiZhu.yearZhu, aSiZhu.monthZhu, aSiZhu.dayZhu, aSiZhu.hourZhu];
        var siZhuGZ = this.getGanZhi(siZhu);
        var siZhuSS = this.getShiShen(siZhu);
        var siZhuWX = this.getWuXing(siZhu);
        var siZhuCG = this.getCangGan(siZhu);
        var siZhuTitle = new Array("年", "月", "日", "时");
        var siZhuData = [];
        BAZI.dayTGNum = siZhuGZ.dayTGNum;

        var curTab = $(".header-wrap .tb-nav.clearfix li.cur").index();
        if (curTab == 1) {
            siZhuData = siZhuSS;
        } else if (curTab == 2) {
            siZhuData = siZhuCG;
        } else if (curTab == 3) {
            siZhuData = siZhuWX;
        };

        $("#up-data").html('');
        for (var i = 0; i < 4; i++) {
            var data = {
                bigspan: siZhuTitle[i],
                ganzhi: siZhuGZ.data[i],
                tiangan: siZhuData.length ? siZhuData[i][0] : '',
                dizhi: siZhuData.length ? siZhuData[i][0] : ''
            }
            var html = $.tmpl($('#sizhu-templates').html(), data);
            $("#up-data").append(html);
        }

        // 干支隐藏右边span
        var parent = $("#up-data").find('.col-6.off');
        if(!siZhuData.length){
            parent.find('.lunar-side').hide();
        }else{
            parent.find('.lunar-side').show();
        }


        BAZI.responseData = $.extend(BAZI.responseData, {
            "sizhu": [siZhuGZ, siZhuSS, siZhuCG, siZhuWX]
        });

    },

    //年表
    showNB: function (aSiZhu) {
        var me = this;
        var siZhu = [aSiZhu.yearZhu, aSiZhu.monthZhu, aSiZhu.dayZhu, aSiZhu.hourZhu];
        var siZhuGZ = this.getGanZhi(siZhu);
        var data = {
            year: parseInt(BAZI.userData.sDate.split('-')[0]),
            yearTianGan: siZhuGZ.nianTGNum[0] ,
            yearDiZhi: siZhuGZ.nianDZNum[0] ,
            dayTianGan: BAZI.dayTGNum ,
            age: 0,
            yearNum: 100 // 100年数据
        }
        me.requestLiuNianData(data, function(d){
            var NB = me.getGanZhi(d);
            var NBAge = me.getAgeYear(d);
            // console.log('requestLiuNianData', d, NB, NBAge);
            $("#nianbiao .grid").empty();
            for (var i in d) {
                var html = '<li class="col-10"><p class="solar">'+NBAge[0][i]+'</p><p class="lunar">'+NB.data[i]+'</p></li>';
                $("#nianbiao .grid").append(html)
            }
        });
    },

    showDetails: function(type, data){
        console.log(type,data);
        var me = this;
        var orgData = data;
        var rgtData = [];
        var length = data.length;
        var jieqi = this.getJieQi(data);
        var ganzhi = this.getGanZhi(data);
        var shishen = this.getShiShen(data);
        var wuxing = this.getWuXing(data);
        var canggan = this.getCangGan(data);
        var ageyear = this.getAgeYear(data);
        var defIndex = this.getDefault(data);

        //判断当前tab在哪里  1藏干 2.五行 0十神
        var curTab = $(".header-wrap .tb-nav.clearfix li.cur").index();
        if (curTab == 1) {
            rgtData = shishen;
        } else if (curTab == 2) {
            rgtData = canggan;
        } else if (curTab == 3) {
            rgtData = wuxing;
        }

        // console.log('showDetails---------', type, data);

        var gethtmlData = function(i){
            var data = {};
            switch(type){
                case "dayun":
                    BAZI.responseData = $.extend(BAZI.responseData, {
                        "dayun": [ganzhi, shishen, canggan, wuxing]
                    });
                    data = {
                        bigspan: ageyear[0][i],
                        span: ageyear[1][i]
                    }; break;
                case "liunian":
                    BAZI.responseData = $.extend(BAZI.responseData, {
                        "liunian": [ganzhi, shishen, canggan, wuxing]
                    });
                    data = {
                        bigspan: ageyear[0][i],
                        span: ageyear[1][i]
                    }; break;
                case "liuyue":
                    BAZI.responseData = $.extend(BAZI.responseData, {
                        "liuyue": [ganzhi, shishen, canggan, wuxing]
                    });
                    data = {
                        bigspan: jieqi.jieVal[i].name,
                        span: jieqi.solarDate[i]
                    }; break;
                case "liuday":
                    BAZI.responseData = $.extend(BAZI.responseData, {
                        "liuday": [ganzhi, shishen, canggan, wuxing]
                    });
                    data = {
                        bigspan: '',
                        span: orgData[i].solarDate
                    }; break;
                case "liushi":
                    BAZI.responseData = $.extend(BAZI.responseData, {
                        "liushi": [ganzhi, shishen, canggan, wuxing]
                    });
                    data = {
                        bigspan: '',
                        span: orgData[i].hour
                    }; break;
                default: break;
            }
            $.extend(data, {
                ganzhi: ganzhi.data[i],
                tiangan: rgtData.length ? rgtData[i][0] : '',
                dizhi: rgtData.length ? rgtData[i][1] : ''
            });
            return data;
        };

        //点击大运内容  请求接口函数
        var apiFunc = function(index){
            switch(type){
                case "dayun":
                    var data = {
                        age: ageyear[0][index],
                        year: ageyear[1][index],
                        yearTianGan: ganzhi.nianTGNum[index],
                        yearDiZhi: ganzhi.nianDZNum[index],
                        dayTianGan: BAZI.dayTGNum,
                        yearNum: 10,
                    };
                    if(BAZI.requestData.liunian && data.year == BAZI.requestData.liunian.year){
                        $("#liuyun").find('.liunian').show();
                        return;
                    };
                    me.requestLiuNianData(data, function(d){
                        me.showDetails('liunian', d);
                    });
                    break;
                case "liunian":
                    var data = {
                        year: ageyear[1][index],
                        dayTianGan: BAZI.dayTGNum,
                    };
                    if(BAZI.requestData.liuyue && data.year == BAZI.requestData.liuyue.year){
                        $("#liuyun").find('.liuyue').show();
                        return;
                    };
                    me.requestJieQiData(data, function(d){
                        me.showDetails('liuyue', d);
                    });
                    break;
                case "liuyue":
                    var data = {
                        solarDate: orgData[index].solarAll,
                        jieVal: orgData[index].jieVal,
                        dayTianGan: BAZI.dayTGNum,
                    };
                    if(BAZI.requestData.liuday && data.solarDate == BAZI.requestData.liuday.solarDate){
                        $("#liuyun").find('.liuday').show();
                        return;
                    };
                    me.requestLiuDaysData(data, function(d){
                        me.showDetails('liuday', d);
                    });
                    break;
                case "liuday":
                    var data = {
                        currDayTianGan: ganzhi.nianTGNum[index],
                        dayTianGan: BAZI.dayTGNum,
                    };
                    if(BAZI.requestData.liushi && data.currDayTianGan == BAZI.requestData.liushi.currDayTianGan){
                        $("#liuyun").find('.liushi').show();
                        return;
                    };
                    me.requestLiuHoursData(data, function(d){
                        me.showDetails('liushi', d);
                    });
                    break;
                default: break;
            };
        };

        var tabFunc = function(index){

            me.refreshDom(type);
            // 不显示流时的tab
            if(type == "liushi"){
                return;
            }else{
                BAZI.sizhuTab[type] = index;
            };

            var title = "";
            var tableClass = "";
            switch(type){
                case "dayun": title = "大运"; tableClass="table5"; break;
                case "liunian": title = "流年"; tableClass="table6"; break;
                case "liuyue": title = "流月"; tableClass="table7"; break;
                case "liuday": title = "流日"; tableClass="table8"; break;
                default: break;
            }
            var table = $('#up-data').parent().parent('table');
            table.removeClass().addClass(tableClass);
            var checkTab = function(){
                var length = 0;
                $("#up-data").find('.tab').each(function(){
                    if($(this)[0].style.display != "none"){
                        length++;
                    };
                });
                return length;
            };

            // tab menu
            var clickedTab = $('#liuyun').find('.'+type).find('.subdiv-ul').find('.liuyun-item').eq(index);
            var data = {
                type: type,
                titspan: title,
                bigspan: clickedTab.find('.solar').eq(0).html(),
                span: clickedTab.find('.solar').eq(1).html(),
                ganzhi: clickedTab.find('.lunar').html(),
                tiangan: clickedTab.find('.lunar-side').find('sup').html(),
                dizhi: clickedTab.find('.lunar-side').find('sub').html()
            };
            var html = $.tmpl($('#tab-templates').html(), data);
            var typeIndex = $("#up-data").find('.'+type).index();
            if($("#up-data").find('.'+type).length){
                $("#up-data").find('.'+type).remove();
                $(html).insertBefore($("#up-data").find('td').eq(typeIndex));
            }else{
                $("#up-data").prepend(html);
            }

            // step menu
            var sData = {
                type: type,
                titspan: title,
                ganzhi: clickedTab.find('.lunar').html(),
            };
            var sHtml = $.tmpl($('#step-templates').html(), sData);
            var sIndex = $("#step-data").find('.'+type).index();

            if($('#step-data').find('.'+type).length){
                var stepIndex = $('#step-data').find('.'+type).index();
                $('#step-data').find('.'+type).remove();
                if(stepIndex == 0){
                    $('#step-data ul').prepend(sHtml);
                }else{
                    $(sHtml).insertAfter($('#step-data').find('li').eq(stepIndex-1));
                }
            }else{
                $('#step-data ul').append(sHtml);
            }

            // 注册左上角 大运 区域事件
            $('#step-data').find('.'+type).unbind(supportEvent);
            $('#step-data').find('.'+type).on(supportEvent, function() {
                $("#up-data").find('.'+type).trigger(supportEvent);
            });


            $("#up-data").find('.'+type).siblings('.tab').find(".tit").removeClass('cur-up');
            $("#up-data").find('.'+type).find(".tit").addClass('cur-up');
            // 注册左上角 大运 区域事件

            $("#up-data").find('.'+type).unbind(supportEvent);
            $("#up-data").find('.'+type).on(supportEvent, function() {

                $(this).hide();
                var tabIndex = $(this).index();

                $("#up-data").find('.tab').eq(tabIndex+1).siblings('.tab').find(".tit").removeClass('cur-up');
                $("#up-data").find('.tab').eq(tabIndex+1).find(".tit").addClass('cur-up');

                for(var i = tabIndex; i >= 0; i--){
                    $("#up-data").find('.tab').eq(i).hide();
                    $('#liuyun .subdiv-ul').eq(i).find('.liuyun-item.cur').removeClass('cur');
                }

                var contIndex = $("#liuyun").find("."+type).index();

                var stepLength =  $("#step-data").find('li').length;
                for(var i = contIndex; i <= stepLength; i++){
                    $("#step-data").find('li').eq(i).hide();
                }

                $("#liuyun").find('.subdiv').hide();
                if(contIndex >= 2){
                    $("#liuyun").find('.subdiv').eq(contIndex-1).slideDown();
                    $("#liuyun").find('.subdiv').eq(contIndex-2).slideDown();
                }else{
                    $("#liuyun").find('.subdiv').eq(0).show();
                    $("#liuyun").find('.subdiv').eq(1).show();
                }

                var length = checkTab();
                    length += 4;
                var className = "table"+length;
                table.removeClass().addClass(className);

            });
        };

        // change dom content
        var parent = $("#liuyun").find('.'+type);
        parent.show();
        parent.find("table").html('');
        for (var i = 0; i < length; i++) {
            var html = $.tmpl($('#detail-templates').html(), gethtmlData(i));
            parent.find("table").append(html);
        };

        // 干支隐藏右边span
        if(!rgtData.length){
            parent.find('.lunar-side').hide();
        }else{
            parent.find('.lunar-side').show();
        }

        parent.find(".liuyun-item").unbind(supportEvent);
        parent.find(".liuyun-item").on(supportEvent, function(e) {
            $(this).parent('table').find('.cur').removeClass('cur');
            $(this).addClass('cur');

            var index = $(this).index();
            tabFunc(index);
            apiFunc(index);
        });

        // 初始化详细界面
        if(type == "dayun" && defIndex !== false){
            parent.find(".liuyun-item").eq(defIndex).trigger(supportEvent).addClass('on').removeClass('cur');

            $("#up-data").find('.dayun').hide();
            $('#up-data').parent().parent('table').removeClass().addClass('table4');
            $("#step-data").find('.dayun').hide();
        }
        if(type == "liunian" && defIndex !== false){
            setTimeout(function(){
                $(".liunian").find(".liuyun-item").eq(defIndex).addClass('on');
            },100);
        }

        // 触发顶部选项卡事件
        $(".header-wrap .tb-nav.clearfix li").each(function(){
            if($(this).hasClass('cur')){
                $(this).trigger(supportEvent);
            }
        });

    },

    refreshDom: function(type){
        if(type == "liunian"){
            $("#up-data").find('.dayun').show();
            $("#step-data").find('.dayun').show();
            $('#liuyun').find(".dayun").slideUp();
        }else if(type == "liuyue"){
            $('#liuyun').find(".liunian").slideUp();
        }else if(type == "liuday"){
            $('#liuyun').find(".liuyue").slideUp();
        }
    },

    changeTabRight: function(tabType){
        // console.log("changeTabRight---------", tabType, BAZI.sizhuTab);

        var sizhuHtml = $('#up-data').find('.tab');
        $.each(sizhuHtml, function(i, item){

            var type = $(item)[0].className;
                type = type.split("tab ")[1];
            var index = BAZI.sizhuTab[type];
            var clickedTab = $('#liuyun').find('.'+type).find('.subdiv-ul').find('.liuyun-item').eq(index);
            var curTab = $("#up-data").find('.'+type);

            var title = "";
            switch(type){
                case "dayun": title = "大运"; break;
                case "liunian": title = "流年"; break;
                case "liuyue": title = "流月"; break;
                case "liuday": title = "流日"; break;
                default: break;
            };

            var data = {
                titspan: title,
                bigspan: clickedTab.find('.solar').eq(0).html(),
                span: clickedTab.find('.solar').eq(1).html(),
                ganzhi: clickedTab.find('.lunar').html(),
                tiangan: clickedTab.find('.lunar-side').find('sup').html(),
                dizhi: clickedTab.find('.lunar-side').find('sub').html()
            };

            if(curTab.length){
                curTab.find('.solar .tit').html(data.titspan);
                curTab.find('.solar .big').html(data.bigspan);
                curTab.find('.solar').find('span').eq(2).html(data.span);
                curTab.find('.lunar').html(data.ganzhi);
                curTab.find('.lunar-side').find('sup').html(data.tiangan);
                curTab.find('.lunar-side').find('sub').html(data.dizhi);
            };

            if(tabType == "ganzhi"){
               curTab.find('.lunar-side').find('sup, sub').html('');
            }

        });


    },

    //-----------------数据获取--------------------
    getGanZhi: function(oData) {

        //--------------------------天干地支对应表------------------------------
        var length = oData.length;
        var ganZhi = {};
        ganZhi.data = [];
        ganZhi.nianTGNum = [];
        ganZhi.nianDZNum = [];
        for (var x = 0; x < length; x++) {
            var obj = oData[x];
            var d = BAZI.lang.tianGan[obj.tianGanAttr.attrVal] + BAZI.lang.diZhi[obj.diZhiAttr.attrVal];
            ganZhi.nianTGNum.push(obj.tianGanAttr.attrVal);
            ganZhi.nianDZNum.push(obj.diZhiAttr.attrVal);
            ganZhi.data.push(d);
        }

        ganZhi.dayTGNum = oData[2].tianGanAttr.attrVal;

        // console.log('getGanZhi->', oData);
        return ganZhi;
    },

    getShiShen: function(oData) {
        //天干十神，地支十神
        var length = oData.length;
        var data = [];
        for (var x = 0; x < length; x++) {
            var obj = oData[x];
            var tianGanSS = obj.tianGanAttr.shiShen;
            var diZhiSS = obj.diZhiAttr.shiShen;
            var d = [];
            var tgData = '';
            var dzData = '';
            for (var y = 0; y < tianGanSS.length; y++) {
                if (tianGanSS[y]) {
                    tgData += BAZI.lang.shiShen[tianGanSS[y]][1];
                }
            }
            for (var z = 0; z < diZhiSS.length; z++) {
                if (diZhiSS[z]) {
                    dzData += BAZI.lang.shiShen[diZhiSS[z]][1];
                }
            }
            d.push(tgData, dzData);
            data.push(d);
        }
        // console.log('getShiShen---------', data);
        return data;
    },

    getWuXing: function(oData) {
        //天干五行，地支五行
        var length = oData.length;
        var data = [];
        for (var x = 0; x < length; x++) {
            var obj = oData[x];

            var tianGanWX = obj.tianGanAttr.wuXing;

            var diZhiWX = obj.diZhiAttr.wuXing;
            // console.log('tianGanWX===', tianGanWX)
            var d = [];
            var tgData = '';
            var dzData = '';

            tgData = BAZI.lang.wuXing[tianGanWX[0]];
            // console.log('tgData===', tgData)

            dzData = BAZI.lang.wuXing[diZhiWX[0]];


            d.push(tgData, dzData);
            data.push(d);
        }
        // console.log('getShiShen---------', data);
        return data;

    },

    getCangGan: function(oData) {
        //只有地支里面才有藏干
        // var yearZhuD = aSiZhu.yearZhu.diZhiAttr.cangGan;
        // var monthZhuD = aSiZhu.monthZhu.diZhiAttr.cangGan;
        // var dayZhuD = aSiZhu.dayZhu.diZhiAttr.cangGan;
        // var hourZhuD = aSiZhu.hourZhu.diZhiAttr.cangGan;
        var length = oData.length;
        var data = [];
        for (var x = 0; x < length; x++) {
            var obj = oData[x];
            // var tianGanCG = obj.tianGanAttr.wuXing;
            var diZhiCG = obj.diZhiAttr.cangGan;
            var d = [];
            var tgData = '';
            var dzData = '';
            for (var y = 0; y < diZhiCG.length; y++) {
                tgData += ' ';
            }
            for (var z = 0; z < diZhiCG.length; z++) {
                if (diZhiCG[z]) {
                    dzData += BAZI.lang.tianGan[diZhiCG[z]];
                }
            }
            d.push(tgData, dzData);
            data.push(d);
        }
        // console.log('getShiShen---------', data);
        return data;
    },

    //流年里的age 和 year
    getAgeYear: function(oData) {
        var data = [];
        var age = [];
        var year = [];
        for (var i in oData) {
            age.push(oData[i].age);
            year.push(oData[i].year);
        }
        data.push(age, year);
        return data;
    },
    getJieQi: function(oData) {
        var data = {};
        data.jieVal = [];
        data.solarDate = [];
        for (var i in oData) {
            data.jieVal.push(BAZI.lang.jieqi[oData[i].jieVal]);
            data.solarDate.push(oData[i].solarDate);
        }
        return data;
    },
    getDefault: function(oData){
        var length = oData.length;
        for (var x = 0; x < length; x++) {
            var obj = oData[x];
            if(obj.default == 1){
                return x;
            }
        };
        return false;
    },
});
