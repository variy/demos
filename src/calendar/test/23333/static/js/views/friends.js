
~function(BAZI,win){
    
    //friend Model
    var friendItem=Backbone.Model.extend({
        defaults:{
            fuid:0,
            favicon:"",
            name:"",
            sex:"",
            profClassify:"",
            relClassify:"",
            siZhu:"",
            solarDateStr:"",
            lunarDateStr:"",
            birthsolar:"",
            birthtime:""
            
        }
    });
    
    //frist collection
   var friendList=Backbone.Collection.extend({
        model:friendItem,
        profFilter: function(name){
            return this.where({ profClassify: name});
        }
    });

    
    // 分类的model
    var Classify = Backbone.Model.extend({
        defaults: function() {
            return {
                relList: [],
                profList: []
            }
        },
        addList: function(type, name) {
            var list = type === 'rel' ? this.get('relList') : this.get('profList');
            if (list.indexOf(name) == -1) {
                list.push(name);
            }
        }
    });
    
    var ClassifyModel = Backbone.Model.extend({
        defaults: {
            name:'',
            id:'',
            level: ''
        }
    });
     var ProfClassification =  Backbone.Collection.extend({
        model: ClassifyModel
    });
    var profClassification = new ProfClassification;
    
    var classify = new Classify;
    var Friends=new friendList();
  
   //第一个FriendView
    BAZI.Views.FriendsView = Backbone.View.extend({
        
        id: 'list_friend',

        initialize: function(data) {
            var me = this;
            this.listenTo(Friends, 'addAll', this.addAll);
            this.listenTo(profClassification, 'add', this.renderProfClassifyList);
            this.iPage=new Array();
            this.iPage["zjtj"]=1;
            this.iPage["zjhy"]=1;
            this.iPage["zjsr"]=1;
            this.pagesize=20;    
            this.hasMoreSearchsData=true;
            this.render(data);
            this.initEvent();
        },
        events:{
            "click #zuijintianjia":"zjtj",
            "click #jijiangshengri":"zjsr"
        },
        friend:function(data,ftype){
             var tmp_models = [];
             var me=this;
             var d=data;
             var row=me.iPage[ftype]*me.pagesize;
             if(row>d.count){
                  me.$el.find('.nomore-tips').show();
                  me.hasMoreSearchsData=false;
                  me.showMore.find("span").html("没有更多记录了...");
              }else{
                   me.iPage[ftype]++;
                   me.hasMoreSearchsData=true;
                   me.showMore.show();
              }
              
              d.list.forEach(function(item){
                    var obj=
                            {
                                  fuid:item["fuid"],
                                  favicon:item["upicture"],
                                  name:item["rname"].substr(0,7),
                                  sex:item["igender"]==="0"?"男":"女",
                                  profClassify:(function(){
                                       for(var i=0;i<BAZI.lang.mingju.length;i++)
                                        {
                                            if(BAZI.lang.mingju[i][0]==item["mingju"])
                                            {
                                                return BAZI.lang.mingju[i][1];
                                                break;
                                             }
                                        }
                                  })(),
                                  specialty:"",
                                  relClassify:"",
                                  siZhu:(function() {
                                        var arr = item["siZhu"].split(','),
                                        GanZhiArr = [];
                                        for (var i = 0, len = arr.length; i < len; i += 2) {
                                        GanZhiArr.push(BAZI.lang.tianGan[arr[i]] + BAZI.lang.diZhi[arr[i + 1]]);
                                                    };
                                        return GanZhiArr;
                                        })(),
                                  solarDateStr:item["solar"],
                                  lunarDateStr:item["lunar"],
                                  birthsolar:item["birthsolar"],
                                  birthtime:item["birthtime"]
                            };
                     tmp_models.push(obj);
                });
                var newModels=Friends.add(tmp_models);
                Friends.trigger('addAll',newModels);
        },
        callbackFri:function(ftype){
            var me=this;
            var params={ mkey: BAZI.User.mkey,pn: me.iPage[ftype],ps:me.pagesize};
            if(ftype=="zjhy"){
                BAZI.Api.friend.myfri(params, //成功，但无输出 奇怪
                function(data){
                me.friend(data,ftype);
            });
            }else if(ftype=="zjtj"){
                 BAZI.Api.friend.myfriact(params, 
                 function(data){
                  me.friend(data,ftype);
                });
            }else if(ftype=="zjsr"){
                 BAZI.Api.friend.myfribirlist(params, 
                function(data){
                me.friend(data,ftype);
            });
           }
        },
        zjhy:function(){
            var me=this;
            //最近添加
            Friends.reset(null);
            var ftype="zjhy";
            me.curList.html(ftype);
            me.iPage[ftype]=1;
            me.callbackFri(ftype);
        },
        zjtj:function(){
            $("#qbmj").val("全部命局");
            var me=this;
            Friends.reset(null);
            var ftype="zjtj";
            me.curList.html(ftype);
            me.iPage[ftype]=1;
            me.callbackFri(ftype);
        },
        zjsr:function(){
            $("#qbmj").val("全部命局");
            var me=this;
            Friends.reset(null);
            var ftype="zjsr";
            me.curList.html(ftype);
            me.iPage[ftype]=1;
            me.callbackFri(ftype);
        },
        render: function(data) {
            var html = $.tmpl(BAZI.tpls.tpls_listfriends)({});
            this.$el.html(html).appendTo('#main').siblings().hide();
            this.listBox = this.$el.find('#friend-list-main');
            this.filterListBox = this.$el.find('#friend-list-filter');
            this.profListEl = this.$el.find('#friend-relation');
            this.curList=this.$el.find("#curlist");
            this.showMore=this.$el.find(".nomore-tips");
            this.filterListBox.hide();
            this.initData();
        },
        initData:function(){
                var me = this;
                BAZI.Api.record.getListTitle({}, function(data) {
                if (data.ret !== 0) {
                    BAZI.Dialog.fadeDialog({tip_txt:'请求错误', icon_info:'error'})
                    return;
                }
                BAZI.Common.classify = {
                    relation: {},
                    prof: {}
                };
                data.list[0].forEach(function(item) {
                    BAZI.Common.classify.relation[item[0]] = {
                        name: item[1],
                        level: item[2]
                    };
    
                    classify.addList('rel', {
                        name: item[1],
                        id: item[0],
                        level: item[2]
                    });
                });
                
                data.list[1].forEach(function(item, i) {
                    BAZI.Common.classify.prof[item[0]] = {
                        name: item[1],
                        level: item[2]
                    };
                    var str='<li dataid="+item[0]+"><a href="javascript:;">'+item[1]+'</a></li>';
                    $("#hyfl").append(str);
                    classify.addList('prof', {
                        name: item[1],
                        id: item[0],
                        level: item[2]
                    });
                });
                // BAZI.Common.Jselect("#friend-relation");
            });
            me.zjhy();
        },
        initEvent: function(){
            var me = this;
            me.profListEl.on('click',function(){
                $(this).toggleClass('open');
            });

            me.profListEl.delegate('li', 'click', function(event){
                var name = $(this).children('a').html();
                $('#qbmj .txt').html(name);
                if($(this).data('id')=== 9527){
                   me.listBox.show();
                   me.filterListBox.hide();
                }else{
                    me.filterProfRecordsShow(name);
                }
            });
            
          var itemHeight = 50;
            $(window).scroll(function(e){
                if(me.hasMoreSearchsData ){
                    var height=document.body.scrollTop+ document.documentElement.clientHeight;
                    var item= me.listBox.find('.uibox-list-item:last-child').offset().top + itemHeight;
                    var isBeyond = height> item ;
                    if(item>height){
                        isBeyond=true;
                    }
                    if( isBeyond){
                        var curtype=me.curList.html();
                        me.hasMoreSearchsData=false;
                        me.callbackFri(curtype);
                    }
                }else{
                    $(window).unbind('scroll');
                }
            });
            
        },
         filterProfRecordsShow: function(name){
            var models = Friends.where({profClassify: name});
            if( models.length === 0){
                this.filterListBox.html("<br />该分类下没有记录").show().siblings().hide();
                return;
            }
            var fragment = document.createDocumentFragment();
            models.forEach(function(model){
                var view = new FriendItemView({model: model});
                fragment.appendChild(view.render().el[0]);
            });
            this.filterListBox.empty()[0].appendChild(fragment);
            this.filterListBox.show();
            this.listBox.hide();
        },
         // 下拉表单
         addAll: function(){
            this.listBox.show();
            this.filterListBox.hide();
            var fragment = document.createDocumentFragment();
            Friends.forEach(function(model,idx){
                var view = new FriendItemView({model: model});
                fragment.appendChild(view.render().el[0]);
            });
            this.listBox.empty()[0].appendChild(fragment);
        }
    });
    
    // 每一条记录的view
    var FriendItemView = Backbone.View.extend({
        template: _.template(BAZI.tpls.tpls_friends_item),
        initialize: function() {
            var me = this;
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        render: function() {
            this.el = $('<li class="uibox-list-item  record-list-item"></li>');
            var html = this.template({
                userInfo: this.model.toJSON()
            });
            this.el.html(html);
            this.el.toggleClass('done', this.model.get('done'));
            this.dropDownMenu = this.el.find('.select');
            this.editList = this.el.find('.select-list');
            this.delBtn = this.editList.find('.record-delete');
            this.mpLtn=this.el.find(".record-minli");
            this.mpBtn=this.el.find(".fn-right");
            this.initEvent();
            return this;
        },
         showEditList: function(){
            this.editList.show();
        },
        initEvent: function() {
            var me = this;
            
            this.dropDownMenu.on('mouseover', _.bind(this.showEditList, me) );
            this.dropDownMenu.on('click',function(e){
                e.stopPropagation();
            });
            this.dropDownMenu.on('mouseleave ', function(e){
                e.stopPropagation();
                me.editList.hide();
            });
             this.delBtn.on('click',function(e){
                e.stopPropagation();
                me.confirmDelRecord();
            });
            this.mpBtn.on('click',function(){
                var data = {
                        sDate: me.model.get("birthsolar"),
                        sTime: me.model.get("birthtime"),
                        iGender:me.model.get("sex"),
                        rName: me.model.get("name"),
                        fromFriend:true
                    };
                new BAZI.Views.Paipan(data);
            });
             this.mpLtn.on('click',function(){
                var data = {
                        sDate: me.model.get("birthsolar"),
                        sTime: me.model.get("birthtime"),
                        iGender:me.model.get("sex"),
                        rName: me.model.get("name"),
                        fromFriend:true
                    };
                 new BAZI.Views.Paipan(data);
             });
        },
        remove:function(){
           $(this.el).remove();
        },
        clear: function() {
            this.model.destroy();
        },
        confirmDelRecord: function(){
            var me = this;
            BAZI.Dialog.tipModal({
                icon_info: 'warning',
                tip_txt: '确认删除该好友吗',
                footer: {
                    show: true,
                    btns: [{
                        type: 'submit',
                        txt: "确定",
                        sty: 'primary',
                        callback: function(fnClose) {
                            var fuid=me.model.get("fuid");
                            var params={mkey: BAZI.User.mkey,fuid:fuid};
                            BAZI.Api.friend.fridel(params,function(data){
                                  me.model.destroy();
                                  fnClose();
                            })
                          
                        }
                    }, {
                        type: 'button',
                        txt: "取消",
                        sty: 'default',
                        callback: function(fnClose) {
                            fnClose();
                        }
                    }]
                }
            });
        }
    });
}(BAZI, window);  