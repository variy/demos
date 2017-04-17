(function(win, BAZI){

    var topfriendsRequestItem=Backbone.Model.extend({
         defaults:{
            uid:0,
            favicon:"",
            name:"",
            sex:"",
            province:"",
            city:"",
            message:"",
            comfri:""
        }
    });
    var topfriendRequestList=Backbone.Collection.extend({
        model:topfriendsRequestItem
    });
    var topfriendrequest=new topfriendRequestList();


    //顶部好友请求
    BAZI.Views.TopFriendsRequest = Backbone.View.extend({
        id: 'TopFriendsRequest',
        events: {
            "click .conf-request-btn":"acchy"
        },
        acchy:function(e)
        {
            var me=this;
            var uid=$(e.target).find("b").html();
            me.acc(uid,e);
        },
        initialize: function(data){
            this.render(data);
            this.listenTo(topfriendrequest, 'addall', this.addAll);
    //        this.listenTo(topfriendrequest,"reset",this.clear);
            this.iPage=1;
            this.pagesize=6;
        },
        render: function(data){
      
            var me = this;
            var html = $.tmpl(BAZI.tpls.tpls_select_request)({});

            this.$el.html(html).appendTo('.top-request-wrap');
            this.listBox=this.$el.find(".s-request-list");
            //this.linkMore=this.$el.find(".select-bottom");
            this.init();
            this.initInfo(data);
            this.initEvent();
            var _this = this;

            console.log("html:"+html);
        },
        clear:function(){
            this.remove();
        },
         addAll:function(){
                var fragment = document.createDocumentFragment();
                topfriendrequest.forEach(function(model,idx){
                    var view = new TopFriendsRequestView({model: model});
                    fragment.appendChild(view.render().el[0]);
                });
               this.listBox[0].appendChild(fragment);
        },
        init: function(){
            var me = this;
            me.requestFriendFetch();
        },
        initEvent: function(){
            var me = this;
              $('.friends-request').on('click', function(){
                   $('.request-select').hide();
                   BAZI.router.FriendsRequest();
               });
        },
        requestFriendFetch:function(){
            var me=this;
            var params={ mkey: BAZI.User.mkey,pn:1,ps:6};
            BAZI.Api.friend.reqlist(params,
            function(data){
                var d=data;
                var tmp_models=[];
                d.list.forEach(function(item){
                    var obj={
                          uid:item["fuid"],
                          favicon:item["upicture"],
                          name:item["rname"],
                          sex:item["sex"]===0?"男":"女",
                          province:item["province"],
                          city:item["city"],
                          comfri:item["comfri"]>0?item["comfri"]+"位共同好友":""
                    };
                   tmp_models.push(obj);
                });
                console.log("d:"+d.count+" tmp_models:"+JSON.stringify(tmp_models));
                if(d.count==0){
                     $(".s-request-list").append('<li class="clearfix s-request-item"><div class="no-result">当前没有新的好友请求</div></li>');
                }
                var new_models=topfriendrequest.add(tmp_models);
               topfriendrequest.reset(tmp_models);
               topfriendrequest.trigger('addall',new_models);
               //alert("执行一次");
            })
        },
        initInfo: function(data,opts){
            var me = this;
        },
        acc:function(uid,e){
             var params = {
                fuid: uid,
                mkey: BAZI.User.mkey
            };
            BAZI.Api.friend.acc(params,function(data){
                var d=data;
                   console.log("e"+JSON.stringify(d));
                   if(d.ret==0||d.ret==107){
                       $(e.target).html("成为好友");
                       $(e.target).siblings().hide();
                   }
                   e.stopPropagation();
            });
        }
    });

    //每一个小的view
    var TopFriendsRequestView = Backbone.View.extend({
        template: _.template(BAZI.tpls.tpls_select_request_item),
            initialize: function() {
                var me = this;
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'destroy', this.delhy);
            },
            render: function() {
                //debugger;
                this.el = $('<li class="clearfix s-request-item"></li>');
                var html = this.template({
                    info: this.model.toJSON()
                });
                this.el.html(html);
                this.bthdel = this.el.find(".del-request-btn");
                this.el.toggleClass('done', this.model.get('done'));
                this.liItem=this.el.find(".s-request-item");
                this.requestSelect=$(".request-select");
                this.linkMore=$(".select-bottom");
                this.initEvent();
                return this;
            },
            initEvent: function() {
                var me = this;
                this.bthdel.bind("click",function(){
                    me.delhy.call(me);
                });
            },
            clear: function() {
                this.model.destroy();
            },
            delhy:function(){
                $(this.el).remove();
                console.log("model"+JSON.stringify(this.model));
                var uid=this.model.get("uid");
                console.log("deluid:"+uid);
                this.del(uid);
                if($(".s-request-list").html()==""){
                   $(".s-request-list").html('<li class="clearfix s-request-item"><div class="no-result">当前没有新的好友请求</div></li>')
                }
            },
            del:function(uid){
                var params = {fuid: uid, mkey: BAZI.User.mkey };
                var me=this;
                BAZI.Api.friend.del(params,function(data){
                  var d=data;
                   if(d.ret===0){
                       //this.model.destroy();
                   }
            });
        }
    });

})(window, BAZI);
