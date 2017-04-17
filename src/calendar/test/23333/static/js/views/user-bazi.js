//八字排盘块
~(function(BAZI){
    BAZI.Views.UserBazi = Backbone.View.extend({
        className:'user-bazi clearfix ui-box',
        events:{
            'click #sex-tab': 'switchSex',
            'click #qipan-btn': 'qipan'
        },
        initialize:function(option){
            this.render(option);
        },
        render:function(option){
            var html = $.tmpl(BAZI.tpls.tpls_user_bazi)();
            this.el.innerHTML = html;
            this.$el.prependTo($('#main'));

            var me = this;

            new BAZI.calCtrlBar({
                oBoxEl: $('#calendar'),
                activeClass: 'cur',
                updateDate: function(data){
                    me.dateInfo = [data.year, data.month, data.day];
                    me.timeInfo = [data.hour, data.min, data.second];
                }
            });
            this.ac_show(option.speed,option.focus);
        },

        //动画显示
        ac_show:function(speed,focus){
            var _this = this;
            this.$el.prependTo($('#main')).slideDown(speed === undefined?200:speed,function(){
                if(focus === true){
                    _this.$('.name-input').trigger('focus');
                }
            });
        },

        //动画隐藏
        ac_hide:function(speed){
            this.$el.slideUp(speed === undefined?200:speed);
        },
        qipan: function(){
            var year = this.dateInfo[0];
            var mouth = this.dateInfo[1];
            var day = this.dateInfo[2];

            var hour = this.timeInfo[0];
            var min =  this.timeInfo[1];
            var second = this.timeInfo[2];

            var format = function(num){
                if(num < 10){
                    return '0' + num;
                }
                return ''+num;
            };

            var data = {
                sDate: year+'-'+ format(mouth)+'-'+ format(day),
                sTime: format(hour)+':'+ format(min)+':'+ format(second),
                iGender: $('#sex').val(),
                rName: $('#name').val()
            };

            BAZI.views.Paipan = new BAZI.Views.Paipan(data);
        },

        switchSex: function(e){
            var el = $(e.target);
            el.addClass('on').siblings().removeClass('on');
            $('#sex').val(el.val());
        }

    });

}(BAZI));