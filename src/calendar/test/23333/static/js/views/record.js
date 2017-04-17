
// 个人资料页面
(function(win, BAZI){

    var RelClass = Backbone.Model.extend({
        defaults: {
            name:'未分类',
            id:'',
            level: ''
        }
    });

    var RelClassList =  Backbone.Collection.extend({
        model: RelClass
    });
    var RelClasses = new RelClassList;


    BAZI.Views.Record = Backbone.View.extend({
        // template: _.template(BAZI.tpls.tpls_addRecord),
        events: {
            'click .close-dialog': 'closeInfo',
            'click .dropdown-toggle': 'openDropdown',
            "click .add-class-btn": "showNewClassInput",
            "click .editRecord-btn": "editRecord"
        },

        initialize: function(data){
            this.options = data;
            this.listenTo( RelClasses,'add',this.renderRelClassItem);
            this.listenTo( RelClasses,'_reset',this.renderRelClassList);
            this.render(data);
            this.fetchRelRelation();
            this.initEvent();
        },

        render: function(data){
            var me = this;
            this.renderData = {};
            // debugger;
            switch(data.from){
                case 0:
                    var dateArr = data.solarDate.concat(data.timeDate);
                    var solarBirthdayStr = BAZI.Common.getBirthdayStr(dateArr);
                    var lunarBirthdayStr = BAZI.Common.getBirthdayStr(dateArr,false);

                    this.renderData={
                        title : '保存记录',
                        name: data.name,
                        isEditable:{
                            name: true,
                            mobile: true,
                            birthday: false,
                            sex: false
                        },
                        sex: data.sex,

                        relClassify: '未分类',
                        hasAddBtn : true,
                        birthdayStr: solarBirthdayStr + '<br />'+ lunarBirthdayStr
                    };
                    this._relClassId = 1;
                break;

                case 1:
                    // 从记录页面过去
                    this.addedRelClasses = [];
                    this.renderData = {
                        title : '编辑记录',
                        name: data.name,
                        sex: data.sex,
                        mobile: data.mobile,
                        relClassify: data.relClassify,
                        isEditable:{
                            name: true,
                            mobile: true,
                            birthday: true,
                            sex: true
                        },
                        hasEditBtn: true
                    };
            }

            this.data = data;

            this.dialogObj = BAZI.Dialog.modal({
                size: 'auto',
                header: {
                    show: true,
                    txt: this.renderData.title
                },
                footer: {
                    show: false
                },
                body: _.template(BAZI.tpls.tpls_addRecord)({data: this.renderData}),
                afterDialogClose: function(){
                    me.remove();
                    RelClasses.reset();

                }
            });

            this.$el = this.dialogObj.$el;
            // debugger;
            this.formEl = this.$el.find('.main-form');
            this.addClassArea = this.$el.find('.add-class-func');

            // debugger;
            this.relClassListEl = this.$el.find('.dropdown-menu');
            this.dividerInRelClassList = this.relClassListEl.find('.divider');
            this.relClassDropdown = this.$el.find('.rel-classify-dropdown');
            this.addBtn = $('#storage-btn');
            this.renderMore();
            this.init();
            this.$('.addRecord').css({marginTop:$(window).scrollTop()-240});
        },

        init: function(){
            var me = this;

            var name = BAZI.userData.sDate ? BAZI.userData.rName : BAZI.User.rname;
            
            this.activationPage = $('#activation');
            this.addForm = $('#form-addRecord');
            

            this.nameInput = $('#edit-name-input');
            this.mobileInput = $('#edit-mobile-input');
            this.relationInput = this.$el.find('.add-class-form input');

            this.sexInput = $('#edit-sex');
        },

        initEvent: function(){
            var me = this;
            this.validate();
            
                
            this.addBtn.on('click', function(){
               me.doRecord();
            });

            $('#edit-sex-tab').find('label').on('click', function(){
                var el = $(this).find('input[type=radio]');
                $(this).addClass('on').siblings().removeClass('on');
                $('#edit-sex').val(el.val());
            });

            this.relClassListEl.delegate('li', 'click', function(event) {
                var type = $(this).data('type');
                var name = $(this).find('a').html();
                if( type === 'move'){
                    me.relClassListEl.parent('.dropdown').removeClass('open')
                        .find('button .txt').html(name);
                    me.addClassArea.find('.add-class-btn').show().siblings().hide();
                    me.validator.resetForm();
                    me._relClassId = $(this).data('id');
                }
            });
        },

        openDropdown: function(e){
            var me = this;
            $(e.currentTarget).parent('.dropdown').addClass('open');
            (function(){
                $('body').on('click',closeDropDown);
                function closeDropDown(e) {
                    if (me.relClassDropdown.has(e.target).length === 0 && me.relClassDropdown.hasClass('open')) {
                        me.relClassDropdown.removeClass('open');
                        me.addClassArea.find('.add-class-btn').show().siblings().hide();
                        me.validator.resetForm();
                        $('body').off('click',closeDropDown);
                    }
                }
            })();
        },

        renderMore: function(){
            var me = this;

            if( this.options.from === 1){
                var isex = this.renderData.sex === '男'? 0:1;
                $('input[data-isex='+ isex+']').attr('checked','checked');
                $('input[data-isex='+ isex+']').parent('label').addClass('on');
                if( ('year' in this.options) && ('month' in this.options) && ('day' in this.options) && ('hour' in this.options) ){
                    var time = {
                        year: this.options.year,
                        month: this.options.month,
                        day: this.options.day,
                        hour: this.options.hour,
                        min: this.options.min
                    };
                }else{
                    var dateArr = this.options.sDate.split('-').map(function(item){
                        return parseInt(item);
                    });

                    var timeArr = this.options.sTime.split(':').map(function(item){
                        return parseInt(item);
                    });

                    var time = {
                        year: dateArr[0],
                        month: dateArr[1],
                        day: dateArr[2],
                        hour: timeArr[0],
                        min: timeArr[1]
                    };

                }
                
                new BAZI.calCtrlBar({
                    oBoxEl: $('#addRecord-calendar'),
                    hasGanZhi: false,
                    defaultDate: time,
                    updateDate: function(opts){
                        me.dateData=opts;
                    }
                });
            }
        },

        showNewClassInput: function(e){
            var me = this;
            var addInput = this.relationInput;

            $(e.currentTarget).hide().siblings('.add-class-form').show()
                .find('input').val('');

            this.relationInput.keydown(function(e){
                if( e.keyCode === 13 ){
                    
                    var result = me.validator.element( addInput );
                    if( result){
                        me.addrelation( addInput.val() );
                        addInput.val('').parent().hide().siblings('p').html('+ 新的分类').show();
                    }
                }
            })

        },

        fetchRelRelation: function(){
            BAZI.Api.record.getListTitle({}, function(data) {
                if (data.ret !== 0) {
                    BAZI.Dialog.fadeDialog({tip_txt:'请求错误', icon_info:'error'})
                    return;
                }
                // debugger;
                data.list[0].forEach(function(item) {
                    RelClasses.add({
                        name: item[1],
                        id: item[0]+'',
                        level: item[2]
                    },{silent: true});
                });
                RelClasses.trigger('_reset');
                // console.log(RelClasses.toJSON());
            });

        },

        closeInfo: function(){
            this.$el.remove();
            RelClasses.reset();
        },

        doRecord: function(){
            var me = this;
            
            if( !this.formEl.valid())return;


            var rname = this.nameInput.val();
            BAZI.Api.iudatas.add(
                {
                    rname: rname,
                    igender: BAZI.userData.iGender,
                    birthsolar: BAZI.userData.sDate,
                    birthtime: BAZI.userData.sTime,
                    relation:me._relClassId,
                    umobile:this.mobileInput.val()
                },
                function(data){
                    BAZI.Dialog.fadeDialog({icon_info: 'success', tip_txt: '保存成功！'});

                    data.aUinfo.relation = RelClasses.findWhere({id: data.aUinfo.relation+''}).get('name');
                    me.dialogObj.removeDialog();
                    // 排盘里的东西
                    me.data.updateDate(data.aUinfo);
                    var html = $.tmpl(BAZI.tpls.tpls_detailRecord)
                    $('#paipan').append(html);
                    $('#dorcd-btn').html('编辑');
                    $('#share-dorcd-btn').show();
                    var view = new BAZI.Views.Discussion({udid: data.aUinfo.udid});
                    view.$el.appendTo(BAZI.views.Paipan.dialogBodyEl)


                    if ('Records' in BAZI.Collections) {
                        var obj = {
                            udid: data.aUinfo.udid,
                            name: data.aUinfo.rname,
                            sex: data.aUinfo.igender === "0" ? '男' : '女',
                            solarDate: data.aUinfo.birthsolar.split('-').map(function(item) {
                                return parseInt(item)
                            }),
                            timeDate: data.aUinfo.birthtime.split(':'),
                            province: data.aUinfo.province,
                            city: data.aUinfo.city,
                            mobile: data.aUinfo.umobile,
                            profClassify: data.aUinfo.mingju,
                            relClassify: data.aUinfo.relation,
                            GanZhiYear:  BAZI.lang.tianGan[data.aUinfo.yearTianGan] + BAZI.lang.diZhi[data.aUinfo.yearDiZhi],
                            GanZhiMonth:  BAZI.lang.tianGan[data.aUinfo.monthTianGan] + BAZI.lang.diZhi[data.aUinfo.monthDiZhi],
                            GanZhiDay:  BAZI.lang.tianGan[data.aUinfo.dayTianGan] + BAZI.lang.diZhi[data.aUinfo.dayDiZhi],
                            GanZhiHour:  BAZI.lang.tianGan[data.aUinfo.hourTianGan] + BAZI.lang.diZhi[data.aUinfo.hourDiZhi]
                        };
                        BAZI.Collections.Records.add(obj);
                    }

                },

                function(d){
                    if(d.ret == 106){
                        BAZI.Dialog.fadeDialog({'icon_info':'error', tip_txt:'请先登录！'});
                        BAZI.router.navigate('login', true);
                    }
                }
            );
        },

        editRecord:function(){
            // debugger;
            var result = this.formEl.valid();
            if( !result)return;
            var me = this;
            var ctime = this.dateData;
            var dateInfo = BAZI.Common.formatDate(ctime,'date');
            var timeInfo = BAZI.Common.formatDate(ctime,'time');

            if( !('_relClassId' in this) ){
                var model = RelClasses.findWhere({name: me.relClassDropdown.find('.dropdown-toggle .txt').html()});
                this._relClassId = model.get('id');
            }
            BAZI.Api.record.editRecord({
                    rname: this.nameInput.val(),
                    igender: this.sexInput.val(),
                    birthsolar: dateInfo,
                    birthtime: timeInfo,
                    umobile: this.mobileInput.val(),
                    relation: me._relClassId,
                    udid: me.options.udid
                },
                function(data) {
                    if (data.ret === 0) {
                        BAZI.Dialog.fadeDialog({
                            icon_info: 'success',
                            tip_txt: '修改成功！'
                        });
                        data.aUinfo.relation = RelClasses.findWhere({
                            id: data.aUinfo.relation + ''
                        }).get('name');

                        me.data.updateDate && me.data.updateDate(data.aUinfo);

                        var onupdateDate = data.aUinfo.birthsolar.split('-').map(function(date) {
                            return parseInt(date);
                        });

                        var onupdateTime = data.aUinfo.birthtime.split(':');

                        var recordUserData = {
                            name: data.aUinfo.rname,
                            sex: data.aUinfo.igender == 0 ? "男" : "女",
                            solarDate: onupdateDate,
                            timeDate: onupdateTime,
                            mobile: data.aUinfo.umobile,
                            relClassify: data.aUinfo.relation,
                            siZhu: (function() {
                                var arr = [];
                                arr.push(BAZI.lang.tianGan[data.aUinfo.yearTianGan] + BAZI.lang.diZhi[data.aUinfo.yearDiZhi]);
                                arr.push(BAZI.lang.tianGan[data.aUinfo.monthTianGan] + BAZI.lang.diZhi[data.aUinfo.monthDiZhi]);
                                arr.push(BAZI.lang.tianGan[data.aUinfo.dayTianGan] + BAZI.lang.diZhi[data.aUinfo.dayDiZhi]);
                                arr.push(BAZI.lang.tianGan[data.aUinfo.hourTianGan] + BAZI.lang.diZhi[data.aUinfo.hourDiZhi]);
                                return arr;
                            })(),
                            GanZhiYear: BAZI.lang.tianGan[data.aUinfo.yearTianGan] + BAZI.lang.diZhi[data.aUinfo.yearDiZhi],
                            GanZhiMonth: BAZI.lang.tianGan[data.aUinfo.monthTianGan] + BAZI.lang.diZhi[data.aUinfo.monthDiZhi],
                            GanZhiDay: BAZI.lang.tianGan[data.aUinfo.dayTianGan] + BAZI.lang.diZhi[data.aUinfo.dayDiZhi],
                            GanZhiHour: BAZI.lang.tianGan[data.aUinfo.hourTianGan] + BAZI.lang.diZhi[data.aUinfo.hourDiZhi]
                        };

                        me.options.onupdate && me.options.onupdate({
                            recordUserData: recordUserData,
                            addedRelClasses: me.addedRelClasses
                        });

                        me.dialogObj.removeDialog();
                    }
                    if (data.ret == 106) {
                        BAZI.Dialog.fadeDialog({
                            'icon_info': 'error',
                            tip_txt: '请先登录！'
                        });
                    }
                }
            );
        },

        addrelation: function(name){
            var me = this;
            var data = {
                rtype: 0,
                relname: name
            };
            BAZI.Api.record.addRelation(data,function(data){
                if (data.ret === 0) {
                    var relItem = {
                        name: name,
                        id: data.relation+'',
                        level: 1
                    };
                    ('addedRelClasses' in me) && me.addedRelClasses.push(relItem);
                    RelClasses.add(relItem);
                }
            });

        },
        
        renderRelClassItem: function(model){
            var obj = model.toJSON();
            var itemEl = $('<li data-id="'+ obj.id+'" data-type="move"><a href="javascript:;">'+obj.name +'</a></li>');
            itemEl.insertBefore(this.dividerInRelClassList);

        },

        renderRelClassList: function(){
            var html = '';
            RelClasses.forEach(function(model){
                var obj = model.toJSON();
                html+= '<li data-id="'+ obj.id+'" data-type="move"><a href="javascript:;">'+obj.name +'</a></li>';
            });

            $(html).insertBefore(this.dividerInRelClassList);
        },
        validate:function(){
            
            switch (this.options.from) {
                case 0:
                    this.validator = this.formEl.validate({
                        rules: {
                            username: {
                                required: true,
                                minlength: 2
                            }
                        },
                        messages: {
                            username: {
                                required: '请输入姓名',
                                minlength: '姓名长度不能少于2位'
                            }
                        }
                    });
                    break;
                case 1:
                    this.validator = this.formEl.validate({
                        rules: {
                            username: {
                                required: true,
                                minlength: 2
                            },
                            telephone: {
                                required: false,
                                mobile: true
                            },
                            add_classify: {
                                required: true,
                                minlength: 2
                            }
                        },
                        messages: {
                            username: {
                                required: '请输入姓名',
                                minlength: '姓名长度不能少于2位'
                            },
                            telephone: {
                                mobile: '手机号码不正确',
                                required: '请输入手机号码'
                            },
                            add_classify: {
                                required: '请输入新添加的关系',
                                minlength: '关系名称不得少于两位数'
                            }
                        },
                        errorPlacement: function(error, element) {
                            if (element[0].name === 'add_classify') {
                                error.css({
                                    'display': 'block',
                                    'color': '#DD5563'
                                }).insertBefore($(element));
                            } else {
                                error.addClass('error-tips').insertBefore($(element));
                            }
                        }
                    });
                    break;
                default:
                    throw new Error('没有这种from参数');
                    break;
            }
            
        }
    });

})(window,BAZI);