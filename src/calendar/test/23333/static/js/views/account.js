// 个人中心
~function(BAZI,win){
    BAZI.Views.accountView = Backbone.View.extend({

        id: 'account',
        events: {
            "click .toggle-editable": "toggleditable"
        },
        initialize: function(data) {
            this.render(data);
            this.initEvent();
        },

        render: function(data) {

            var html = $.tmpl(BAZI.tpls.tpls_account);
            this.$el.html(html).appendTo('#main').siblings().hide();

            this.trendsBox = this.$el.find('.account-trends');
            this.mingpanBox = this.$el.find('.account-mingpan');
            this.friendsBox = this.$el.find('.account-friends');

            this.initData();
            this.showtrends();
            this.showside();
        },

        initData: function(){
            var me = this;
            console.log(BAZI.User);
            var birth = BAZI.Common.setBirthday(BAZI.User.aBirthday, 'solar') + '</br>' + BAZI.Common.setBirthday(BAZI.User.aBirthday, 'lunar');

            // 个人信息
            $('.user-info-list').find('.name').html(BAZI.User.rname);
            $('.user-info-list').find('.igender').html(parseInt(BAZI.User.igender) === 0 ? '男':'女');
            $('.user-info-list').find('.mobile').html(BAZI.User.umobile);
            $('.user-info-list').find('.birth').html(birth);

            // 四柱
            var ganzhi = BAZI.utilities.getDateData({
                year: parseInt(BAZI.User.birthsolar.split('-')[0]),
                month: parseInt(BAZI.User.birthsolar.split('-')[1]),
                day: parseInt(BAZI.User.birthsolar.split('-')[2]),
                hour: parseInt(BAZI.User.birthtime.split(':')[0]),
                min: parseInt(BAZI.User.birthtime.split(':')[1])
            });

            this.ganziBox = $('.user-ganzhi-info');
            this.ganziBox.find('[data-send=year]').html(ganzhi.GanZhiYear);
            this.ganziBox.find('[data-send=month]').html(ganzhi.GanZhiMonth);
            this.ganziBox.find('[data-send=day]').html(ganzhi.GanZhiDay);
            this.ganziBox.find('[data-send=hour]').html(ganzhi.GanZhiHour);
        },

        initEvent:function(){
            var me = this;
            var myitemBtn = $('.account-nav-tabs').find('li');

            myitemBtn.on('click',function(){

                $(this).addClass('active').siblings().removeClass('active');

                var type = $(this).attr('data-send');
                if (type == 'trends') {
                    me.trendsBox.show().siblings().hide();
                    if(!me.trendsBox.html()){
                        me.showtrends();
                    }else{
                        me.trendsBox.show();
                    }
                }
                if (type == 'mingpan') {
                    me.mingpanBox.show().siblings().hide();
                    if(!me.mingpanBox.html()){
                        me.showmingpan();
                    }else{
                        me.mingpanBox.show();
                    }
                };
                if (type == 'friends') {
                    me.friendsBox.show().siblings().hide();
                    if(!me.friendsBox.html()){
                        me.showfriends();
                    }else{
                        me.friendsBox.show();
                    }
                };

            })
        },

        showtrends:function(){
            var me = this;
            var trends = $.tmpl(BAZI.tpls.tpls_trends)();
            me.trendsBox.append(trends);
        },

        showmingpan:function(){
            var data = {
                sDate: BAZI.User.birthsolar,
                sTime: BAZI.User.birthtime,
                iGender: BAZI.User.igender,
                rName: BAZI.User.rname,
                fromAccount: true
            };
            new BAZI.Views.Paipan(data);
        },

        showfriends:function(){
            // var data = {
            //     mkey: BAZI.User.mkey,
            //     fromAccount: true
            // };
            // new BAZI.Views.FriendsView(data)
            this.friendsBox.append('好友列表');
        },

        showside:function(){
            var me = this;
            var accountNav = $.tmpl(BAZI.tpls.tpls_account_side);
            $('.right-side').html(accountNav);
        }
    });

    //个人资料
    BAZI.Views.accountPersonalView = Backbone.View.extend({

        id: 'accountPersonal',
        events: {
            "click .toggle-editable": "toggleditable"
        },
        initialize: function(data) {
            this.render(data);
            //this.initEvent();
        },

        render: function(data) {

            var html = $.tmpl(BAZI.tpls.tpls_account_personal);
            this.$el.html(html).appendTo('#main').siblings().hide();

            this.initData();
        },

        initData: function(){
            var me = this;
        },

        initEvent:function(){

        }
    });

    //头像设置
    BAZI.Views.accountAvatarView = Backbone.View.extend({

        id: 'accountAvatar',
        events: {
            "click .toggle-editable": "toggleditable"
        },
        initialize: function(data) {
            this.render(data);
            //this.initEvent();
        },

        render: function(data) {

            var html = $.tmpl(BAZI.tpls.tpls_account_avatar);
            this.$el.html(html).appendTo('#main').siblings().hide();

            this.initData();
        },

        initData: function(){
            var me = this;
        },

        initEvent:function(){

        }
    });

    //隐私设置
    BAZI.Views.accountPrivacyView = Backbone.View.extend({

        id: 'accountPrivacy',
        events: {
            "click .toggle-editable": "toggleditable"
        },
        initialize: function(data) {
            this.render(data);
            //this.initEvent();
        },

        render: function(data) {

            var html = $.tmpl(BAZI.tpls.tpls_account_privacy);
            this.$el.html(html).appendTo('#main').siblings().hide();

            this.initData();
        },

        initData: function(){
            var me = this;
        },

        initEvent:function(){

        }
    });
}(BAZI, window);
    