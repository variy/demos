(function(win, BAZI){
  var friendsRequestItem=Backbone.Model.extend({
       defaults:{
          uid:0,
          favicon:"",
          name:"",
          sex:"",
          province:"",
          city:"",
          message:""
      }
  });
  var friendRequestList=Backbone.Collection.extend({
      model:friendsRequestItem
  });
  var friendrequest=new friendRequestList();

  BAZI.Views.FriendsRequest = Backbone.View.extend({
      id: 'FriendsRequest',
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
         // this.listenTo(Records, 'bulkAdd', this.bulkAdd);
          this.listenTo(friendrequest, 'addAll', this.addAll);
          this.iPage=1;
          this.pagesize=20;    
          this.hasMoreSearchsData=true;
      },
      render: function(data){
          var me = this;
          var html = $.tmpl(BAZI.tpls.tpls_friends_request)({});
          this.$el.html(html).appendTo('#main').siblings().hide();
          this.listBox=this.$el.find("#friends_request_select");
          this.recount=this.$el.find(".fn-left");
          this.showMore=this.$el.find(".nomore-tips");
          this.init();
          this.initInfo(data);
          this.initEvent();
      },
       addAll:function(models){
             var fragment = document.createDocumentFragment();
              models.forEach(function(model,idx){
                  var view = new FriendsRequestView({model: model});
                  fragment.appendChild(view.render().el[0]);
              });
              this.listBox[0].appendChild(fragment);
      },
      init: function(){
          var me = this;
          //alert("初始化调用 触发一次");
          me.requestFriendFetch();
      },
      initEvent: function(){
          var me = this;
          $('.my-request').on('click', function(){
              BAZI.router.MyRequest();
          });
           var me=this;
            // var itemHeight = this.listBox.find('.uibox-list-item').outerHeight();
            var itemHeight = 50;
             console.log(" itemHeight"+itemHeight);
              $(window).scroll(function(e){
                  console.log("me.hasMoreSearchsData:"+me.hasMoreSearchsData);
                  if(me.hasMoreSearchsData ){
                      var height=document.body.scrollTop+ document.documentElement.clientHeight;
                      var item= me.listBox.find('.uibox-list-item:last-child').offset().top + itemHeight;
                      var isBeyond = height > item;
                      console.log("height:"+height+" item:"+item);
                      console.log("isbeyond:"+isBeyond);
                      if( isBeyond){
                         me.hasMoreSearchsData=false;
                         //alert("超出，触发一次");
                         me.requestFriendFetch();
                      }
                  }else{
                      $(window).unbind('scroll');
                  }
              });
      },
      requestFriendFetch:function(){
          var me=this;
          var params={ mkey: BAZI.User.mkey,pn: me.iPage,ps:me.pagesize};
          BAZI.Api.friend.reqlist(params,
          function(data){
              var d=data;
              var tmp_models=[];
               
              var row=me.iPage*me.pagesize;
              console.log("me.ipage:"+me.iPage+" ps:"+me.pagesize+" count:"+d.count+" row:"+row);
               if(row>d.count){
                 me.showMore.find("span").html("没有更多记录了...");
                 me.hasMoreSearchsData=false;
              }else{
                console.log("row++"+me.iPage);
                me.iPage++;
                me.hasMoreSearchsData=true;
                me.showMore.show();
              }
              d.list.forEach(function(item){
                  var obj={
                        uid:item["fuid"],
                        favicon:item["upicture"],
                        name:item["rname"],
                        sex:item["sex"]===0?"男":"女",
                        province:item["province"],
                        city:item["city"]
                  };
                 tmp_models.push(obj);
              });
            console.log("friendrequest:"+JSON.stringify(friendrequest));
             me.recount.find("strong").html(d.count);
             var newModels=friendrequest.add(tmp_models);
             console.log("newModels:"+JSON.stringify(newModels));
             friendrequest.trigger('addAll',newModels);
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
                 if(d.ret===0||d.ret==107){
                     $(e.target).html("成为好友");
                     $(e.target).siblings().hide();
                 }
          });
      }
  });

  //每一个小的view
  var FriendsRequestView = Backbone.View.extend({
      template: _.template(BAZI.tpls.tpls_friends_request_item),
          initialize: function() {
              var me = this;
              this.listenTo(this.model, 'change', this.render);
              this.listenTo(this.model, 'destroy', this.delhy);
          },
          render: function() {
              this.el = $('<li class="clearfix uibox-list-item search-item"></li>');
              var html = this.template({
                  info: this.model.toJSON()
              });
              this.el.html(html);
              this.bthdel = this.el.find(".del-request-btn");
              this.el.toggleClass('done', this.model.get('done'));
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
              var uid=this.model.get("uid")
              console.log("deluid:"+uid);
              this.del(uid);
          },
          del:function(uid){
              var params = {fuid: uid, mkey: BAZI.User.mkey };
              BAZI.Api.friend.del(params,function(data){
                var d=data;
                 if(d.ret===0){
                    // this.model.destory();
                 }
          });
      }
  });

  ////////////////////////////////////////
  var myRequestItem=Backbone.Model.extend({
      defaults:{
          uid:0,
          favicon:"",
          name:"",
          sex:"",
          province:"",
          city:"",
          message:""
      }
  });

  var myRequestList=Backbone.Collection.extend({
      model:myRequestItem
  });

  var myrequest=new myRequestList();

  BAZI.Views.MyRequest = Backbone.View.extend({

      id: 'MyRequest',

      events: {
      },
      initialize: function(data){
          myrequest.reset(null);
          this.listenTo(myrequest, 'reset', this.addAll);
          this.iPage=1;
          this.pagesize=20;    
          this.render(data);
          this.hasMoreSearchsData=true;
      },

      render: function(data){
          var me = this;
          var html = $.tmpl(BAZI.tpls.tpls_my_request)({});
          this.$el.html(html).appendTo('#main').siblings().hide();
          this.listBox=this.$el.find("#request_select_list");
          this.showMore=this.$el.find(".nomore-tips");
          this.init();
          this.initInfo(data);
          this.initEvent();
      },
      addAll:function(){
              var fragment = document.createDocumentFragment();
              myrequest.forEach(function(model,idx){
                  var view = new myRequestViewItem({model: model});
                  fragment.appendChild(view.render().el[0]);
              });
             this.listBox.empty()[0].appendChild(fragment);
      },
      init: function(data){
          console.log("init");
          var me = this;
          me.requestFetch();
      },
      requestFetch:function(){
          var me=this;
          console.log("me.iPage:"+me.iPage);
          console.log("me.pagesize:"+me.pagesize)
          var params={ mkey: BAZI.User.mkey,pn: me.iPage,ps:me.pagesize};
          console.log("params"+JSON.stringify(params));
          BAZI.Api.friend.sendreqlist(params,
          function(data){
              var d=data;
              var tmp_models=[];
              var row=me.iPage*me.pagesize;
              console.log("me.ipage:"+me.iPage+" ps:"+me.pagesize+" count:"+d.count+" row:"+row);
               if(row>d.count){
                 me.showMore.find("span").html("没有更多记录了...");
                 me.hasMoreSearchsData=false;
              }else{
                me.iPage++;
                me.showMore.show();
                me.hasMoreSearchsData=true;
              }
              d.list.forEach(function(item){
                  var obj={
                        uid:item["tuid"],
                        favicon:item["upicture"],
                        name:item["rname"],
                        sex:item["sex"]===0?"男":"女",
                        province:item["province"],
                        city:item["city"],
                        message:"已发送请求"
                  };
                 tmp_models.push(obj);
              });
             myrequest.add(tmp_models);
             myrequest.trigger('reset');
          })
      },
      initEvent: function(){
          var me = this;
          $('.friends-request').on('click', function(){
              BAZI.router.FriendsRequest();
          });
           // var itemHeight = this.listBox.find('.uibox-list-item').outerHeight();
          var itemHeight = 10;

          $(window).scroll(function(e){
                  if(me.hasMoreSearchsData ){
                      var height = $(window).scrollTop() + $(window).height();

                      var item = me.listBox.find('.uibox-list-item:last-child').offset().top + itemHeight;

                      var isBeyond = height > item;

                      if( isBeyond){
                         me.hasMoreSearchsData=false;
                         me.requestFetch();
                      }
                  }else{
                      $(window).unbind('scroll');
                  }
              });
      },
      initInfo: function(data,opts){
          var me = this;
      }
  });

  var myRequestViewItem=Backbone.View.extend({
       template: _.template(BAZI.tpls.tpls_my_request_item),
          initialize: function() {
              var me = this;
              this.listenTo(this.model, 'change', this.render);
              this.listenTo(this.model, 'destroy', this.remove);
          },
          render: function() {
              this.el = $('<li class="clearfix uibox-list-item search-item"></li>');
              var html = this.template({
                  info: this.model.toJSON()
              });
              this.el.html(html);
              this.el.toggleClass('done', this.model.get('done'));
              this.initEvent();
              return this;
          },
          initEvent: function() {
              var me = this;
          },
          clear: function() {
              this.model.destroy();
          }
  });

})(window, BAZI);
