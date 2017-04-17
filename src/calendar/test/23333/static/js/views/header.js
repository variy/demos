;(function(win,BAZI){
    BAZI.Views.Header = Backbone.View.extend({

        className:'header',

        events:{
            'click #js-login' : 'events_self_login',
            'click #js-register' : 'events_self_register',
            'click #js-login' : 'events_self_login',
            'click .nav-wrap li:not(\':first\') a' : 'events_isLogin',

            'focus #search-input' : function(event){
                var _this = this;
                BAZI.router.loginFirst(function(){
                    _this.event_searchText(event);
                });
            },
            'keyup #search-input' : 'event_search_request',

            'click #search-btn' : function(){
                BAZI.router.loginFirst(this.event_searchBtn);
            },
            'click #friends_request_btn' : 'event_friendsrequest'
        },
        initialize:function(){
            this.$el.html($.tmpl(BAZI.tpls.tpls_header));
            this.$("#search-wrap").append(BAZI.tpls.tpls_search_select);
            this.render();

            this.listenTo(BAZI.models.pageStatus,'change:isLogin',this.loginStatus);

            //trigger
            if(BAZI.models.pageStatus.get('isLogin') == true){
                this.loginStatus(null,true);
            }else{
                this.loginStatus(null,false);
            }

        },

        //登录状态
        loginStatus:function(model,isLogin){
            if(isLogin === true){
                //设定登录状态


                //显示头像 赋值姓名
                this.$('.user-wrap').show().find('.user-name').html(BAZI.User.rname);

                //显示右上角ico
                this.$(".top-request-wrap").show();


                //隐藏「登录」「注册」按钮
                this.$('.user-link').hide();


            }else{
                //未登录状态


                //隐藏头像
                this.$('.user-wrap').hide().find('.user-name').html('');

                //隐藏好友请求
                this.$(".top-request-wrap").hide();

                //显示「登录」「注册」按钮
                this.$('.user-link').show();

            }
        },

        render:function(){
            $('#viewport').append(this.el);
            return this;
        },

        //顶部登录
        events_self_login : function(){
            BAZI.router.login('login');
        },

        //顶部注册
        events_self_register : function(){
            BAZI.router.login('register');
        },

        //顶部导航
        events_isLogin : function(event){
            //if(!BAZI.router.isLogin()){
            //    event.preventDefault();
            //}
        },

        //搜索框聚焦
        event_searchText : function(event){
            $(event.target).trigger('keyup');
        },

        //搜索请求
        event_search_request : function(event){
            var target = event.target;
            var searchKey = $(target).val();
            //去掉两端空格
            searchKey = $.trim(searchKey);
            if(searchKey === ''){
                this.$(".search_select").hide();
                return;
            }

            var _this = this;
            var pagesize=6;
            var params = {mkey: BAZI.User.mkey,key: searchKey,pn:1,ps:pagesize };
            //查询
            BAZI.Api.friend.search(params,
                function(data){
                    var d=data;
                    var tmp_models=[];
                    var count=d.count;
                    d.list.forEach(function(item){
                        var obj={
                            uid:item["uid"],
                            favicon:item["upicture"],
                            name:item["rname"],
                            sex:item["sex"]==0?"男":"女",
                            province:item["province"],
                            city:item["city"],
                            relation:item["relation"]
                        };
                        tmp_models.push(obj);
                    });

                    var lis = '';
                    tmp_models.forEach(function(model){
                        lis+='<li class="clearfix s-search-item">';
                        lis+='<img src="'+model.favicon+'" class="fn-left" width="40" height="40"><p class="ml55 color_red name">'+model.name+'</p><p class="ml55"><span>'+model.province+'</span><span class="ml10">'+model.city+'</span></p>';
                        var relation=model.relation;// 0 自己 1 朋友  2非好友
                        var apphtml="";

                        switch(relation){
                            case 0 :
                                apphtml = '<span class="friend">自己</span>';
                                break;
                            case 1 :
                                apphtml = '<span class="friend">好友</span>';
                                break;
                            case 2 :
                                apphtml = '<a class="add-f-btn" href="javascript:void(0)"><i>+</i> 加好友 <b style="display:none;">'+model.uid+'</b></a>'
                                break;
                        }

                        lis+=apphtml;
                        lis+="</li>";
                    });

                    var listResult = _this.$(".s-search-list");
                    listResult.html(lis);


                    if(tmp_models.length<=0){
                        var bottomdiv="<div class='no-result'>没有找到有关 <span class='color_red'>"+searchKey+"</span> 的内容</div>";
                        listResult.append(bottomdiv);
                    }else{
                        var div="<div id='searchmore' class='search-more'> 更多有关 <span class='color_red'>"+searchKey+"</span> 的搜索结果</div>";
                        listResult.append(div);
                    }

                    //增加好友
                    _this.$(".add-f-btn").on("click",function(e){
                        var me = this;
                        var uid = $(this).find("b").html();
                        var params = {tuid: uid,mkey: BAZI.User.mkey};
                        BAZI.Api.friend.req(params,function(data){
                            var d=data;
                            if(d.ret===0){
                                $(me).html("已发送");
                            }
                        });
                    });

                    //查看更多
                    _this.$("#searchmore").on("click",function(){
                        BAZI.router.search();
                        _this.$(".search_select").hide();
                    });


                    //显示结果
                    _this.$(".search_select").show();


                    //点击其他区域隐藏
                    $(document).off('click.top_search').on("click.top_search",function(event){
                        //点击搜索框和列表，不隐藏
                        if($(event.target).closest('#search-wrap').length>=1){
                            return;
                        }
                        _this.$(".search_select").hide();
                        //事件触发即取消绑定
                        $(this).off('click.top_search');

                    });
                }
            );

        },

        //点击搜索
        event_searchBtn : function(){
            this.$(".search_select").hide();
            BAZI.router.search();
        },

        //好友请求
        event_friendsrequest : function(){
            BAZI.router.TopFriendRequest();
            //点击其他区域隐藏
            $(document).off('click.top_friends_request').on("click.top_friends_request",function(event){

                //点击搜索框和列表，不隐藏
                if($(event.target).closest('#TopFriendsRequest').length>=1 || $(event.target).hasClass('friends_request_btn') || $(event.target).hasClass('del-request-btn')){
                    return;
                }

                $('.request-select').hide();
                //事件触发即取消绑定
                $(this).off('click.top_friends_request');

            });
        }

    });


}(window,BAZI));