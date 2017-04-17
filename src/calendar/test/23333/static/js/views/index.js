(function(win,BAZI){

    //首页每一个讨论model
    var DiscussModel = Backbone.Model.extend({
        //uid:'',/
        main: {
            rname: '',//用户名字
            upicture: '',//头像
            content: '',//讨论文字
            p_count: 0,//评论数
            z_count: 0,//点赞数
            createtime: 0,//创建时间
            my_zan: false//是否自己点赞
        },
        bazi:{}
    });


    //首页每条的collection
    var DiscussCollection = Backbone.Collection.extend({
       model:DiscussModel
    });

    var discussCollection = new DiscussCollection;



    //首页每条动态
    var DiscuessView = Backbone.View.extend({
        className:'clearfix bazi-item',
        template: $.tmpl(BAZI.tpls.tpls_trends_item),
        initialize:function(data){
            this.render();

            var status = new DiscuessView_status({model:this.model});
            var fenxi = new DiscuessView_fenxi({model:this.model});


            this.$('.topic-hd').after(status.el);
            status.$el.after(fenxi.el);

        },
        render:function(){
            this.el.innerHTML = this.template({data:this.model.models[0].toJSON()});
            this.$el.appendTo(BAZI.views.Index.$('.bazi-list'));
        }
    });


    //每条动态的信息view
    var DiscuessView_status = Backbone.View.extend({
        className:'clearfix mt10 topic-info',
        template: $.tmpl(BAZI.tpls.tpls_trends_item_status),
        initialize:function(data) {
            this.el.innerHTML = this.template({data:this.model.models[0].toJSON()});
        }
    });

    //每条动态的命理分析
    var DiscuessView_fenxi = Backbone.View.extend({
        className:'topic-contents',
        template: $.tmpl(BAZI.tpls.tpls_trends_item_fenxi),
        initialize:function(data) {
            this.render();
        },
        render:function(){
            this.el.innerHTML = this.template({data:this.model.models[0].toJSON()});
        }
    });



    BAZI.Views.Index = Backbone.View.extend({

        id: 'index',

        initialize: function() {
            this.render();
            BAZI.Api.discuss.getList({
                pn:0,
                ps:50
            },function(data){
                if(data.ret !== 0){
                    return;
                }


                data.list.forEach(function(elm){
                    console.log(a = elm);
                    var date = parseInt(elm.main.createtime+'000');
                    var d = new Date(date);
                    var birthsolar = elm.bazi.birthsolar.split('-');
                    var birthtime = elm.bazi.birthtime.split(':');

                    elm.bazi.ganzhi = BAZI.utilities.getDateData({
                        year: parseInt(birthsolar[0],10),
                        month: parseInt(birthsolar[1],10),
                        day: parseInt(birthsolar[2],10),
                        hour: parseInt(birthtime[0],10),
                        min: parseInt(birthtime[1],10)
                    });
                    elm.bazi.solar = elm.bazi.solar.replace('点','时');
                    elm.bazi.sex = elm.bazi.igender === '0'?'男':'女';
                    elm.bazi.mingjuStr = BAZI.lang.mingju.filter(function(e){if(e[0]===parseInt(elm.bazi.mingju)){return true}})[0][1];
                    var model = new DiscussCollection({
                        main: {
                            rname: elm.main.rname,
                            upicture: elm.main.upicture,
                            content: elm.main.content,
                            p_count: elm.main.p_count,
                            z_count: elm.main.z_count,
                            my_zan: elm.main.selfiszan,
                            createtime: date,
                            dateF: d.getFullYear() + '-' + f(d.getMonth() + 1) + '-' + f(d.getDate()) + ' ' + f(d.getHours()) + ':' + f(d.getMinutes()) + ':' + f(d.getSeconds()),
                        },
                        bazi:elm.bazi
                    });


                    var model = new DiscuessView({model:model,udid:elm.main.did});
                    discussCollection.add(model);

                    //接口
                    //var mingliAnalysis = new BAZI.Models.MingliAnalysis;
                    //mingliAnalysis.set(elm.main);
                    //mingliAnalysis.trigger('_request_');
                });


                function f(s){
                    s = s.toString();
                    return s.length === 1?'0'+s:s;
                }



            });

        },

        render: function(){
            this.$el.html($.tmpl(BAZI.tpls.tpls_trends)()).appendTo('#main').siblings().hide();
        }
    });

})(window, BAZI);
