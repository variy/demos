
// 个人资料页面
var PersonInfo = Backbone.View.extend({

    id: 'pinfo',

    events: {
        'click #fast-btn': 'showIndex',
        'click #editgender-btn': 'editGender',
        'click #editname-btn': 'editName',
        'click #editarea-btn': 'editArea',
        'click #check-paipan': 'showPaipan',
        'click a.Record': 'showRecord',
        'click .Me': 'showMe',
        'click .Class, .Test': 'showTips'
    },

    initialize: function(data){

        this.render(data);

        // 个人资料页面适配
        $('.userinfo-wrap').height((clientHeight - 200*clientWidth/640) + 'px');
        // 个人资料页面适配 end
    },

    render: function(data){
        var me = this;
        this.data = data;
        var html = $.tmpl($('#personInfo-templates').html());
        this.$el.append(html);
        $('#viewport').children().remove().end().html(this.$el);

        $('#editName-sect').hide();
        $('#editGender-sect').hide();
        $('#editArea-sect').hide();

        if(this.data.newInfo || !BAZI.userData.udid){
            BAZI.Common.setBtn($('#storage-btn'), '存储', function(){
                if(!BAZI.userData.rName || !BAZI.userData.province){
                    BAZI.Common.showTips('请填完整信息');
                    return;
                }
                if(me.data.newInfo){
                    me.doRecord();
                }else{
                    me.showMe();
                }
            });
        }

        this.init();
        this.initInfo();
    },

    init: function(){
        var me = this;
        this.tipEl = this.$el.find('.header .error-tips');

        // 新排盘
        if(!BAZI.userData.udid){
            $.extend(BAZI.userData, {
                province: '',
                city: ''
            });
        }

        var name = BAZI.userData.sDate ? BAZI.userData.rName : User.rname;
        this.nameInput = $('#edit-name-input');
        this.nameInput.val(name);

        this.$el.find('.a-left').unbind(supportEvent);
        this.$el.find('.a-left').on(supportEvent, function(){
            me.showPaipan();
        });

        BAZI.Common.showCalendarBtn($('#info-calendar'), function(data){
            me.editTime(data);
        });
    },

    initInfo: function(){

        if(BAZI.userData.udid && BAZI.userData.udid == User.udid){
            this.$el.find('h2').html('个人资料');
        }else{
            this.$el.find('h2').html('编辑资料');
        }

        var name = BAZI.userData.rName;
        var igender = BAZI.userData.iGender == 0 ? "男" : "女";
        var area = BAZI.userData.province + ' ' + BAZI.userData.city;
        if(!BAZI.userData.sDate){
            name = User.rname;
            igender = User.igender == 0 ? "男" : "女";
            area = User.province + ' ' + User.city;
        }
        $('#user-name').html(name);
        $('#user-gender').html(igender);
        $('#user-area').html(area);

        var lunar = BAZI.Common.setBirthday(BAZI.userData.aBirthday, 'lunar');
        if( 'aStartLuck' in BAZI.userData){
            var luck = BAZI.Common.setLuck(BAZI.userData.aStartLuck);
        }

        $('#user-lunar').html(lunar);
        $('#user-luck').html(luck);
    },

    showRecord: function(){
        BAZI.router.record();
    },

    showMe: function(){

        if(!BAZI.router.isLogin()){
            return;
        }
        if(!User.isComplete){
            BAZI.router.navigate('#!/pinfo', true);
            return;
        }

        BAZI.Common.showMyInfo();
    },

    showTips: function(){
        BAZI.Common.showTips('敬请期待~');
    },

    showPaipan: function(){
        BAZI.router.paipan(BAZI.userData);
    },

    showIndex: function(){
        BAZI.router.index();
    },

    doRecord: function(){
        var me = this;
        BAZI.Api.iudatas.add(
            {
                rname: BAZI.userData.rName,
                iGender: BAZI.userData.iGender,
                birthsolar: BAZI.userData.sDate,
                birthtime: BAZI.userData.sTime
            },

            function(d){
                BAZI.Common.showTips('保存成功！');
                console.log('doRecord ->', d, BAZI.userData);

                $.extend(BAZI.userData, d.aUinfo);
                $.extend(BAZI.userData, {
                    fromRecord: true
                });
                if(me.data.fromEvents){
                    BAZI.router.events();
                }else{
                    me.showPaipan();
                }
            },

            function(d){
                if(d.ret == 106){
                    BAZI.Common.showTips('请先登录！');
                    BAZI.router.navigate('!/login', true);
                }
            }
        );
    },

    editName: function(){
        var me = this;

        $('#editInfo-sect').hide();
        $('#editName-sect').show();
        this.$el.find('h2').html('更改名字');

        this.$el.find('.a-left').unbind(supportEvent);
        this.$el.find('.a-left').on(supportEvent, function(){
            me.editBack();
        });

        $('#EditName_Submit').unbind(supportEvent);
        $('#EditName_Submit').on(supportEvent, function(){
            me.vaildate('name', me.completeInfo);
        });

    },

    editGender: function(){
        var me = this;
        $('#editGender-sect').show();

        var overlay = "<div class='overlay'></div>";
        this.$el.append(overlay);
        $('.overlay').unbind(supportEvent);
        $('.overlay').on(supportEvent, function(){
            $('.overlay').remove();
            $('#editGender-sect').hide();
        })

        var igender = BAZI.userData.sDate ? BAZI.userData.iGender : User.igender;
        if(igender == 1){
            $('#editGender-sect').find("input[data-sexcode='1']").attr("checked", true).parent('.i-label').addClass('cur-label');
        }else{
            $('#editGender-sect').find("input[data-sexcode='0']").attr("checked", true).parent('.i-label').addClass('cur-label');
        }

        $('#editGender-sect').find("input").unbind(supportEvent);
        $('#editGender-sect').find("input").on(supportEvent, function(){
            $(this).parent('.i-label').addClass('cur-label').siblings(".i-label").removeClass('cur-label');
            $(this).parent().siblings(".i-label").find('input').attr("checked", false);
            $(this).attr("checked", "checked");
            me.vaildate('sex', me.completeInfo);
            $('.overlay').trigger(supportEvent);
        });
    },

    editArea: function(){
        var me = this;

        $('#editInfo-sect').hide();
        $('#editArea-sect').show();

        $('#cur-area').find('.area').html(BAZI.userData.province + ' ' + BAZI.userData.city);
        this.$el.find('h2').html('选择地区');

        this.$el.find('.a-left').unbind(supportEvent);
        this.$el.find('.a-left').on(supportEvent, function(){
            me.editBack();
        });

        var provinceHtml = "";
        $.each(BAZI.provinceData, function(i, data){
            var li = "<li>"+ data +"</li>";
            provinceHtml+=li;
        });
        $('#provinceList').html(provinceHtml).show();
        $('#cityList').hide();

        $('#provinceList').find('li').unbind(supportEvent);
        $('#provinceList').find('li').on(supportEvent, function(){
            var index = $(this).index();
            var html = $(this).html();
            $('#cur-area').find('.area').html(html);
            me.showCityList(html, index);
        });

        $('.area-list').height(clientHeight - 260*clientWidth/640);

    },

    editTime: function(data){
        var me = this;
        var d = {
            birthsolar: data.year+'-'+data.month+'-'+data.day,
            birthtime: data.hour+':00:00'
        }
        this.completeInfo(d);
    },

    showCityList: function(p, i){
        var me = this;
        var cityHTML = "";
        var curCity = BAZI.cityData[i].split("|");
        $.each(curCity, function(i, data){
            var li = "<li>"+ data +"</li>";
            cityHTML+=li;
        });
        $('#cityList').html(cityHTML).show();
        $('#provinceList').hide();

        $('#cityList').find('li').unbind(supportEvent);
        $('#cityList').find('li').on(supportEvent, function(){
            var html = $(this).html();
            me.completeInfo({
                province: p,
                city: html
            });
            $('#cur-area').find('.area').html(p + ' ' + html);
            // console.log('cityList-----------', html);
        });
    },

    editBack: function(){
        var me = this;

        $('#editInfo-sect').show();
        $('#editName-sect').hide();
        $('#editArea-sect').hide();

        this.initInfo();
        this.$el.find('.a-left').unbind(supportEvent);
        this.$el.find('.a-left').on(supportEvent, function(){
            BAZI.router.paipan(BAZI.userData);
        });
    },

    vaildate: function(type, cb){
        var me = this;
        var testName = function(){
            var name = me.nameInput.val();
            if(/\S+/.test(name)){
                var data = {
                    rname: name
                };
                cb && cb.call(me, data);
            }else{
                BAZI.Common.showTips('昵称格式不正确');
            }
        };

        var testSex = function(){
            var sexOption = $('#editGender-sect').find('input:checked');
            if(sexOption.length != 0){
                var data = {
                    igender: sexOption.data('sexcode')
                };
                cb && cb.call(me, data);
            }else{
                BAZI.Common.showTips('性别必须选择');
            }
        };

        switch(type){
            case 'name':
                testName(); break;
            case 'sex':
                testSex(); break;
            break;
        }
    },

    // 完善资料
    completeInfo: function(data){

        var me = this;
        if(this.data.newInfo){
            _.extend(BAZI.userData, {
                rName: data.rname ? data.rname : BAZI.userData.rName,
                sDate: data.birthsolar ? data.birthsolar : BAZI.userData.sDate,
                sTime: data.birthtime ? data.birthtime : BAZI.userData.sTime,
                iGender: data.igender ? data.igender : BAZI.userData.iGender,
                province: data.province ? data.province : BAZI.userData.province,
                city: data.city ? data.city : BAZI.userData.city
            });
            me.editBack();
            return;
        }

        var d = $.extend({
            udid: BAZI.userData.udid ? BAZI.userData.udid : User.udid,
            mkey: User.mkey
        }, data);

        BAZI.Api.iudatas.edit(d, function(data){
            console.log("资料保存成功！", data);

            BAZI.Common.showTips('资料保存成功！');
            if(data.aUinfo.udid && data.aUinfo.udid == User.udid){
                User.isComplete = 1;
                $.extend(User, data.aUinfo);
                sessionStorage.User = JSON.stringify(User);
            }

            $.extend(BAZI.userData, {
                rName: data.aUinfo.rname,
                sDate: data.aUinfo.birthsolar,
                sTime: data.aUinfo.birthtime,
                iGender: data.aUinfo.igender,
                province: data.aUinfo.province,
                city: data.aUinfo.city
            });

            me.editBack();
        });
    }
});
