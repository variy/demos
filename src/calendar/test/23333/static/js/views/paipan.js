(function(win, BAZI){

    BAZI.Views.Paipan = Backbone.View.extend({

        id: 'paipan',
        className : 'paipan-page',



        events: {
            //'click #back-btn': 'switchBack'
        },

        initialize: function(data){
            this.recordChangeCB = data.onupdate;
            delete data.onupdate;
            this.options = data;
            var me = this;
            me.render(data.udid,data);
            me.init(data);

            me.$('.close-paipan').on('click', function(){
                me.remove();
            });

            if('udid' in data){
                // debugger;
                var view = new BAZI.Views.Discussion({udid: data.udid});
                view.$el.appendTo(this.dialogBodyEl)
            }
        },

        render: function(udid,data){
            var me = this;
            if(data.fromAccount){
                var mingpan = $.tmpl(BAZI.tpls.tpls_paipan);
                $('#account').find('.account-mingpan').append(mingpan);
            }else{
                var dialogObj = BAZI.Dialog.modal({
                    header:{
                        show:true,
                        txt: '命 盘'
                    },
                    footer:{
                        show:false
                    },
                    width:'auto',
                    body:BAZI.tpls.tpls_paipan,
                    size:'100%',
                    contentBodyPadding:0
                });
            
                this.$el = dialogObj.$el;
                this.dialogBodyEl = this.$el.find('.dialog-body');
            }


            var data = {
                udid : udid
            };


            if(!udid){//如果没有记录id
                return;
            }
            //事件
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
                $('#dorcd-btn').html('编辑');
            }
            if(data.fromFriend){
               $('#dorcd-btn').hide();
            }
            //console.log("paipan data:"+JSON.stringify(data));
            $('#dorcd-btn').off().on('click', function(){
                if (!BAZI.User.isLogin){
                    BAZI.router.login();
                }else{
                    if(data.fromRecord){
                        var opts = {};
                        opts.udid = data.udid;
                        opts.name = data.rName;
                        opts.sex = parseInt(data.iGender) === 0 ? '男':'女',
                        opts.sDate = data.sDate;
                        opts.sTime = data.sTime;
                        opts.mobile = data.mobile;
                        opts.relClassify = data.relClassify;
                        opts.from = 1;
                        opts.onupdate = me.recordChangeCB;
                        opts.updateDate=function(updata){
                            var newData = {
                                udid: updata.udid,
                                iGender: updata.igender,
                                rName: updata.rname,
                                sDate: updata.birthsolar,
                                sTime: updata.birthtime,
                                mobile: updata.umobile,
                                relClassify: updata.relation,
                                profClassify: updata.specialty,
                                fromRecord:true  
                            };
                            me.init($.extend(data,newData));
                        };
                        BAZI.router.record(opts);
                    }else{
                        var opts = {
                            from: 0,
                            name: data.rName,
                            solarDate: data.sDate.split('-').map(function(item){
                                return parseInt(item);
                            }),
                            timeDate: data.sTime.split(':'),
                            sex: parseInt(data.iGender) === 0?'男':'女'
                        };
                        
                        opts.updateDate=function(updata){
                            var data = {
                                udid: updata.udid,
                                iGender: updata.igender,
                                rName: updata.rname,
                                sDate: updata.birthsolar,
                                sTime: updata.birthtime,
                                mobile: updata.umobile,
                                relClassify: updata.relation,
                                profClassify: updata.specialty,
                                fromRecord:true
                            }
                            me.init(data);
                        };
                        BAZI.router.record(opts);
                    }
                }
            })

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
        },

        showEvents: function(parent){
            var me = this;
            var params = {
                mkey: BAZI.User.mkey,
                udid: BAZI.userData.udid
            };
            BAZI.Api.ievents.get(params, function(data){
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

                // 绑定删除按钮事件
                deleteEl.unbind('click');
                deleteEl.on('click', function(){
                    me.deleteEvents(id);
                });

                // 显示删除按钮
                var bindShow = function(){
                    $el.on('mousedown', function(){
                        var flag = false;
                        var stop;
                        stop = setTimeout(function() {
                            flag = true;
                            deleteEl.show();
                            $this.attr("colspan", 1);
                            bindHide();
                        }, 1000);
                        $el.on('mouseup', function() {
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
                        $el.unbind('click');
                        $el.on('click', function(){
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
                    $('.detail-event').find('[data-id ='+id+']').remove();
                }
            });
        },

        initEvent: function(){
            var me = this;

            // 顶部选项卡
            $(".tb-nav-wrap1 .tb-nav.clearfix li").unbind('click');
            $(".tb-nav-wrap1 .tb-nav.clearfix li").on('click', function(){
                $(this).addClass("cur").siblings().removeClass("cur");
                var index = $(this).index();
                $.each(BAZI.responseData, function(i, obj){
                    var item = "";
                    if(i == "sizhu"){
                        item = "#up-data .off .lunar-side";
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
            delete data.onupdate;
            BAZI.Api.paipan.getBase(data, function(d){
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
            //console.log('全部信息:', data, BAZI.userData);
            //---------------------------------------------------------
            this.showUserInfo(userData);
            this.showInfo(userData);
            this.showSiZhu(data.aSiZhu);
            this.initEvent();

            this.showDetails('dayun', BAZI.userData.goodLuckYears);
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

            var curTab = $(".tb-nav-wrap1 .tb-nav li.cur").index();
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
                var html = $.tmpl(BAZI.tpls.tpls_sizhu, data);
                $("#up-data").append(html);
            }

            // 干支隐藏右边span
            var parent = $("#up-data").find('.off');
            if(!siZhuData.length){
                parent.find('.lunar-side').hide();
            }else{
                parent.find('.lunar-side').show();
            }


            BAZI.responseData = $.extend(BAZI.responseData, {
                "sizhu": [siZhuGZ, siZhuSS, siZhuCG, siZhuWX]
            });
        },

        showDetails: function(type, data){
            // console.log(type,data);
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
            var curTab = $(".tb-nav-wrap1 .tb-nav li.cur").index();
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
                            yearNum: 10
                        };
                        if(BAZI.requestData.liunian && data.year == BAZI.requestData.liunian.year){
                            $("#liuyun").find('.liunian').slideDown();
                            return;
                        };
                        me.requestLiuNianData(data, function(d){
                            me.showDetails('liunian', d);
                        });
                        break;
                    case "liunian":
                        var data = {
                            year: ageyear[1][index],
                            dayTianGan: BAZI.dayTGNum
                        };
                        if(BAZI.requestData.liuyue && data.year == BAZI.requestData.liuyue.year){
                            $("#liuyun").find('.liuyue').slideDown();
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
                            dayTianGan: BAZI.dayTGNum
                        };
                        if(BAZI.requestData.liuday && data.solarDate == BAZI.requestData.liuday.solarDate){
                            $("#liuyun").find('.liuday').slideDown();
                            return;
                        };
                        me.requestLiuDaysData(data, function(d){
                            me.showDetails('liuday', d);
                        });
                        break;
                    case "liuday":
                        var data = {
                            currDayTianGan: ganzhi.nianTGNum[index],
                            dayTianGan: BAZI.dayTGNum
                        };
                        if(BAZI.requestData.liushi && data.currDayTianGan == BAZI.requestData.liushi.currDayTianGan){
                            $("#liuyun").find('.liushi').slideDown();
                            return;
                        };
                        //暂时不显示流时
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
                var html = $.tmpl(BAZI.tpls.tpls_liuyunItem, data);
                var typeIndex = $("#up-data").find('.'+type).index();
                if($("#up-data").find('.'+type).length){
                    $("#up-data").find('.'+type).remove();
                    $(html).insertBefore($("#up-data").find('td').eq(typeIndex));
                }else{
                    $("#up-data").prepend(html);
                }

                // 注册左上角 大运 区域事件
                $('#step-data').find('.'+type).unbind('click');
                $('#step-data').find('.'+type).on('click', function() {
                    $("#up-data").find('.'+type).trigger('click');
                });


                $("#up-data").find('.'+type).siblings('.tab').find(".tit").removeClass('cur-up');
                $("#up-data").find('.'+type).find(".tit").addClass('cur-up');
                // 注册左上角 大运 区域事件

                // 排盘删除选项
                $("#up-data").find('.'+type).unbind('click');
                $("#up-data").find('.'+type).on('click', function() {
                    $(this).hide();
                    var tabIndex = $(this).index();

                    for(var i = tabIndex; i >= 0; i--){
                        $("#up-data").find('.tab').eq(i).hide();
                        $('#liuyun .subdiv-ul').eq(i).find('.liuyun-item.cur').removeClass('cur');
                    }

                    var contIndex = $("#liuyun").find("."+type).index();

                    $("#liuyun").find('.subdiv').hide();
                    $("#liuyun").find('.subdiv').eq(contIndex).show();
                });
            };
            // change dom content
            var parent = $("#liuyun").find('.'+type);
            parent.show();
            parent.find("table").html('');
            for (var i = 0; i < length; i++) {
                var html = $.tmpl(BAZI.tpls.tpls_liuyun, gethtmlData(i));
                parent.find("table").append(html);
            };

            // 干支隐藏右边span
            if(!rgtData.length){
                parent.find('.lunar-side').hide();
            }else{
                parent.find('.lunar-side').show();
            }

            parent.find(".liuyun-item").unbind('click');
            parent.find(".liuyun-item").on('click', function(e) {
                $(this).parent('table').find('.cur').removeClass('cur');
                $(this).addClass('cur');

                var index = $(this).index();
                tabFunc(index);
                apiFunc(index);
            });

            // 初始化详细界面
            if(type == "dayun" && defIndex !== false){
                parent.find(".liuyun-item").eq(defIndex).addClass('on').removeClass('cur');

                $("#up-data").find('.dayun').hide();
            }
            if(type == "liunian" && defIndex !== false){
                setTimeout(function(){
                    $(".liunian").find(".liuyun-item").eq(defIndex).addClass('on');
                },100);
            }

            // 触发顶部选项卡事件
            $(".tb-nav-wrap1 .tb-nav li").each(function(){
                if($(this).hasClass('cur')){
                    $(this).trigger('click');
                }
            });

        },

        refreshDom: function(type){
            var me = this;
            if(type == "dayun"){
                $('#liuyun').find(".liunian").fadeIn(200);
            }else if(type == "liunian"){
                $('#liuyun').find(".liuyue").fadeIn(200);
            }else if(type == "liuyue"){
                $('#liuyun').find(".liuday").fadeIn(200);
            }else if(type == "liuday"){
                $('#liuyun').find(".liushi").fadeIn(200);
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

        // //流年里的age 和 year
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

                //obj.default IE8报错，JavaScript保留字
                if(obj['default'] == 1){
                    return x;
                }
            };
            return false;
        },

        updateDate:function(opts){
            //me.date=opts;
        }
    });
})(window, BAZI);
