var RecordItem = Backbone.Model.extend({
    defaults: function() {
        return {
            uid: 0,
            name: '未命名',
            sex: '女',
            sDate: '1990-10-01',
            time: '17:30:00',
            favicon: '',
            province: '',
            city: '',
            profClassify: -1,
            relClassify: -1,
            done:false
        };
    },

    toggle: function(){
        this.set({done: !this.get('done')})
    }
});

var RecordList = Backbone.Collection.extend({
    model: RecordItem
});

var Records = new RecordList;

var Classify = Backbone.Model.extend({
    defaults: function(){
        return {
            relList: [],
            profList: []
        }
    },

    addList: function(type, name){
        var list = type==='rel'?this.get('relList'): this.get('profList');
        if( list.indexOf(name) == -1 ){
            list.push(name);
        }
                
    }
});

var classify = new Classify;

// 每一条记录的view
var RecordView = Backbone.View.extend({
    template: _.template($('#record-item-templates').html()),
    
    initialize: function() {
        var me = this;
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);

        this.listenTo(this.model, 'change:relClassify', function(model,rel){
            me.changePos.call(me, rel);
        });
        
             
    },
    render: function() {
        this.el = $('<li class="record-item"></li>');
        this.el.html(this.template({item:this.model.toJSON()}));
        this.el.toggleClass('done', this.model.get('done'));
        this.initEvent();
        return this;
    },
    initEvent: function(){
        var me = this;
        this.el.on(supportEvent,function(e){
            
            e.stopPropagation();
            if( e.target.className.toLowerCase() ==='check-td' || e.target.parentNode.className.toLowerCase() ==='check-td'){
                if(e.target.tagName.toLowerCase() ==='label'){
                    me.model.toggle();
                }

                e.stopPropagation();
            }else if(e.target.className.toLowerCase() !=='record-c-hd'){
                var target = e.target.className.toLowerCase().indexOf('record-item')=== -1? $(e.target).parents('.record-item') : $(e.target);
               me.showPaipan.call(me,target); 
            }
            
        });
    },
    toggleDone: function() {
      this.model.toggle();
    },
    clear: function() {
      this.model.destroy();
    },
    changePos:function(rel){

    },
    showPaipan: function(){
        var data = $.extend(this.model.toJSON(),{fromRecord: true});
        BAZI.userData = {};
        $.extend(BAZI.userData, data);
        
        BAZI.router.paipan(data);
    }
});



