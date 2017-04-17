;(function(win, BAZI) {
    // 事件
    var EventModel = Backbone.Model.extend({
        defaults: {
            //事件id
            evid: '',
            //日期
            date: '',
            //时间
            time: '',
            //事件详细
            thing:'',
            //标签名
            label: '',
            //年干支
            yearGanZhi: ''
        },
        saveData: function(){

        },
        delData: function(){
            var me = this;
            BAZI.Api.ievents.del({
                evid:this.get('evid')
            },function(data){
                if(data.ret === 0){
                    me.destroy();
                }
            });
        }  
    });

    var EventModelList = Backbone.Collection.extend({
        model: EventModel
    });
    var eventModelList = new EventModelList;


    //事件模块view
    BAZI.Views.Events = Backbone.View.extend({
        template: $.tmpl(BAZI.tpls.tpls_shijian),
        events:{
            'click .btn[name=relation]':'select_relative',
            'click .dropdown-menu li a':'option_relative',
            'click .bazi-uibtn-s:contains(添加)':'add_event',
            'keyup input[name=add_classify]':'keyup_add_classify',
            'click .dropdown .bazi-uibtn-s':'add_classify',
            'click .h3-hd .add':'add_toggle',
            'click .bazi-uibtn-s-default:contains(取消)':'add_toggle'
        },
        add_toggle:function(isShow){
            if(isShow === true){
                this.$('.from-modal').show();
                return;
            }else if(isShow === false){
                this.$('.from-modal').hide();
            }


            if(this.$('.from-modal').is(':visible')){
                this.$('.from-modal').slideUp(200);
            }else{
                this.$('.from-modal').slideDown(200);
            }
        },
        add_flag : false,
        add_event:function(){

            var checks = this.$('form#form-thing').validate({
                rules:{
                    things:{
                        required:true
                    }
                },
                messages:{
                    things:{
                        required:'请输入事件简述'
                    }
                }
            });

            if(!checks.form()){
                return;
            }

            //反复点击添加，但上一次还为提交成功
            if(this.add_flag === true){
                return;
            }

            this.add_flag = true;


            var me = this;
            BAZI.Api.ievents.add({
                udid:me.udid,
                labname:this.$('button[name=relation] .txt').text(),
                evdate:this.times.evdate,
                evtime:this.times.time,
                info:me.$('.input-control').val()
            },function(data){
                me.getEvents();
                this.$('textarea[name=things]').html('').val('');
                me.add_flag = false;
            });
        },
        add_classify:function(event){

            jQuery.validator.addMethod("labelName", function(value, element) {
                    var reg = /[^\d\w\_\u4E00-\u9FA5\uF900-\uFA2D]/g;
                    return this.optional(element) || (!reg.test(value));
                },
            "输入不正确");

            var ints = this.$('form.add_classify input[name=add_classify]');
            ints.val($.trim(ints.val()));


            var checks = this.$('form.add_classify').validate({
                rules:{
                    add_classify:{
                        required:true,
                        labelName:true
                    }
                },
                messages:{
                    add_classify:{
                        required:'请输入分类名'
                    }
                }
            });

            if(!checks.form()){
                return;
            }

            var dropdown = $(event.currentTarget).closest('.dropdown');
            dropdown.find('.txt').text(ints.val());
            dropdown.removeClass('open');


        },
        keyup_add_classify:function(event){
            var i = event.currentTarget;
            var str = $(i).val();
            str = $.trim(str);
            $(i).val(str);
            if(str.length===0){
                $(i).parent().next().hide();
            }else{
                $(i).parent().next().show();
            }
        },
        select_relative:function(event){
            var btn = $(event.currentTarget);
            btn.parent().addClass('open');
            var ul = btn.next();
            var id = Math.random().toString().slice(2);
            setTimeout(function(){
                $(window).on('click.'+id,function(e){
                    if(btn[0] === e.target || btn.has(e.target).length>=1 || ul[0] === e.target || ul.has(e.target).length>=1){
                        return;
                    }
                    if(btn.parent().hasClass('open')){
                        btn.parent().removeClass('open');
                    }
                    $(window).off('click.'+id);
                });
            },10);
        },
        option_relative:function(event){
            var link = event.currentTarget;
            if($(link).parent().hasClass('add-class-func')){
                $(link).find('input').trigger('focus');
                return;
            }else{
                var box = $(link).closest('.dropdown');
                box.find('.txt').html(link.innerHTML);
                box.removeClass('open');
            }
        },
        id:'shijian',
        initialize:function(data){
            var me = this;
            this.listenTo(eventModelList,'my_remove',function(){
                if(eventModelList.length === 0){
                    me.add_toggle(true);
                }
            });
            this.udid = data.udid;
            this.render();
            this.getEvents();
        },

        //渲染事件
        renderEvents:function(){
            var tbody = $('<tbody></tbody>');
            eventModelList.each(function(model){
                var eventItem = new EventItemView({model:model});
                tbody.append(eventItem.el);
            });
            this.$('.event-list').html(tbody);
        },

        //得到事件
        getEvents:function(){

            var me = this;

            BAZI.Api.ievents.get({udid:this.udid},function(data){
                _.invoke(eventModelList.toArray(),'destroy');

                data.list.forEach(function(elm){
                    var yearGanZhi = BAZI.lang.tianGan[elm[5]]+BAZI.lang.diZhi[elm[6]];
                    var model = new EventModel({
                        //事件id
                        evid: elm[0],
                        //日期
                        date: elm[1],
                        //时间
                        time: elm[2],
                        //事件详细
                        thing:elm[3],
                        //标签名
                        label: elm[4],
                        //年干支
                        yearGanZhi: yearGanZhi
                    });
                    eventModelList.add(model);
                });

                if(eventModelList.length === 0){
                    me.add_toggle(true);
                }

                me.renderEvents();

            });
        },

        //渲染
        render:function(){
            this.el.innerHTML = this.template();
            var me = this;
            new BAZI.calCtrlBar({
                oBoxEl: this.$('.time-selecter'),
                activeClass: 'cur',
                hasGanZhi:false,
                updateDate: function(data){
                    function f(s){
                        s = s.toString();
                        return s.length === 1?'0'+s:s;
                    }
                    me.times = {
                        //日期
                        evdate:[data.year,f(data.month),f(data.day)].join('-'),
                        //时间
                        evtime:[f(data.hour),f(data.min),f(data.second)].join(':'),
                        //年干支
                        GanZhiYear:data.GanZhiYear

                    };
                }
            });
        }
    });


    //每条事件的view
    var EventItemView = Backbone.View.extend({
        tagName:'tr',
        template: $.tmpl(BAZI.tpls.tpls_shijian_item),
        initialize: function(){
            var me = this;
            this.listenTo(this.model, 'destroy', function(){
                me.$el.fadeOut(300,function(){
                    me.remove();
                    eventModelList.trigger('my_remove');
                })
            });

            this.render();

        },
        events:{
            //删除事件
            'click .bazi-uibtn-mini-w':'del'
        },
        render: function(){
            this.$el.html(this.template({event: this.model.toJSON()}));
            return this;
        },
        del:function(){
            this.model.delData();
        }
    });




    // 六亲模块

    BAZI.Views.Liuqin = Backbone.View.extend({
        events:{
            'click .btn[name=relation]':'select_relative',
            'click .dropdown-menu li a':'option_relative',
            'click .bazi-uibtn-s:contains(添加)':'add_liuqin',
            'click .h3-hd .add':'add_toggle',
            'click .bazi-uibtn-s-default:contains(取消)':'add_toggle'
        },
        add_toggle:function(isShow){
            if(isShow === true){
                this.$('.from-modal').show();
                return;
            }else if(isShow === false){
                this.$('.from-modal').hide();
            }

            if(this.$('.from-modal').is(':visible')){
                this.$('.from-modal').slideUp(200);
            }else{
                this.$('.from-modal').slideDown(200);
            }
        },
        id:'liuqin',

        //得到六亲
        getLiuqin:function(){

            var me = this;

            var relative = [
                {id:301,w:"妻",W:"妻子"},
                {id:302,w:"夫",W:"丈夫"},
                {id:303,w:"母",W:"母亲"},
                {id:304,w:"父",W:"父亲"},
                {id:305,w:"女",W:"女儿"},
                {id:306,w:"子",W:"儿子"},
                {id:307,w:"姐",W:"姐姐"},
                {id:308,w:"弟",W:"弟弟"},
                {id:309,w:"妹",W:"妹妹"},
                {id:310,w:"兄",W:"哥哥"}
            ];


            BAZI.Api.liuqin.get({udid:this.udid},function(data){
                _.invoke(liuqinList.toArray(),'destroy');

                data.list.forEach(function(e){
                    e.birthsolar = e.birthsolar.split('-');
                    e.birthtime = e.birthtime.split(':');

                    e.ganzhi = BAZI.utilities.getDateData({
                        year: parseInt(e.birthsolar[0],10),
                        month: parseInt(e.birthsolar[1],10),
                        day: parseInt(e.birthsolar[2],10),
                        hour: parseInt(e.birthtime[0],10),
                        min: parseInt(e.birthtime[1],10)
                    });


                    e.birthtime = e.birthtime.join(':');

                    e.birthsolar = e.birthsolar[0]+'年'+e.birthsolar[1]+'月'+e.birthsolar[2]+'日 ';

                    var mingju = e.mingju;
                    e.mingju = BAZI.lang.mingju.filter(function(e){
                        if(e[0] === parseInt(mingju)){
                            return true;
                        }
                    })[0][1];

                    e.relation = (function(){
                        var str = '';
                        var id = e.relation;
                        _.each(relative,function(obj){
                            if(str){
                                return;
                            }
                            if(obj.id === parseInt(id)){
                                str = obj.w;
                            }
                        });
                        return str;
                    }());


                    var model = new LiuqinModel(e);
                    liuqinList.add(model);
                });

                if(liuqinList.length === 0){
                    me.add_toggle(true);
                }

                me.renderLiuqins();
            });
        },

        initialize:function(data){
            var me = this;
            this.listenTo(liuqinList,'my_remove',function(){
                if(liuqinList.length === 0){
                    me.add_toggle(true);
                }
            });
            this.template = $.tmpl(BAZI.tpls.tpls_liuqin);
            this.render();
            this.udid = data.udid;
            this.getLiuqin();


        },
        render:function(){
            this.el.innerHTML = this.template();
            var me = this;
            new BAZI.calCtrlBar({
                oBoxEl: this.$('.time-selecter'),
                activeClass: 'cur',
                hasGanZhi:false,
                updateDate: function(data){
                    function f(s){
                        s = s.toString();
                        return s.length === 1?'0'+s:s;
                    }
                    me.times = {
                        //日期
                        birthsolar:[data.year,f(data.month),f(data.day)].join('-'),
                        //时间
                        birthtime:[f(data.hour),f(data.min),f(data.second)].join(':')

                    };
                }
            });
        },
        renderLiuqins:function(){
            var ul = $('<ul class="family-list clearfix"></ul>');
            liuqinList.each(function(model){
                var liuqinItem = new LiuqinItemView({model:model});
                ul.append(liuqinItem.el);
            });
            this.$('.family-list-box').html(ul);
        },
        select_relative:function(event){
            var btn = $(event.currentTarget);
            btn.parent().addClass('open');
            var ul = btn.next();
            var id = Math.random().toString().slice(2);
            setTimeout(function(){
                $(window).on('click.'+id,function(e){
                    if(btn[0] === e.target || btn.has(e.target).length>=1){
                        return;
                    }
                    if(btn.parent().hasClass('open')){
                        btn.parent().removeClass('open');
                    }
                    $(window).off('click.'+id);
                });
            },10);
        },
        option_relative:function(event){
            var link = event.currentTarget;
            var box = $(link).closest('.dropdown');
            box.find('.txt').html(link.innerHTML).data('id',$(link).data('id'));
        },
        add_liuqin:function(){
            var checks = this.$('form#form-name').validate({
                rules:{
                    liuqin_name:{
                        required:true
                    }
                },
                messages:{
                    liuqin_name:{
                        required:'请输入姓名'
                    }
                }
            });

            if(!checks.form()){
                return;
            }

            //反复点击添加，但上一次还为提交成功
            if(this.add_flag === true){
                return;
            }

            this.add_flag = true;

            var me = this;
            BAZI.Api.liuqin.add({
                udid:this.udid,
                rname:$.trim(this.$('input[name=liuqin_name]').val()),
                relationid:this.$('.btn[name=relation]').find('.txt').data('id'),
                birthsolar:this.times.birthsolar,
                birthtime:this.times.birthtime
            },function(data){
                me.add_flag = false;
                me.getLiuqin();
                me.$('input[name=liuqin_name]').val('');
            });
        }

    });



    var LiuqinModel = Backbone.Model.extend({
        defaults: {
            relation: '',
            udid: '',
            uid: '',
            mingju: '',
            rname: '',
            igender: '',
            birthsolar: '',
            birthlunar: '',
            birthtime: '',
            upicture:''
        },
        addData: function(){

        },
        delData: function(){
            var me = this;
            BAZI.Api.liuqin.del({
                udids:this.get('udid')
            },function(data){
                if(data.ret === 0){
                    me.destroy();
                }
            });
        }
    });


    //每个六亲的view
    var LiuqinItemView = Backbone.View.extend({
        tagName:'li',
        className:'family-list-item',
        template: $.tmpl(BAZI.tpls.tpls_liuqin_item),
        initialize: function(){
            var me = this;
            this.listenTo(this.model, 'destroy', function(){
                me.$el.fadeOut(300,function(){
                    me.remove();
                    liuqinList.trigger('my_remove');
                })
            });
            this.render();

        },
        events:{
            //删除事件
            'click .family-delete':'del'
        },
        render: function(){
            this.$el.html(this.template({liuqin: this.model.toJSON()}));
            return this;
        },
        del:function(){
            this.model.delData();
        }
    });
    
    var LiuqinList = Backbone.Collection.extend({
        model: LiuqinModel,
        fetchData: function(){

        }
    });
    var liuqinList = new LiuqinList;

    // *******评论区域***********
    var FirstComment = BAZI.Models.FirstComment = Backbone.Model.extend({
        defaults: {
            cid:'',
            subjectid: '',
            content: '',
            createtime: '',
            uid: '',
            parentid: '0',
            upicture: '',
            depth: '0',
            replyNum: 0,
            z_count: 0,
            selfiszan: false
        },
        initialize: function(){
            var me = this;
            this.on('_destroy', function(success){
                BAZI.Api.comment.del({cid: me.get('cid')}, function(){
                    me.destroy();
                    success && success();
                });
            });
        },
        fetchData: function(success){
            var me = this;
            BAZI.Api.comment.add({
                content: this.get('content'),
                subjectid: mingliAnalysis.get('did'),
                parentid: '0',
                ftype: '0'
            },function(data){
                if( data.ret === 0){
                    me.set({
                        'cid': data.cid,
                        'createtime': BAZI.Common.getCurTimeStr()
                    
                    });
                    success && success(me);
                }
            });
        },
        addPraise: function(){
            var me = this;
            if( this.get('selfiszan'))return;
            BAZI.Api.praise.add({
                subjectid: me.get('cid'),
                ftype: '2'
            }, function(){
                var z_count = parseInt(me.get('z_count'));
                me.set('z_count', ++z_count);
                me.set('selfiszan', true);

            })
        },
        cancelPraise: function(){
            var me = this;
            if( !this.get('selfiszan')){
                throw new Error('这条记录没有赞，不能取消赞');
            };
            BAZI.Api.praise.revert({
                subjectid: me.get('cid'),
                ftype: '2'
            }, function(){
                var z_count = parseInt(me.get('z_count'));
                me.set('z_count', --z_count);
                me.set('selfiszan', false);
            });
        }
    });

    var SecondComment = BAZI.Models.SecondComment = Backbone.Model.extend({
        defaults: {
            cid: '',
            parentid: '-1',
            uid: '',
            upicture: '',
            rname: '',
            content: '',
            subjectid: '',
            depth: '1',
            z_count: 0,
            replyNum: 0,
            selfiszan: false
        },
        initialize: function(){
            var me = this;
        },
        fetchData: function(parentid, success){
            var me = this;
            BAZI.Api.comment.add({
                content: this.get('content'),
                subjectid: mingliAnalysis.get('did'),
                parentid: parentid
            },function(data){

                if( data.ret === 0){
                    me.set({
                        'cid': data.cid,
                        'createtime': BAZI.Common.getCurTimeStr()
                    });
                    success && success(me);
                }
            });
        },
        _destroy: function(opts, success){
            // debugger;
            var me = this;
            if (opts.fromServer) {
                BAZI.Api.comment.del({
                    cid: me.get('cid')
                }, function() {
                    me.destroy();
                    success && success();
                });
            } else {
                me.destroy();
                success && success();
            }
        },
        addPraise: function(){
            var me = this;
            if( this.get('selfiszan'))return;
            BAZI.Api.praise.add({
                subjectid: me.get('cid'),
                ftype: '2'
            }, function(){
                
                var z_count = parseInt(me.get('z_count'));
                me.set('z_count', ++z_count);
                me.set('selfiszan', true);
            })
        },
        cancelPraise: function(){
            var me = this;
            if( !this.get('selfiszan')){
                throw new Error('这条记录没有赞，不能取消赞');
            };
            BAZI.Api.praise.revert({
                subjectid: me.get('cid'),
                ftype: '2'
            }, function(){
                var z_count = parseInt(me.get('z_count'));
                me.set('z_count', --z_count);
                me.set('selfiszan', false);
            });
        }
    });

    var FirstCommentList = Backbone.Collection.extend({
        model: FirstComment
    });
    var FirstComments = new FirstCommentList;

    var SecondCommentList = Backbone.Collection.extend({
        model: SecondComment
    });
    var SecondComments = new SecondCommentList;

    var CommentItemView = BAZI.FN_Views.CommentItemView = Backbone.View.extend({
        className: 'comment-item',
        events: {
            "click .comment-item-praise": "togglePraise",
            "mouseover .comments-hd": "showDelBtn",
            "mouseout .comments-hd": "hideDelBtn"

        },

        template: _.template(BAZI.tpls.tpls_discuss_comment_item),
        initialize: function(){
            this.listenTo(this.model,'remove', this._remove);
            this.listenTo(this.model,'change:replyNum', this.updateReplyNum);
            this.listenTo(this.model,'change:selfiszan', this.updateZan);
        },
        render: function(){
            var obj = this.model.toJSON();
            obj.hasReply = obj.parentid === '0';

            var html = this.template({data: obj});
            if( this.model.get('parentid') === '0'){
                this.$el.addClass('discuss-first-comment-item');
            }else{
                this.$el.addClass('discuss-second-comment-item');
            }
            this.$el.html(html)
                .attr('data-cid', this.model.get('cid'));
            this.zanCounter = this.$el.find('.mingli-comment-zan-count');
            //this.zanMark = this.$el.find('.mingli-comment-zan-mark');
            this.zanMark = this.$el.find('.mingli-comment-zan');
            if( this.model.get('selfiszan') ){
                this.zanMark.addClass('yes');
            }
            // this.togglePraise();
            return this;
        },
        _remove: function(){
            this.remove();
        },
        togglePraise: function(e){
            var isZan = this.model.get('selfiszan');
            if(isZan){
                this.zanMark.removeClass('yes').addClass('no');
                this.model.cancelPraise();
            }else{
                this.zanMark.removeClass('no').addClass('yes');
                this.model.addPraise();
            }
        },
        updateReplyNum: function(model, attr){
            this.$el.find('.comment-reply-count').html(attr);
        },
        updateZan: function(model, attr){
    
            this.zanCounter.html(model.get('z_count'));
        },
        showDelBtn: function(){
            this.$el.find('.del-comment-item').show();
        },
        hideDelBtn: function(){
            this.$el.find('.del-comment-item').hide();
        }
    });


    // *****  评论块model, 在这里对所有的评论进行操作  *******
    var BlockCommentModel = BAZI.Models.BlockCommentModel = Backbone.Model.extend({
        initialize: function(){
            var me = this;

            this.on('destroy',function(){
                var firstComment = FirstComments.findWhere({cid: me.get('firstCid') });
                if( firstComment === undefined){
                    throw Error('评论块model的firstComment找不到,firstCid是'+me.get('firstCid') );
                }
                // debugger;
                firstComment.trigger('_destroy', function(){
                    // alert(1)
                });
                // debugger;
                _.invoke(SecondComments.where({parentid: me.get('firstCid')}), "_destroy", {fromServer: false});
                
            });

            this.on('removeSecond',function(opts){
                var me = this;
                var secondComment = SecondComments.findWhere({cid: opts.cid});
                if( secondComment === undefined){
                    throw Error('评论块model的secondComment找不到,cid是'+opts.cid );
                }
                var parentid = secondComment.get('parentid');

                secondComment._destroy({fromServer: true}, function(){
                    var firstComment = FirstComments.findWhere({cid: parentid});
                    var replyNum = parseInt( firstComment.get('replyNum') );
                    firstComment.set({replyNum: --replyNum});

                    var arr = me.get('secondCids').split(',');
                    var newArr = _.reject(arr, function(num){
                        return num === opts.cid
                    });
                    me.set('secondCids', newArr.join(','));
                })
                    
            });

            this.on('_request_', function(opts){
                FirstComments.add(opts.firstComment);
                SecondComments.add(opts.secondComments);
                BAZI.Api.praise.getList({
                    subjectid: mingliAnalysis.get('did'),
                    ftype: '1'
                }, function(data){

                });
            });
        },
        defaults: {
            firstCid: '',
            secondCids: ''
        },
        createSecondComment: function(opts){
            var me= this;
            var secondComment = new SecondComment({
                content: opts.content
            });
            secondComment.fetchData(this.get('firstCid'), function(model){
                model.set({
                    'rname': BAZI.User.rname,
                    'parentid': me.get('firstCid')
                });
                SecondComments.add(model);

                var firstComment = FirstComments.findWhere({cid: me.get('firstCid')});
                var replyNum = parseInt( firstComment.get('replyNum') );
                firstComment.set({replyNum: ++replyNum});

                var newCid = model.get('cid');
                me.set('secondCids', me.get('secondCids')+','+newCid );
            });
        },
        createData: function(content, cb){
            var me = this;
            var firstComment = new FirstComment({content: content, rname: BAZI.User.rname});
            firstComment.fetchData(function(model){
                // 自己添加的一条评论  是可以删除的
                model.set('candel', true);
                FirstComments.add(model);
                me.set('firstCid', model.get('cid') );
                cb &&cb(me);
            });

        }
    });

    // 评论块model的collection
    var BlockCommenList =  Backbone.Collection.extend({
        model: BlockCommentModel
    });
    var BlockComments = new BlockCommenList;

    // 评论块view
    var BlockCommentView = BAZI.FN_Views.BlockCommentView =  Backbone.View.extend({
        className: 'comments-item',
        events: {
            "click .comment-item-reply": "showReplyForm",
            "click .discuss-first-comment-item .del-comment-item": "removeFirstComment",
            "click .discuss-second-comment-item .del-comment-item": "removeSecondComment",
            "click .second-comment-reply-btn": "reply"
        },
        initialize: function(){
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change:secondCids', this.toggleSecondView);
            this.render();
        },
        render: function(){
            var me = this;
            var firstCid = this.model.get('firstCid');
            if( firstCid === undefined){
                throw Error('blockComment里找不到这个cid')
            }
            var firstView = new CommentItemView( { model: FirstComments.findWhere({cid: firstCid}) } );

            firstView.render().$el.appendTo(this.$el);

            if(this.model.get('secondCids') !== ''){
                var secondModels = SecondComments.where({parentid: firstCid});
                secondModels.forEach(function(model){
                    var secondView = new CommentItemView({model: model});
                    secondView.render().$el.appendTo(me.$el);
                });
            }
                

            this.replyInput = this.$el.find('.comment-reply-form textarea');
        },
        showReplyForm: function(){
            if( mingliAnalysis.get('done')){
                this.$('.comment-reply-form').show().find('textarea').focus();

            }
        },
        removeFirstComment: function(){
            // this.remove();
            // debugger;
            this.model.destroy();

        },
        removeSecondComment: function(e){
            var secondCid = $(e.currentTarget).parents('.discuss-second-comment-item').data('cid')+'';
            this.model.trigger('removeSecond', {cid: secondCid, fromServer: true});
        },
        appendSecondComment: function(){

        },
        toggleSecondView: function(model, attr){
            // debugger;

            var previousAttr = model.previous('secondCids'); 
            if( attr.length > previousAttr.length  ){
                var index = parseInt(attr.lastIndexOf(','));
                index++;
                var cid = attr.slice(index);
                var renderModel = SecondComments.findWhere({cid: cid});
                renderModel.set('candel',true);
                var commentView = new CommentItemView({ model:renderModel });
                commentView.render().$el.appendTo(this.$el);
            }else{
                var index = parseInt(previousAttr.lastIndexOf(','));
                index++;
                var cid = previousAttr.slice(index);
                this.$el.find('[data-cid='+cid+']').remove();
            }

            this.replyInput.val('');
            this.$('.comment-reply-form').hide();

        },
        reply: function(e){
            
            var val = $(e.currentTarget).siblings('textarea').val();
            this.model.createSecondComment({content: val});
            
            
        }
    });
    // 评论列表的view
    var CommentListView = BAZI.FN_Views.CommentListView =  Backbone.View.extend({
        className: 'topic-comments',
        initialize: function(udid){
            this.listenTo(BlockComments, '_request_', _.bind(this.addAll,this)  );
            this.listenTo(BlockComments, 'add', _.bind(this.addOne,this)  );
            // this.fetchData( udid, _.bind(this.render,this) );
        },
        addOne: function(model){
            // debugger;
            var bundleView = new BlockCommentView({model: model});
            bundleView.$el.prependTo(this.$el);
        },
        addAll: function(){
            var me = this;
            BlockComments.forEach(function(model, idx) {
                if( model === undefined){
                    throw Error('model isundefined，index is'+ idx);
                }
                var bundleView = new BlockCommentView({model: model});
                // console.log( bundleView.$el.html())
                bundleView.$el.appendTo(me.$el);
            });
        },

        fetchData: function(did, cb){
            var me = this;
            BAZI.Api.comment.getList({
                subjectid: did
            }, function(data) {
                // debugger;
                
                var data = data.list;
                if( data === null){
                    data = [];
                }
                var needExtendAttrs = ["cid", "parentid", "uid", "upicture","selfiszan", "rname", "content", "subjectid", "candel", "z_count","createtime"];
                for (var i = 0, len = data.length; i < len; i++) {
                    var firstObj = {};
                    needExtendAttrs.forEach(function(attr) {
                        firstObj[attr] = data[i][attr];
                    });
                    firstObj.replyNum = 'children' in data[i]? data[i].children.length: 0;
                    firstObj.createtime =  BAZI.Common.transUnixTimeToDateStr(data[i].createtime);
                    var len2 = ( 'children' in data[i] )? data[i].children.length: 0;
                    var secondCids = [], secondObjs = [];

                    for (var j = 0; j < len2; j++) {
                        var obj2 = {};
                        needExtendAttrs.forEach(function(attr) {
                            obj2[attr] = data[i].children[j][attr];
                        });
                        obj2.createtime =  BAZI.Common.transUnixTimeToDateStr(data[i].children[j].createtime);
                        secondCids.push(obj2.cid);
                        secondObjs.push(obj2);
                    }

                    var blockCommentModel = new BlockCommentModel({});
                    blockCommentModel.set('firstCid', firstObj.cid);
                    blockCommentModel.set({'secondCids': secondCids.join(',')}, {silent: true} );
                    blockCommentModel.trigger('_request_',{firstComment: firstObj, secondComments: secondObjs});
                    BlockComments.add(blockCommentModel, {silent: true});
                }
                BlockComments.trigger('_request_');
                cb && cb(me.$el);

            });
        }
    });

    //  命理分析model
    var MingliAnalysis = BAZI.Models.MingliAnalysis =  Backbone.Model.extend({
        defaults: {
            upicture: BAZI.User.upicture,
            rname: BAZI.User.rname,
            createtime: '',
            content: '',
            did: '',
            subjectid: '',
            authorit:'1',
            createtime: '',
            uid: '',
            selfiszan: false,
            z_count: 0,
            p_count: 0,
            // 是否有自评
            done: false
        },
        validate: function(){
        },
        delData: function(){
            var me = this;
            BAZI.Api.discuss.del({did: this.get('did')}, function(data){
                if( data.ret === 0 ){
                    me.set({
                        done: false,
                        z_count: 0
                    });
                }
            });
        },
        addData: function(opts){
            var me = this;
            this.set('authorit',opts.authorit);
            this.set({content: opts.content}, {validate: true});
            BAZI.Api.discuss.add(opts, function(data){
                if(data.ret === 0){
                    me.set({
                        done: true,
                        did: data.did,
                        createtime: BAZI.Common.getCurTimeStr()

                    });
                }
            });
        },
        fetchData: function(udid, successCB){
            var me = this;
            // debugger;
            BAZI.Api.discuss.getone({subjectid: udid}, function(data){
                if( data.ret === 0){
                    if( data.info !== null){
                        var json = _.clone(data.info);
                        json.done = true;
                        json.createtime = BAZI.Common.transUnixTimeToDateStr(json.createtime);
                        me.set(json,{silent: true});
                        successCB(data.info);
                    }
                }
                me.trigger('_request_');
            });
        },
        addPraise: function(success){
            var me = this;
            if( this.get('selfiszan'))return;
            BAZI.Api.praise.add({
                subjectid: me.get('did'),
                ftype: '1'
            }, function(){
                var z_count = parseInt(me.get('z_count'));
                me.set('z_count', ++z_count);
                me.set('selfiszan', true);
                success && success();
            });
        },
        cancelPraise: function(){
            var me = this;
            if( !this.get('selfiszan')){
                throw new Error('这条记录没有赞，不能取消赞');
            };
            BAZI.Api.praise.revert({
                subjectid: me.get('did'),
                ftype: '1'
            }, function(){
                var z_count = parseInt(me.get('z_count'));
                me.set('z_count', --z_count);
                me.set('selfiszan', false);
            });
        }
    });
    mingliAnalysis = new MingliAnalysis;

    var MingliAnalysisView = BAZI.FN_Views.MingliAnalysisView = Backbone.View.extend({
        className: 'discuss-analyze',
        template: _.template(BAZI.tpls.tpls_discuss_mingli_analysis),
        events: {
            "click .mingli-analysis-zan": "togglePraise",
            "click .dropdown-toggle": "showMenu",
            "click .mingli-authorit-item": "closeMenu"
        },
        initialize: function(){
            this.listenTo(this.model, '_request_', this.render);
            this.listenTo(this.model, 'change:selfiszan', this.updataPraise);
            this.listenTo(this.model, 'change:z_count', this.updataReplyNum);
            this.listenTo(this.model, 'change:done', this.appendContent);

            this.listenTo(FirstComments, 'add', this.updateReplyNum);
            this.listenTo(FirstComments, 'remove', this.updateReplyNum);
            // this.render();
        },
        render: function(){
            var html = this.template({data: this.model.toJSON()});
            this.$el.html(html);
            
            this.publishInfo = this.$el.find('.analysis-publish-info');
            this.contentEl =  this.$el.find('.analysis-content-area');
            this.delBtn =  this.$el.find('.mingli-del-btn');
            this.publishBtnGroup =  this.$el.find('.analysis-btn-box');
            this.zanReplyGroup = this.$el.find('.comment-title');
            this.replyForm = this.$el.find('.first-comment-reply-form');
            this.zanMark = this.$el.find('.mingli-analysis-zan-mark');
            this.appendContent();
            this.btnEl = this.$el.find('.bazi-uibtn-m');
            this.zanCounter = this.$el.find('.mingli-analysis-zan-count');
            return this;
        },
        appendContent: function(){
            var hasAnalysis = this.model.get('done');
            if(hasAnalysis){
                this.delBtn.show();
                this.publishBtnGroup.hide();
                this.zanReplyGroup.show();
                this.replyForm.show();
                this.publishInfo.show().find('.analysis-create-time').html(this.model.get('createtime'));
                this.contentEl.html( this.model.get('content') );
            }else{
                this.delBtn.hide();
                this.publishBtnGroup.show();
                this.zanReplyGroup.hide();
                this.replyForm.hide();
                this.publishInfo.hide();
                this.contentEl.html( '<textarea class="form-control" placeholder="添加命理分析"></textarea>' );
            }
        },
        togglePraise: function(e){
            if( this.model.get('selfiszan')){
                this.model.cancelPraise();
                $(e.currentTarget).removeClass('yes');
            }else{
                this.model.addPraise();
                $(e.currentTarget).addClass('yes');

            }
        },
        updataPraise: function(model, attr){
            this.zanCounter.html(model.get('z_count'));
        },
        updateReplyNum: function(){
            var num = FirstComments.length;
            this.$el.find('.mingli-analysis-reply-count').html(num);
        },
        showMenu: function(e){
            $(e.currentTarget).siblings('.dropdown-menu').show();
        },
        closeMenu: function(e){
            var authorit = $(e.currentTarget).data('authorit');
            this.model.set('authorit',authorit );
            var html = $(e.currentTarget).text();
            $(e.currentTarget).parent().hide()
                .siblings('button').find('.txt').html(html);
        }
    });

    var LocalView = BAZI.Views.Discussion= Backbone.View.extend({
        el: '.detailRecord#detailRecord',
        events: {
            'click .mingli-publish-btn': 'mingliPublish',
            "click .mingli-del-btn": "delMingli",
            "click .first-comment-reply": "showFirstForm",
            "click .first-comment-reply-btn"  : "addFirstComment"
        },
        initialize: function(data) {
            var udid = data.udid;
            this.recordUdid = udid;
            var me= this;
            this.render();
            // ******事件****
            var events = new BAZI.Views.Events(data);
            events.$el.prependTo(this.$el.find('.discuss-event-item'));

            //****六亲******
            var liuqin = new BAZI.Views.Liuqin(data);
            liuqin.$el.prependTo(this.$el.find('.discuss-liuqi-item'));

            var analysisView = new MingliAnalysisView({model: mingliAnalysis});
            analysisView.$el.appendTo( me.$el.find('.discuss-selfassessment-item') );

            var commentsView = new CommentListView;
            commentsView.$el.appendTo( me.$el.find('.discuss-comments-item') );
            mingliAnalysis.fetchData(udid, function(data) {
                // debugger;
                me.analysisDid = data.did;
                commentsView.fetchData(data.did, function($el) {
                });
            });
        },
        render: function(){
            var html = _.template(BAZI.tpls.tpls_detailRecord)({});
            this.$el.html(html);
            return this;
        },
        showFirstForm: function(){
            this.$('.first-comment-reply-form').show().find('textarea').focus();
        },
        addFirstComment: function(e){
            var me = this;
            var content = $(e.currentTarget).siblings('textarea').val();
            var blockCommentModel = new BlockCommentModel();
            blockCommentModel.createData(content, function(model){
                BlockComments.add(model);
                me.$('.first-comment-reply-form textarea').val('');
            });
        },
        mingliPublish: function(){
            var me = this;
            var authorit = mingliAnalysis.get('authorit');
            mingliAnalysis.addData({
                subjectid: this.recordUdid,
                authorit: authorit,
                content: this.$el.find('.analysis-content-area textarea').val()
            },function(){
                me.$el.find('.analysis-btn-box').remove();
            });
            
        },
        delMingli: function(){
            BAZI.Dialog.tipModal({
                header: {
                    show: true,
                    txt: '确认删除'
                },
                tip_txt: '确认删除这条命理分析吗，相应的评论和赞都会被删除',
                icon_info: 'warning',
                footer: {
                    show: true,
                    btns: [{
                        txt: "确定",
                        sty: 'primary',
                        callback: function(fnclose) {
                            var done = mingliAnalysis.get('done');
                            if (done) {
                                mingliAnalysis.delData();
                                _.invoke(BlockComments.toArray(), 'destroy');
                                fnclose();
                            }
                        }
                    }, {
                        txt: "取消",
                        callback: function(fnClose) {
                            fnClose();
                        }
                    }]
                }
                    
            });
            
        }
    });
})(window, BAZI);