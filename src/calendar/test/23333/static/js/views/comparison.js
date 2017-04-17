(function(win, BAZI){
    var Local = {};
    var ComparisonItem = BAZI.Models.ComparisonItem = Backbone.Model.extend({
        defaults: function(){
            return {
                name: '未命名',
                sex: '',
                GanZhiYear: '',
                GanZhiMonth: '',
                GanZhiDay: '',
                GanZhiHour: '',
                solarDate: [],
                timeDate: []
            };
        },
        initialize: function(opts,ondestroy){
            ondestroy && this.on('destroy', ondestroy);
            var solarDate = this.get('solarDate');
            var timeDate = this.get('timeDate');
            var lunarData = LunarCalendar.solarToLunar( solarDate[0], solarDate[1], solarDate[2]);
            var solarDateStr = solarDate[0] + '年' + solarDate[1] + '月' + solarDate[2] + '日' + timeDate[0] + '时' + timeDate[1] + '分';
            var lunarDateStr = lunarData.lunarYear + '年' + lunarData.lunarMonthName + lunarData.lunarDayName +'&nbsp;'+ BAZI.utilities.zhiHour[parseInt(timeDate[0])] + '时';
            this.set('solarDateStr',solarDateStr);
            this.set('lunarDateStr',lunarDateStr);
        },
        fetchDetailInfo: function(cb){
            var me = this;
            var obj = this.toJSON();
            var data = {
                rName: obj.name,
                iGender: obj.sex === '男'? 0: 1,
                sDate: BAZI.Common.formatDateData(obj.solarDate[0], obj.solarDate[1], obj.solarDate[2]),
                sTime: BAZI.Common.formatTimeData(obj.timeDate[0], obj.timeDate[1], 0)
            }

            BAZI.Api.paipan.getBase(data,function(data){
                me.set({
                    from: 'detail',

                    solarOrLunar: BAZI.lang.solarOrLunar[data.solarOrLunar],
                    shengXiao: BAZI.lang.shengXiao[data.shengXiao],
                    vage: data.vage,
                    startLunckStr: BAZI.Common.setLuck(data.aStartLuck),

                    yearGanWuXing: BAZI.lang.wuXing[ data.aSiZhu.yearZhu.tianGanAttr.wuXing[0] ],
                    yearZhiWuXing: BAZI.lang.wuXing[ data.aSiZhu.yearZhu.diZhiAttr.wuXing[0] ],
                    monthGanWuXing: BAZI.lang.wuXing[ data.aSiZhu.monthZhu.tianGanAttr.wuXing[0] ],
                    monthZhiWuXing: BAZI.lang.wuXing[ data.aSiZhu.monthZhu.diZhiAttr.wuXing[0] ],
                    dayGanWuXing: BAZI.lang.wuXing[ data.aSiZhu.dayZhu.tianGanAttr.wuXing[0] ],
                    dayZhiWuXing: BAZI.lang.wuXing[ data.aSiZhu.dayZhu.diZhiAttr.wuXing[0] ],
                    hourGanWuXing: BAZI.lang.wuXing[ data.aSiZhu.hourZhu.tianGanAttr.wuXing[0] ],
                    hourZhiWuXing: BAZI.lang.wuXing[ data.aSiZhu.hourZhu.diZhiAttr.wuXing[0] ],

                    mingju: BAZI.Common.getMingjuVal(data.mingju), 
                    goodLuckYears: data.goodLuckYears.map(function(item){
                        return {
                            age: item.age,
                            GanZhi: BAZI.lang.tianGan[item.tianGanAttr.attrVal] + BAZI.lang.diZhi[item.diZhiAttr.attrVal]
                        }
                    })

                });
                cb && cb();
                
            });
        }
    });
    var ComparisonList = Backbone.Collection.extend({
        model: ComparisonItem
    });
    var comparisons = BAZI.Collections.comparisons = new ComparisonList;

    var CompareItemView = Backbone.View.extend({
        tagName: 'li',
        template: _.template(BAZI.tpls.tpls_dif_left_item),
        events: {
            "click .del-dif": "cancelCompare"
        },
        initialize: function(){
            var me = this;
            this.listenTo(this.model, 'destroy', this.remove);
            this.render();
        },
        render: function(){
            var html = this.template({data: this.model.toJSON()});
            this.$el.html(html);
            return this;
        },
        cancelCompare: function(){
            this.model.destroy();
        }
    });
    // 右侧对比列表页
    var CompareListView = Backbone.View.extend({
        template: _.template(BAZI.tpls.tpls_dif_left),
        events: {
            "click .close-dialog": "_remove",
            'click .clear': "clearCompareList",
            "click .compare": "compare"
        },
        initialize: function(){
            
            this.listenTo(comparisons, 'add', this.addOne);
            this.render();
        },
        render: function(){
            var html = this.template({});
            $('#viewport').append(html);
            this.$el = $('.different-left');
            this.listEl = this.$el.find('ul'); 
            
        },
        _remove: function(){
            this.$el.hide();
            this.clearCompareList();
        },
        clearCompareList: function(){

            _.invoke(comparisons.toArray(), 'destroy');
        },
        compare: function(){
            if(comparisons.length === 0){
                BAZI.Dialog.fadeDialog({'icon_info': 'error', 'tip_txt': '请选择对比项！'});
                return;
            }
            if(comparisons.length === 1){
                BAZI.Dialog.fadeDialog({'icon_info': 'error', 'tip_txt': '请选择两项以上！'});
                return;
            }
            
            var len = comparisons.length;
            var count = 0;
            comparisons.forEach(function(model, idx) {
                model.fetchDetailInfo(function() {
                    count++;
                    if (count === len) {
                        Local.comparisonPageView = new ComparisonPageView;
                    }
                });
            });

           
            
        },
        addOne: function(model,opts){
            if( comparisons.length === 1){
                this.$el.show();
            }
            var compareItemView = new CompareItemView({model: model});
            this.listEl.append(compareItemView.$el);
        }
    });
    var compareListView = new CompareListView;

    var DetailItemView = Backbone.View.extend({
        tagName: 'tr',
        events: {
            "click .del-comparison-item": "_remove"
        },
        template: _.template(BAZI.tpls.tpls_Different_item),
        initialize: function(){
            this.render();
        },
        render: function(){
            var html = this.template({data: this.model.toJSON()});
            this.$el.html(html);
            return this;
        },
        _remove: function(){
            this.remove();
            this.model.destroy();
            if( comparisons.length === 0){
                Local.comparisonPageView.dialogObj.removeDialog();
            }
        }
    });

    var ComparisonPageView = Backbone.View.extend({
        events: {
           "click .btn-add-comparison": "addComparison" 
        },
        initialize: function(){
            this.listenTo(comparisons,'add', this.addOne);
            this.render();
        },
        render: function(){
            this.dialogObj = BAZI.Dialog.modal({
                header:{
                    show: true,
                    txt: '八字详细对比'
                },
                body: BAZI.tpls.tpls_Different,
                beforeDialogShow: function(el){
                    el.find('.dialog-body').css('padding','0');
                },
                footer: {
                    show: false
                }
            });

            this.$el = this.dialogObj.$el;

            this.containerEl = this.$el.find('.dif-table tbody');
            this.addAll();
        },
        addComparison: function(){
            new addComparisonView;
        },
        addAll: function(){
            var me = this;
            
            comparisons.forEach(function(model){
                me.addOne(model);
            });
        },
        addOne: function(model){
            if(model.get('from') !== 'detail' ){
                //console.log(model.toJSON())
            }
            if( model.get('from') === 'detail'  ){
                var view = new DetailItemView({model: model});
                this.containerEl.append(view.render().$el);
            }
                
        }
    });

    var addComparisonView = Backbone.View.extend({
        events: {
            "click .add-comparison-btn": "addComparison",
            "click #dif-sex-tab label": "selectSex"
        },
        initialize: function(){
            this.render();
            this.dateData = {};
        },
        render: function(){
            var me = this;
            this.dialogObj = BAZI.Dialog.modal({
                size:'md',
                header: {
                    show: true,
                    txt: '新加对比'
                },
                body: BAZI.tpls.tpls_Different_add,
                footer: {
                    show: false
                },
                afterDialogShow: function(el){
                    
                    var calendarBox = el.find('#add-comparison-from-calendar');
                    new BAZI.calCtrlBar({
                        oBoxEl: calendarBox,
                        activeClass: 'cur',
                        updateDate: function(data) {
                            me.dateData = data;
                        }
                    })
                }
            });

             this.$el = this.dialogObj.$el;

            this.formEl = this.$el.find('form');
            this.validate();
        },
        addComparison: function(){
            var result = this.formEl.valid();
            if(!result)return;
            var me= this;
            var data = {
                name: this.$el.find('.name-input').val(),
                from: 'detail',
                sex: this.$el.find('input:checked').parent().text(),
                GanZhiYear: this.dateData.GanZhiYear,
                GanZhiMonth: this.dateData.GanZhiMonth,
                GanZhiDay: this.dateData.GanZhiDay,
                GanZhiHour: this.dateData.GanZhiHour,
                solarDate: [this.dateData.year, this.dateData.month, this.dateData.day],
                timeDate: [this.dateData.hour, this.dateData.min, '00']
            }
            var model = new ComparisonItem(data);
            model.fetchDetailInfo(function(){

                comparisons.add(model);
                // Local.comparisonPageView.addOne(model);
                me.dialogObj.removeDialog();
            });
            
        },
        selectSex:function(e){
            var label = e.target;
            if(e.target.tagName === 'LI'){
                label = label.parentNode;
            }
            $(label).addClass('on').siblings().removeClass('on');
        },
        validate: function(){
            this.formEl.validate({
                rules:{
                    name:{
                        required: true,
                        minlength: 2
                    }
                },
                messages: {
                    name: {
                        required: '请输入姓名',
                        minlength: '姓名最小长度为2'
                    }
                }
            })

        }

    });
})(window, BAZI);