// 叫recordlist 更准确
var Record = Backbone.View.extend({
    id: 'record',
    events: {
        'click #fast-btn': 'showIndex',
        'click a.Record': 'showRecord',
        'click .Me': 'showMe',
        'click .Class, .Test': 'showTips'
    },
    initialize: function() {
        
        // this.listenTo(Records, 'add', this.addOne);
        this.listenTo(Records, 'reset', this.addAll); 
        this.render();  
    },

    render: function(){
        var html = $.tmpl($('#record-templates').html())();
        $('#viewport').html(html);

        this.dialogEl = $('.record-more-edit');
        this.toggleDialogBtn = $('.a-edit');
        this.addBtn = $('#record-add');
        this.classifyBtn = $('#record-classify');
        this.editBtn = $('#record-edit');
        this.bottomOverlay = $('.bottom-overlay');

        this.recordListBox = $('.record-scroller');
         
        this.initEvent(); 

        this.initData(_.bind(this.renderMore,this) );
    },

    initData: function(cb){
        var renData = []; //渲染所有record的数据
        var me = this;
        var find2 = function(title){

            for (var i=0, len=renData.length; i < len; i++) {
                if(renData[i].title === title){
                    return renData[i].content;
                }
            };

            throw new Error('dont has '+ title+' classifition');
        };
        // 获取分类
        BAZI.Api.record.getListTitle({},function(data){
          
            if( data.ret !== 0){ return;}
            BAZI.Common.classify = {
                relation:{},
                prof: {}
            };

            data.list[0].forEach(function(item){
                BAZI.Common.classify.relation[item[0]] = { name: item[1], level: item[2]};
                renData.push({
                    title: item[1] ,
                    content:[]
                });
                classify.addList('rel', {name: item[1], id: item[0], level: item[2] });
            });
            
            data.list[1].forEach(function(item,i){
                BAZI.Common.classify.prof[item[0]] = { name: item[1], level: item[2]};
                classify.addList('prof', {name: item[1], id: item[0], level: item[2]});
            });

            me.renderMore()
            /******启用关系分类*****/ 
            
            /************/
            BAZI.Api.record.getItem({page: 1},function(data){
             
                if( data.ret !== 0)return;
                /*if( data.more===0){
                    alert('meiyoule');
                    return;
                }*/
                data.aRecords.forEach(function(item){
                    var obj = {
                        uid: item[0],
                        name: item[2],
                        sex: item[3]===0?'男':'女',
                        sDate: item[4],
                        time: item[5],
                        favicon: item[6],
                        province: item[9],
                        city: item[10],
                        profClassify: BAZI.Common.classify.prof[item[7]].name,
                        relClassify: BAZI.Common.classify.relation[item[8]].name,
                        GanZhiInfo: (function(){
                            var arr = item[1].split(','), GanZhiArr=[];
                            for (var i = 0,len=arr.length; i < len; i+=2) {
                                GanZhiArr.push( BAZI.lang.tianGan[arr[i]] + BAZI.lang.diZhi[arr[i+1]] );
                            };
                            return GanZhiArr;
                        })(),
                    };

                    // 启用关系分类
                    var group = find2(obj.relClassify);
                    group.push(obj);
                    
                });
                // debugger;
                Records.trigger('reset',renData);
                // cb &&cb.call(self,renData)
            });

        });
    },

    renderMore: function(renderData){
        // console.log( renderData)
        var html = $.tmpl($('#record-list-templates').html())({relTitle: classify.get('relList')});
        this.recordListBox.empty().hide();
        this.recordListBox.html(html);

        /*var popHtml = $.tmpl($('#record-pop-templates').html())({relClassify: classify.get('relList'), profClassify: classify.get('profList')});
        $('#record').append(popHtml);
        // debugger;
         this.pop = $('.record-pop');
        this.initPopEvent();*/
    },

    initEvent: function(){
        var self = this;
        $('#fast-btn').on(supportEvent,_.bind(this.showIndex,this));
        $('a.Record').on(supportEvent,_.bind(this.showRecord,this));
        $('.Me').on(supportEvent,_.bind(this.showMe,this));
        $('.Class, .Test').on(supportEvent,_.bind(this.showTips,this));
        $('.bottom-overlay').on(supportEvent,_.bind(this.showClassifyPop,this));

        this.toggleDialogBtn.on(supportEvent,_.bind(this.toggleDialog,this) );

        this.editBtn.on(supportEvent, _.bind( this.beEditable, this) );

        this.dialogEl.on(supportEvent, function(){
            $(this).hide();
        });

    },
    initPopEvent: function(){
        var me = this;
        $('.close-pop').on(supportEvent, function(){ me.pop.hide(); });
        $('.record-col-tab').on(supportEvent,function(e){
            me.classifyTab.call(me, $(e.target));
        });
        $('#sub-classify').on(supportEvent, _.bind(this.subClassify,this))
    },

    InitScroll: function(){
        this.myScroll = new IScroll('#record-list-wrapper', { mouseWheel: true,probeType: 3,scrollbars: true,tap: true, bounce: false
        });
        // , click: true ,probeType: 3,scrollbars: true,tap: true, bounce: false
        // document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        this.scrollBox = $('#record-list-wrapper');
        this.renderAreaScroller();
    },
    renderAreaScroller: function(){
        var me = this;

        var txt = this.scrollBox.find('.record-c-hd:first-child').text();
        this.tipEl = $('<div class="fake-title">'+txt+'</div>');
        this.tipEl[0].style.cssText = 'position:absolute; top:0; left:0; width:100%; z-index:5;height: 0.52rem;line-height: 0.55rem;font-size: 0.3rem;background-color: #E7E7E7;padding: 0 0.15rem;'
        this.tipEl.prependTo(this.scrollBox);

        var titlePos = [],selfHeight = this.tipEl.height();

        var getPos = function(y){
            // debugger;
            var boundry = false;
            var data = {
                isBoundry: false,
                txt: txt
            }
            titlePos.forEach(function(title,idx){
                    // debugger;
                    if( Math.abs(y) > Math.abs(title.y) - selfHeight && Math.abs(y)< Math.abs(title.y) ){
                        data.isBoundry = true;
                        data.dis = Math.ceil( Math.abs(title.y) - Math.abs(y) );
                    }
                    if( Math.abs(y) > Math.abs(title.y) ){
                        data.txt = title.txt;

                    }    

            });
            return data;
        }

        this.myScroll.on('scrollStart', function () {
            if( titlePos.length!=0)return;

            me.scrollBox.find('h3:not(:first-child)').each(function(){
                titlePos.push( {'y': $(this)[0].offsetTop*(-1),'txt': $(this).text()} );
            });
        });

        this.myScroll.on('scroll',function(){
            var data = getPos(this.y);
            if( data.isBoundry ){
                me.tipEl.css('top',  Math.floor(30-data.dis) )
            }else{
                me.tipEl.text(data.txt).css('top', 0 )
            }
        });
    },
    toggleDialog: function(){
        if( this.dialogEl.is(':visible') ){
           this.dialogEl.hide();
        }else{
           this.dialogEl.show();
        }
    },
    beEditable: function(){
        this.recordListBox.find('.check-td').show();
        this.bottomOverlay.show();
    },
    
    // 底部按钮
     showRecord: function(){
        /*debugger;
        BAZI.router.record();*/
    },

    showMe: function(){

        if(!BAZI.router.isLogin()){
            return;
        }
        if(!User.isComplete){
            BAZI.router.navigate('#!/pinfo', true);
            return;
        }

        BAZI.Common.showMyInfo();
    },

    showTips: function(){
        BAZI.Common.showTips('敬请期待~');
    },

    showIndex: function(){
        BAZI.router.index();
    },

    showClassifyPop: function(){
        new ClassifyPop();
        /*var choosenEls = $('.record-item:has(input:checked)');
        var modelArr = [];

        choosenEls.each(function(el){
            var udid= $(el).data('udid');
            modelArr.push( Records.findWhere({udid: udid}) );

        })
        this.chooseModel = modelArr;
        this.pop.show();*/
    },

    addOne: function(record){
        // debugger;
        var view = new RecordView({model: record});
        var title = record.get('relClassify');
        $('[data-content='+title+']').append(view.render().el);
    },
    addAll: function(renData){
        renData.forEach(function(list){
            var box =  $('[data-content='+list.title+']');
            var fragment = document.createDocumentFragment();
            list.content.forEach(function(item,idx){
                item.randomId = (Math.random()*100000).toFixed(0);
                var model = new RecordItem(item);
                Records.add(model);
                var view = new RecordView({model: model});
                fragment.appendChild(view.render().el[0])
            })
            box[0].appendChild(fragment);
        });
        this.recordListBox.show();
        this.InitScroll();
        
    },
    classifyTab: function(target){
        target.addClass('on').siblings().removeClass('on');
        var type = target.data('classify');
        this.pop.find('[data-content='+type+']').show().siblings().hide();
    },

    /*subClassify: function(){
        var rtype  = $('.record-class-wrap:visible').data('content') === 'rel'? 0:1;
        var relId  = $('.record-class-wrap:visible input:checked').data('id');
        var choosenModels = Records.where({done:true});
        var udids= [];
        var me = this;
        choosenModels.forEach(function(model){
            udids.push(model.get('udid'));
            console.log(model.get('name'))
        });

        BAZI.Api.record.moveRelation({
            udids: udids.join(','),
            rtype: rtype,
            relation: relId,
        },function(data){
            if(data.ret === 0){
                alert('转换成功');
            }
            me.bottomOverlay.hide();
            me.pop.hide();
            me.initData();
        })
        // console.log(choosenModels[0].get('name'))
    }*/
});

