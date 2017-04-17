// 记录列表页
~function(BAZI,win){
    var Local = {};
    // 每一条记录的model
    var RecordItem = Backbone.Model.extend({
        defaults: function() {
            return {
                udid: 0,
                GanZhiYear: '',
                GanZhiMonth: '',
                GanZhiDay: '',
                GanZhiHour: '',
                name: '未命名',
                sex: '女',
                solarDate: [],
                timeDate: [],
                favicon: '',
                province: '',
                city: '',
                mobile: '',
                profClassify: '未分类',
                relClassify: '未分类',
                done: false,
                comparable: false
            };
        },
        initialize: function(){
            var solarDate = this.get('solarDate');
            var timeDate = this.get('timeDate');
            var lunarData = LunarCalendar.solarToLunar( solarDate[0], solarDate[1], solarDate[2]);
            var solarDateStr = solarDate[0] + '年' + solarDate[1] + '月' + solarDate[2] + '日' + timeDate[0] + '时' + timeDate[1] + '分';
            var lunarDateStr = lunarData.lunarYear + '年' + lunarData.lunarMonthName + lunarData.lunarDayName +'&nbsp;'+ BAZI.utilities.zhiHour[parseInt(timeDate[0])] + '时';
            this.set('solarDateStr',solarDateStr);
            this.set('lunarDateStr',lunarDateStr);
        },
        toggle: function() {
            this.set({
                done: !this.get('done')
            });
        }
    });

    var RecordList = Backbone.Collection.extend({
        model: RecordItem,
        done: function(){
            return this.where({done: true});
        },
        cancelDone: function(){
            this.done().forEach(function(model){
                model.toggle();
            });
        },
        compare: function(){
            return this.where({'comparable': true});
        }
    });
    var Records = BAZI.Collections.Records = new RecordList;

    //
    //setTimeout(function(){
    //    Records.each(function(b){console.log(b.get('udid'))})
    //
    //},2000);


    var ClassifyModel = Backbone.Model.extend({
        defaults: {
            name:'未分类',
            id:'',
            level: ''
        }
    });

    var RelClassification =  Backbone.Collection.extend({
        model: ClassifyModel
    });
    var ProfClassification =  Backbone.Collection.extend({
        model: ClassifyModel
    });

    var relClassification = new RelClassification;
    var profClassification = new ProfClassification;
    
    relClassification.add({
        name:'未分类',
        id:'1',
        level: '0'
    });

    profClassification.add({
        name:'未分类',
        id:'2',
        level: '0'
    });

    var isEditable = false;
    var hasMoreRecordsData = true;
    // 每一条记录的view
    var RecordView = Backbone.View.extend({
        template: _.template(BAZI.tpls.tpls_record_item),

        initialize: function() {
            var me = this;
            this.listenTo(this.model, 'destroy', this._remove);
            // this.listenTo(this.model, 'elRemove', this.elRemove);
            this.listenTo(this.model, 'change:done', function(model, done){
                    if( !done){
                        me.el.removeClass('list-item-cur');
                    }else{ 
                        me.el.addClass('list-item-cur');
                    }   
            });

            this.listenTo(this.model, 'change:relClassify', function(model, rel) {
                me.updateRelClassify.call(me,rel);
            });

            this.listenTo(this.model, 'change:comparable', function(model, val) {
                me.toggleCompare.call(me,val);
            });

            this.listenTo(this.model, '_reset', function(model) {
                me.rerender.call(me);
            });


        },
        render: function() {
            this.el = $('<li class="uibox-list-item record-list-item"></li>');
            var html = this.template({
                userInfo: this.model.toJSON()
            });
            
            this.el.html(html);
            // this.el.toggleClass('done', this.model.get('done'));
            this.editList = this.el.find('.select-list');
            this.dropDownMenu = this.el.find('.select');
            this.editBtn = this.editList.find('.record-edit');
            this.delBtn = this.editList.find('.record-delete');
            this.compareBtn = this.editList.find('.record-compare');            
            this.initEvent();
            return this;
        },
        _remove: function(opts){
            this.remove();
            this.el.remove();
            if(opts && opts._notSave)return;
            var udid = this.model.get('udid');
            BAZI.Api.record.delRelation({udids: udid},function(){
                // BAZI.Dialog.fadeDialog({icon_info: 'success', tip_txt: '删除成功'});
            });
        },
        rerender: function(attrs){
            var me = this;
            var needRenderAttrs = ['name','sex','relClassify', 'profClassify', 'GanZhiYear', 'GanZhiMonth', 'GanZhiDay','GanZhiHour', 'solarDateStr', 'lunarDateStr'];
            needRenderAttrs.forEach(function(attr){
                me.el.find('[data-fill='+ attr +']').html(me.model.get(attr));
                
            });
        },
        elRemove: function(){
            this.remove();
            this.el.remove();
        },
        initEvent: function() {
            var me = this;
            this.el.on('click', function(e) {
                if( isEditable){
                    me.model.toggle();
                }else{
                    me.showPaipan.call(me);
                }
            });

            this.dropDownMenu.on('mouseover', _.bind(this.showEditList, me) );
            this.dropDownMenu.on('click',function(e){
                e.stopPropagation();
            });
            this.dropDownMenu.on('mouseleave ', function(e){
                e.stopPropagation();
                me.editList.hide();
            });
            this.editBtn.on('click',function(e){
                e.stopPropagation();
                me.showRecord.call(me);
                
            });
            this.delBtn.on('click',function(e){
                e.stopPropagation();
                me.confirmDelRecord();
            });
            this.compareBtn.on('click',function(e){
                e.stopPropagation();
                me.setCompareStatus();
            });

        },
        updateRelClassify: function(rel){
            this.el.find('.rel-classify-txt').html(rel);
        },
        toggleDone: function() {
            this.model.toggle();
        },
        setCompareStatus: function(){
            var me = this;
            if( this.model.get('comparable') === true )return;
            this.model.set('comparable',true);

            var compareObj = {
                name: '',
                sex: '',
                GanZhiYear: '',
                GanZhiMonth: '',
                GanZhiDay: '',
                GanZhiHour: '',
                solarDate: [],
                timeDate: []
            };
            var obj2 = this.model.toJSON();
            for(var attr in compareObj){
                compareObj[attr] = obj2[attr];
            }
            compareObj.from = 'simple';
            // 两个model的通讯
            var comparison = new BAZI.Models.ComparisonItem(compareObj,function(){
                me.model.set('comparable',false);
            });
            this.model.on('destroy',function(){
                comparison.destroy();
            });
            
            BAZI.Collections.comparisons.add(comparison);

        },
        toggleCompare: function(val){    
            if (val) {
                this.el.css('border-color','red');
            } else {
                this.el.css('border-color','#D4D4D4');
                
            }

        },
        showPaipan: function() {
            var me = this;
            var obj = this.model.toJSON();

            var year = obj.solarDate[0];
            var month = obj.solarDate[1];
            var day = obj.solarDate[2];

            var hour = obj.timeDate[0];
            var min =  obj.timeDate[1];
            var second = obj.timeDate[2];

            var format = function(num) {
                if (num < 10) {
                    return '0' + num;
                }
                return '' + num;
            };

            var data = {
                sDate: year+'-'+ format(month)+'-'+ format(day),
                sTime: hour+':'+ min+':'+second,
                iGender: obj.sex ==='男'? 0 :1,
                rName: obj.name,
                mobile: obj.mobile,
                relClassify: obj.relClassify,
                profClassify: obj.profClassify,
                udid: obj.udid,
                fromRecord: true,
                onupdate: function(data){
                    // alert(JSON.stringify(data));
                    me.model.set(data.recordUserData,{silent: true});
                    // me.model.initialize();
                    // debugger;
                    me.model.trigger('_reset');
                    if(data.addedRelClasses.length!== 0 ){
                        data.addedRelClasses.forEach(function(newRel){
                            relClassification.add(newRel);
                        })
                    }  

                }
            };
            new BAZI.Views.Paipan(data);
        },
        showRecord: function(){
            var me = this;
            var obj = this.model.toJSON();
            var data = {
                name: obj.name,
                udid: obj.udid,
                sex: obj.sex,
                mobile: obj.mobile,
                relClassify: obj.relClassify,
                profClassify: obj.profClassify,
                from: 1,
                year: obj.solarDate[0],
                month: obj.solarDate[1],
                day: obj.solarDate[2],
                hour: obj.timeDate[0],
                min: obj.timeDate[1],
                second: obj.timeDate[2],
                onupdate: function(data){

                    // alert(JSON.stringify(data));
                    me.model.set(data.recordUserData,{silent: true});
                    me.model.initialize();
                    // debugger;
                    me.model.trigger('_reset');
                    if(data.addedRelClasses.length!== 0 ){
                        data.addedRelClasses.forEach(function(newRel){
                            relClassification.add(newRel);
                        })
                    }  

                }
            };
            BAZI.router.record(data);

        },
        showEditList: function(){
            this.editList.show();
        },
        confirmDelRecord: function(){
            var me = this;
            BAZI.Dialog.tipModal({
                icon_info: 'warning',
                tip_txt: '确认删除这条记录吗',
                footer: {
                    show: true,
                    btns: [{
                        type: 'submit',
                        txt: "确定",
                        sty: 'primary',
                        callback: function(fnClose) {
                            me.model.destroy();
                            fnClose();
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
 
    BAZI.Views.RecordListView = Backbone.View.extend({

        id: 'record-list',
        events: {
            "click .toggle-editable": "toggleditable",
            "click .record-list-delete": "confirmDelRecords",
            "click .record-list-shift": "confirmShiftClassify",
            "click .filter-class-dropdown-toggle": "showDropDownMenu"
        },
        initialize: function(data) {
            var me = this;
            this.listenTo(Records, 'bulkAdd', this.bulkAdd);
            this.listenTo(Records, 'add', this.addOne);
            this.listenTo(relClassification, 'add', this.renderRelClassifyList);
            this.listenTo(profClassification, 'add', this.renderProfClassifyList);
            // this.listenTo(Records, 'remove', function(model){
            //     me.destroyRerecord(model);
            // });
            this.iPage = 1;  //初始化页码
            this.render(data);
            this.initEvent();
        },

        render: function(data) {
            // debugger;
            var html = $.tmpl(BAZI.tpls.tpls_listRecord)({});

            this.$el.html(html).appendTo('#main').siblings().hide();

            this.listBox = this.$el.find('.record-list-main');
            this.filterListBox = this.$el.find('.record-list-filter');
            this.toggleEditableBtn = this.$el.find('.toggle-editable');
            this.shiftDropdownEl = this.$el.find('.record-list-shift');
            this.delBtn = this.$el.find('.record-list-delete');
            this.relListEl = this.$el.find('.relClassify-select-list');
            
            this.profListEl = this.$el.find('.profClassify-select-list');
            this.initData();
            
        },

        initEvent: function(){
            var me = this;
            var filterRelDropdown = $('.filter-relclass-dropdown');
            var filterProfDropdown = $('.filter-profclass-dropdown');

            this.relListEl.delegate('li', 'click', function(event) {
                filterProfDropdown.find('.dropdown-toggle .txt').html('全部命局');

                var name = $(this).find('a').html();
                me.relListEl.parent('.dropdown').removeClass('open').find('.dropdown-toggle .txt').html(name);

                if( $(this).data('id')=== 9527){
                    me.listBox.show().siblings().hide();
                }else{
                    me.filterRelRecordsShow(name);
                }
            });

            this.profListEl.delegate('li', 'click', function(event) {
                filterRelDropdown.find('.dropdown-toggle .txt').html('全部关系');

                var name = $(this).find('a').html();
                me.profListEl.parent('.dropdown').removeClass('open').find('.dropdown-toggle .txt').html(name);

                if( $(this).data('id')=== 9527){
                    me.listBox.show().siblings().hide();
                }else{
                    me.filterProfRecordsShow(name);
                }
            });

            var moveClassifyObj = BAZI.Common.addClassify({
                oBox: $('.dropdown-box'),
                beforeOpenBtnClick: function(){
                    if( Records.done().length ===0){
                        BAZI.Dialog.fadeDialog({'icon_info':'error', 'tip_txt':'没有选中任何记录'});
                        return false;
                    }
                    return true;
                },
                onaddclassify: function(val, beforeEl) {
                    var data = {
                        rtype: 0,
                        relname: val
                    };
                    BAZI.Api.record.addRelation(data, function(data) {
                        if (data.ret === 0) {
                            // BAZI.Dialog.fadeDialog({'icon_info':'success', tip_txt: '添加成功'});
                            var relItem = {
                                name: val,
                                id: data.relation,
                                level: 1
                            }
                            relClassification.add(relItem);
                            // $('<li data-type="move" data-id="' + data.relation + '"><a href="javascript:;">' + val + '</a></li>').insertBefore(beforeEl);
                        }
                    });
                },
                onmoveclassify: function(id,name) {
                    var udids = [];
                    Records.done().forEach(function(model){
                        udids.push( model.get('udid') );
                    });
                    var data = {
                        udids: udids.join(','),
                        rtype: 0,
                        relation: id
                    }
                    BAZI.Api.record.moveRelation(data,function(data){
                        if( data.ret === 0){
                            BAZI.Dialog.fadeDialog({'icon_info':'success', 'tip_txt': '移动分类成功'});
                            Records.done().forEach(function(model){
                                model.set('relClassify', name).toggle();
                            });
                        }
                    });
                }
            });

            this.moveRelListEl = moveClassifyObj.listEl;
            this.addRelClassEl = this.moveRelListEl.find('.add-class-func');

            var itemHeight = this.listBox.find('.record-list-item').outerHeight();
            $(window).scroll(function(e){
               
                if( hasMoreRecordsData ){
                    var lastRecordItemElOffsetTop = me.listBox.find('.record-list-item:last-child').length===0 ? 0 : me.listBox.find('.record-list-item:last-child').offset().top;
                    var isBeyond = document.body.scrollTop+ document.documentElement.clientHeight > lastRecordItemElOffsetTop + itemHeight;
                    if( isBeyond){
                        me.fetchRecordsDate();
                    }
                    
                }else{
                    $(window).unbind('scroll');
                }
            });

            $('body').click(function(e){
                function has(obj1, obj2 ){
                    if( obj1 === document.body)return false;
                    if( obj1 === obj2) {
                        return true;
                    }else{
                        obj1 = obj1.parentNode;
                        return has(obj1, obj2);
                    } 
                }
                if( filterRelDropdown.hasClass('open') && !has(e.target, filterRelDropdown[0]) ){
                    filterRelDropdown.removeClass('open')
                }                

                if( filterProfDropdown.hasClass('open') && !has(e.target, filterProfDropdown[0]) ){
                    filterProfDropdown.removeClass('open')
                }


            });


        },
        filterRelRecordsShow: function(name){
            var models = Records.where({relClassify: name});
            if( models.length === 0){
                this.filterListBox.html('<br />该分类下没有记录').show().siblings().hide();
                return;
            }
            var fragment = document.createDocumentFragment();
            models.forEach(function(model){
                var view = new RecordView({model: model});
                fragment.appendChild(view.render().el[0]);
            })
            this.filterListBox.empty()[0].appendChild(fragment);
            this.filterListBox.show().siblings().hide();
        },
        filterProfRecordsShow: function(name){
            var models = Records.where({profClassify: name});
            // console.log(models);
            if( models.length === 0){
                this.filterListBox.html('<br />该分类下没有记录').show().siblings().hide();
                return;
            }
            var fragment = document.createDocumentFragment();
            models.forEach(function(model){
                var view = new RecordView({model: model});
                fragment.appendChild(view.render().el[0]);
            })
            this.filterListBox.empty()[0].appendChild(fragment);
            this.filterListBox.show().siblings().hide();
        },
        initData: function(){

            var me = this;
            BAZI.Api.record.getListTitle({}, function(data) {

                if (data.ret !== 0) {
                    BAZI.Dialog.fadeDialog({tip_txt:'请求错误', icon_info:'error'})
                    return;
                }

                data.list[0].forEach(function(item) {
                    
                    relClassification.add({
                        name: item[1],
                        id: item[0],
                        level: item[2]
                    });
                });

                data.list[1].forEach(function(item, i) {
                    profClassification.add({
                        name: item[1],
                        id: item[0],
                        level: item[2]
                    });
                });

                me.fetchRecordsDate();
                
            });
        },
        fetchRecordsDate: function(){
          /************/

            var me = this;
            var tmp_models = [];
            BAZI.Api.record.getItem({
                page: me.iPage
            }, function(data) {
                // console.log(me.iPage)
                if (data.ret !== 0) return;
                if (data.more === 0) {
                    me.$el.find('.nomore-tips').show();
                    hasMoreRecordsData = false;
                }else if(data.more === 1){
                    me.iPage++;
                }
                data.aRecords.forEach(function(item, idx) {
                    var GanZhiArr = [],
                        arr = item[1].split(',');
                    for (var i = 0, len = arr.length; i < len; i += 2) {
                        GanZhiArr.push(BAZI.lang.tianGan[arr[i]] + BAZI.lang.diZhi[arr[i + 1]]);
                    };

                    var obj = {
                        udid: item[0],
                        name: item[2],
                        sex: item[3] === "0" ? '男' : '女',
                        solarDate: item[4].split('-').map(function(item) {
                            return parseInt(item)
                        }),
                        timeDate: item[5].split(':'),
                        favicon: item[6],
                        province: item[9],
                        city: item[10],
                        mobile: item[11],
                        profClassify: profClassification.findWhere({id: item[7] })? profClassification.findWhere({id: item[7] }).get('name') : '未分类',
                        relClassify: relClassification.findWhere({id: item[8] })? relClassification.findWhere({id: item[8] }).get('name') :'未分类',
                        GanZhiYear: GanZhiArr[0],
                        GanZhiMonth: GanZhiArr[1],
                        GanZhiDay: GanZhiArr[2],
                        GanZhiHour: GanZhiArr[3]
                    };
                    
                    tmp_models.push(obj)

                });

                var newModels = Records.add(tmp_models,{silent: true});
                Records.trigger('bulkAdd',newModels);
            });

        },
        bulkAdd: function(models){
            var fragment = document.createDocumentFragment();
            models.forEach(function(model,idx){
                var view = new RecordView({model: model});
                fragment.appendChild(view.render().el[0])
            });

            this.listBox[0].appendChild(fragment);
        },
        addOne: function(record){
            var view = new RecordView({model: record});
            this.listBox.prepend(view.render().el);
        },
        toggleditable: function(){
            isEditable = !isEditable;
            if( !isEditable){
                this.toggleEditableBtn[0].innerHTML = '编辑';
                this.delBtn.hide();
                this.shiftDropdownEl.hide();
                Records.where({done: true}).forEach(function(model){
                    model.set({done: false})
                })
            }else{
                this.toggleEditableBtn[0].innerHTML = '取消';
                this.delBtn.css('display','inline-block');
                this.shiftDropdownEl.css('display','inline-block');
            }

        },
        confirmDelRecords: function(){
            var me = this;
            var doneModels = Records.done();
            if( doneModels.length === 0){
                BAZI.Dialog.fadeDialog({'icon_info':'error', tip_txt:'没有选中任何记录'});
                return;
            }
            BAZI.Dialog.tipModal({
                icon_info: 'warning',
                tip_txt: '确认删除这些记录吗',
                footer: {
                    show: true,
                    btns: [{
                        type: 'submit',
                        txt: "确定",
                        sty: 'primary',
                        callback: function(fnClose) {
                            var udids = [];
                            var models = Records.remove(doneModels);
                            models.forEach(function(model){
                                model.trigger('destroy',{_notSave: true});
                                udids.push(model.get('udid'));
                            });
                            var udidsStr = udids.join(',');
                            me.delRecords(udidsStr);
                            fnClose();
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
        },

        confirmShiftClassify: function(){
        },

        delRecords: function(udidsStr){
            BAZI.Api.record.delRelation({udids: udidsStr},function(){
                // BAZI.Dialog.fadeDialog({icon_info: 'success', tip_txt: '删除成功'});
            });
        },
        showDropDownMenu: function(e){
            $(e.currentTarget).parent('.dropdown').addClass('open');
        },
        renderRelClassifyList: function(model){
            var html_show = _.template('<li data-id="<%= data.id%>"><a href="javascript:;"><%= data.name%></a></li>')({data: model.toJSON()});
            this.relListEl.prepend(html_show);

            var html_move = _.template('<li data-id="<%= data.id%>" data-type="move" ><a href="javascript:;"><%= data.name%></a></li>')({data: model.toJSON()});
            $(html_move).insertBefore(this.addRelClassEl);
        },
        renderProfClassifyList: function(model){
            var html = _.template('<li data-id="<%= data.id%>"><a href="javascript:;"><%= data.name%></a></li>')({data: model.toJSON()});
            this.profListEl.prepend(html);
        }
    });
}(BAZI, window);
    