~(function(BAZI){



    //右侧 导航
    BAZI.Views.RighgtSideNav = Backbone.View.extend({
        events:{
            'click .ico_paipan':'toggle_userBazi'
        },
        initialize:function(){
            this.render();
        },
        render:function(){
            var html = $.tmpl(BAZI.tpls.tpls_side_nav)();
            this.el.innerHTML = html;
            this.$el.appendTo($('.right-side'));
        },
        //切换 八字模块 显示隐藏
        toggle_userBazi:function(){
            var speed = 200;
            if('UserBazi' in BAZI.views){
                if(BAZI.views.UserBazi.$el.is(':visible')){
                    BAZI.views.UserBazi.ac_hide(speed);
                }else{
                    BAZI.views.UserBazi.ac_show(speed,true);
                }
            }else{
                BAZI.views.UserBazi = new BAZI.Views.UserBazi({focus:true});
            }
        }
    });


}(BAZI));