var ClassifyPop = Backbone.View.extend({
    className: 'record-pop',
    events: {
        // "click .close-pop": "distory"
    },
    template: _.template($('#record-pop-templates').html()),
    initialize: function(){
        this.render();
        this.initEvent();
    },
    render: function(){
        var popHtml = _.template($('#record-pop-templates').html())({relClassify: classify.get('relList'), profClassify: classify.get('profList')});
        // var el = this.template({relClassify: classify.get('relList'), profClassify: classify.get('profList')});
        $('#record').append(popHtml);
        this.pop = $('.record-pop').show();
    },
    initEvent: function(){
        var me = this;
        $('.close-pop').on(supportEvent, function(){ me.pop.hide(); });
        $('.record-col-tab').on(supportEvent,function(e){
            me.classifyTab.call(me, $(e.target));
        });
        $('#sub-classify').on(supportEvent, _.bind(this.subClassify,this))
    },
    subClassify: function(){
        var rtype  = $('.record-class-wrap:visible').data('content') === 'rel'? 0:1;
        var relId  = $('.record-class-wrap:visible input:checked').data('id');
        var choosenModels = Records.where({done:true});
        var udids= [];
        var me = this;
        choosenModels.forEach(function(model){
            udids.push(model.get('udid'));
            console.log(model.get('name'))
        });

        BAZI.Api.record.moveRelation({
            udids: udids.join(','),
            rtype: rtype,
            relation: relId,
        },function(data){
            if(data.ret === 0){
                alert('转换成功');
            }
            $('.bottom-overlay').hide();
            me.pop.remove();
            BAZI.Views.Record.initData();
        })
        // console.log(choosenModels[0].get('name'))
    }
})