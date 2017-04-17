~(function(BAZI){



    //右侧 名师推荐
    BAZI.Views.RighgtSideRecommend = Backbone.View.extend({
        initialize:function(){
            this.render();
        },
        render:function(){
            var html = $.tmpl(BAZI.tpls.tpls_side_recommend)();
            this.el.innerHTML = html;
            this.$el.appendTo($('.right-side'));
        }
    });


}(BAZI));