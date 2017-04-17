
~function(BAZI,win){
 //model
var searchItem=Backbone.Model.extend({
    defaults:{
        uid:0,
        favicon:"",
        name:"",
        sex:"",
        province:"",
        city:"",
        relation:""
    }
});
//集合
var searchList=Backbone.Collection.extend({
    model:searchItem
});
//实例化集合
var searchs=new searchList();

BAZI.Views.SearchView = Backbone.View.extend({

    id: 'search',

   events:{
          "click .add-f-btn":"tjhy"
        },
   tjhy:function(e){
        var me=this;
        var uid=$(e.target).find("b").html();
        me.req(uid,e);
    },
    initialize: function(data){
        searchs.reset(null);
        this.listenTo(searchs, 'reset', this.addAll);
        this.render();
        this.iPage=1;
        this.pagesize=20;
        this.init(data);
        this.initEvent();
        this.hasMoreSearchsData=true;
    },

    render: function(){
        var html = $.tmpl(BAZI.tpls.tpls_friends_search)({});
        this.$el.html(html).appendTo('#main').siblings().hide();
        this.listBox = this.$el.find("#search-list_select");
        this.showMore=this.$el.find(".nomore-tips");
    },
    addAll:function(){
            var fragment = document.createDocumentFragment();
            searchs.forEach(function(model,idx){
                var view = new SearchItemView({model: model});
                fragment.appendChild(view.render().el[0]);
            });
            this.listBox.empty()[0].appendChild(fragment);
    },
    init: function(data){
        var me = this;
        me.searchFriFetch();
    },
    searchFriFetch:function(){
        var me=this;
        var searchKey=$("#search-input").val();
        if(searchKey.length<=0||searchKey===""){
            $("#search_result").html("请输入搜索关键字");
            return;
        } else{
             $("#search_result").html("关于 "+searchKey+" 的搜索结果");
        }
       var params={ mkey: BAZI.User.mkey,key: searchKey,pn: me.iPage,ps:me.pagesize};
       BAZI.Api.friend.search(params,
       function(data){
            var d=data;
            var tmp_models=[];
            var row=me.iPage*me.pagesize;
             if(row>d.count){
               me.showMore.find("span").html("没有更多了...");
               hasMoreSearchsData=false;
            }else{
              me.iPage++;
              hasMoreSearchsData=true;
              me.showMore.show();
            }
            d.list.forEach(function(item){
                var obj={
                      uid:item["uid"],
                      favicon:item["upicture"],
                      name:item["rname"],
                      sex:item["sex"]===0?"男":"女",
                      province:item["province"],
                      city:item["city"],
                      relation:item["relation"]
                };
               tmp_models.push(obj);
            })
           searchs.add(tmp_models);
           searchs.trigger('reset');
        })
    },
    initEvent: function(){
          var me=this;
          var itemHeight = 50;
            $(window).scroll(function(e){
                if(hasMoreSearchsData ){
                    var height=$(window).scrollTop()+ $(window).height();
                    var item= (me.listBox.find('.uibox-list-item:last-child').length>0 ? me.listBox.find('.uibox-list-item:last-child').offset().top : 0) + itemHeight;
                    var isBeyond = height > item;
                    if( isBeyond){
                       hasMoreSearchsData=false;
                       me.searchFriFetch();
                    }
                }else{
                    $(window).unbind('scroll');
                }
            });
    },
    req:function(uid,e){
         var params = {
            tuid: uid,
            mkey: BAZI.User.mkey
        };
        BAZI.Api.friend.req(params,function(data){
               var d=data;
               if(d.ret==0){
                   $(e.target).html("已发送");
               }
        })
    }
});

    //搜索每一条记录的view
    var hasMoreSearchsData=true;
    var SearchItemView = Backbone.View.extend({
        template: _.template(BAZI.tpls.tpls_friends_item_search),
        initialize: function() {
            var me = this;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.el = $('<li class="clearfix uibox-list-item search-item"></li>');
            var html = this.template({
                userInfo: this.model.toJSON()
            });
            var relation=this.model.toJSON().relation;// 0 自己 1 朋友  2非好友
            var apphtml="";
            if(relation==1){ 
                apphtml='<span class="friend">好友</span>'; //<div class="select"><span class="select-btn"><ul class="select-list"><li class="record-edit">编辑资料</li><li class="record-delete">删除好友</li></ul></span></div>
            }
            if(relation==2){
                apphtml='<a class="item-btn add-f-btn" href="javascript:void(0)"><i>+</i> 加好友 <b style="display:none;">'+this.model.toJSON().uid+'</b></a>'
            }
            html+=apphtml;
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

}(BAZI, window);
