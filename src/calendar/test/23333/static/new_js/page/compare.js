(function(win, Bazi){

    // 发布订阅
    var publisher = {
        subscribers: {
            any: [] // 对应事件类型的订阅者
        },
        subscribe: function(fn, type) {
            type = type || 'any';
            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn);
        },
        unsubscribe: function(fn, type) {
            this.visitSubscribers('unsubscribe', fn, type);
        },
        publish: function(publication, type) {
            this.visitSubscribers('publish', publication, type);
        },
        visitSubscribers: function(action, arg, type) {
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                i,
                max = subscribers.length;

            for (i = 0; i < max; i += 1) {
                if (action === 'publish') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };

    var makePublisher = function(o) {
        var i;
        for (i in publisher) {
            if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
                o[i] = publisher[i];
            }
        }
        o.subscribers = {
            any: []
        };
    };
    // 八字对比 目前需要传一个唯一的compareid
    win.ComparisonItem = function(opts){
        this.options = opts;
        this.name = opts.name;
        this.sex = opts.sex;
        this.GanZhiYear = opts.GanZhiYear;
        this.GanZhiMonth =  opts.GanZhiMonth;
        this.GanZhiDay = opts.GanZhiDay;
        this.GanZhiHour = opts.GanZhiHour;
        this.solarDateStr = opts.solarDateStr;
        this.compareid = opts.compareid;
        this.init();
        opts.cb && opts.cb(this);
        // this.fetchDetailInfo();
    };

    ComparisonItem.prototype = {
        init: function(){

        },
        destroy: function(){
            this.options.ondestroy && this.options.ondestroy();
        },
        fetchDetailInfo: function(cb){
            var me = this;
            var year = this.solarDateStr.match(/\d*年/)[0].slice(0,-1);
            var month = this.solarDateStr.match(/\d*月/)[0].slice(0,-1);
            var day = this.solarDateStr.match(/\d*日/)[0].slice(0,-1);
            var hour = this.solarDateStr.match(/\d*时/)[0].slice(0,-1);
            var min = this.solarDateStr.match(/\d*分/)[0].slice(0,-1);
            var data = {
                mod:'paipan',
                act:'getBase',
                rName: me.name,
                iGender: me.sex === '男'? 0: 1,
                sDate: Bazi.Common.formatDateData(year, month, day),
                sTime: Bazi.Common.formatTimeData(hour, min, 0)
            };

            $.ajax({
                url: '/recordlist',
                data: data,
                type: 'POST',
                success: function(data){
                    var result = {
                        from: 'detail',

                        solarOrLunar: Bazi.lang.solarOrLunar[data.solarOrLunar],
                        shengXiao: Bazi.lang.shengXiao[data.shengXiao],
                        vage: data.vage,
                        startLunckStr: Bazi.Common.setLuck(data.aStartLuck),

                        yearGanWuXing: Bazi.lang.wuXing[data.aSiZhu.yearZhu.tianGanAttr.wuXing[0]],
                        yearZhiWuXing: Bazi.lang.wuXing[data.aSiZhu.yearZhu.diZhiAttr.wuXing[0]],
                        monthGanWuXing: Bazi.lang.wuXing[data.aSiZhu.monthZhu.tianGanAttr.wuXing[0]],
                        monthZhiWuXing: Bazi.lang.wuXing[data.aSiZhu.monthZhu.diZhiAttr.wuXing[0]],
                        dayGanWuXing: Bazi.lang.wuXing[data.aSiZhu.dayZhu.tianGanAttr.wuXing[0]],
                        dayZhiWuXing: Bazi.lang.wuXing[data.aSiZhu.dayZhu.diZhiAttr.wuXing[0]],
                        hourGanWuXing: Bazi.lang.wuXing[data.aSiZhu.hourZhu.tianGanAttr.wuXing[0]],
                        hourZhiWuXing: Bazi.lang.wuXing[data.aSiZhu.hourZhu.diZhiAttr.wuXing[0]],

                        mingju: Bazi.Common.getMingjuVal(data.mingju),
                        goodLuckYears: data.goodLuckYears.map(function(item) {
                            return {
                                age: item.age,
                                GanZhi: Bazi.lang.tianGan[item.tianGanAttr.attrVal] + Bazi.lang.diZhi[item.diZhiAttr.attrVal]
                            }
                        })

                    };
                    $.extend(me, result);
                    cb && cb();

                }
            })
        }
    };

    win.ComparisonCollection = {
        collection: [],
        add: function(item){
            $('[data-becompareid='+item.compareid+']').css('border-color','red');
            this.collection.push(item);
            this.publish(item, 'add');
        },
        remove: function(id){
            var model = _.findWhere(ComparisonCollection.collection, {compareid: id});
            model.destroy();
            ComparisonCollection.collection = _.reject(ComparisonCollection.collection, function(item){
                return item.compareid == id;
            });
            this.publish(id, 'remove');
        },
        clear: function(opts){
            var me = this;
            this.collection.forEach(function(item){
                me.remove(item.compareid);
            });
        }
    };

    makePublisher(ComparisonCollection);
    ComparisonCollection.subscribe(function(data){
        // console.log(data);
        var html = _.template(Bazi.tpls.tpls_dif_left_item)({data: data});
        $('.different-left .dif-left-list').append($('<li data-compareid='+ data.compareid +'>'+html+'</li>'));
    }, 'add');

    ComparisonCollection.subscribe(function(id){
        $('[data-compareid='+id+']').remove();
    }, 'remove');

    var ComparisonSideView = {
        init: function(){
            this.$el = $('.different-left');
            this.initEvent();
        },
        initEvent: function(){
            var me = this;
            this.$el.find('.dif-left-list').on('click', '.del-dif', function(e) {
                var compareEl = $(e.currentTarget).parent().parent();
                var id = compareEl.data('compareid') + '';
                ComparisonCollection.remove(id);
            });

            this.$el.find('.close-dialog').on('click', function(){
                me.$el.slideUp(200,function(){
                    ComparisonCollection.clear();
                });
                
            });

            this.$el.find('.clear').on('click', function(e) {
                ComparisonCollection.clear();
            });
            // 对比按钮点击
            this.$el.find('.compare').on('click', function(e) {
                if (ComparisonCollection.collection.length === 0) {
                    Bazi.pop.show({
                        prompt: '请添加对比项',
                        timeout: 1000
                    });
                    return;
                }

                if (ComparisonCollection.collection.length === 1) {
                    Bazi.pop.show({
                        prompt: '请至少选择两项',
                        timeout: 1000
                    })
                    return;
                }

                var len = ComparisonCollection.collection.length;
                var count = 0;
                ComparisonCollection.collection.forEach(function(model) {
                    model.fetchDetailInfo(function() {
                        count++;

                        if (count === len) {
                            ComparisonPageView.init();
                        }
                    });
                });

            });
        }
    };
    ComparisonSideView.init();

    var ComparisonPageView = {
        init: function(){
            this.render();
            this.initEvent();
        },
        render: function(){
            var obj = Bazi.pop.show({
                html: Bazi.tpls.tpls_Different,
                title: '八字对比',
                width: '1000',
                id:'duibi'
            });
            this.$el = $(obj.frame);

            this.containerEl = this.$el.find('.dif-table tbody');
            this.addAll();
        },
        addOne: function(model){
            if( model.from === 'detail'){
                var view = new DetailItemView(model);
                this.containerEl.append(view.render().$el);
                Bazi.pop.get('duibi').resize();
            }
        },
        addAll: function(){
            var me = this;

            ComparisonCollection.collection.forEach(function(model){
                me.addOne(model);
            });

        },
        initEvent: function(){
            this.addBtn = this.$el.find('.btn-add-comparison');
            this.addBtn.click(function() {
                new AddComparisonView();
            });
        }
    };
    
    // 对比条目
    function DetailItemView(model){
        this.model = model;
        this.template =  _.template(Bazi.tpls.tpls_Different_item);
    }

    DetailItemView.prototype = {
        init: function(){
            this.render();
            this.initEvent();
        },
        render: function(){
            this.$el = $('<tr></tr>');
            var html = this.template({data: this.model});
            this.$el.html(html);
            this.initEvent();
            return this;
        },
        initEvent: function(){
            var me = this;
            this.$el.find('.del-comparison-item').click(function(){
                me.remove();
            });
        },
        remove: function(){
            this.$el.remove();
            ComparisonCollection.remove(this.model.compareid);
            Bazi.pop.get('duibi').resize();
        }
    };

    // 新增对比弹框
    function AddComparisonView(){
        this.render();
        this.initEvent();
    }
    AddComparisonView.prototype = {
        render: function(){
            var me = this;
            this.dialogObj = Bazi.pop.show({
                title:'新加对比',
                html: Bazi.tpls.tpls_Different_add,
                width: '600'
            });

            this.$el = $(this.dialogObj.frame);
            var calendarBox = this.$el.find('#add-comparison-from-calendar');
            new Bazi.calCtrlBar({
                oBoxEl: calendarBox,
                activeClass: 'cur',
                updateDate: function(data) {
                    me.dateData = data;
                }
            });

            this.formEl = this.$el.find('form');
            this.validate();
        },

        initEvent: function(){
            var me = this;
            this.$el.find('.add-comparison-btn').click(function(){
                me.addComparison();
            });

            this.$el.find('#dif-sex-tab').click(function(e){
                me.selectSex(e);
            });
        },
        selectSex:function(e){
            var label = e.target;
            if(e.target.tagName === 'LI'){
                label = label.parentNode;
            }
            $(label).addClass('on').siblings().removeClass('on');
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
                solarDateStr: this.dateData.year + '年'+ this.dateData.month +'月'+ this.dateData.day +'日'+ this.dateData.hour +'时'+this.dateData.min+'分',
                compareid: _.uniqueId('')
            }
            var model = new ComparisonItem(data);
            model.fetchDetailInfo(function(){
                ComparisonCollection.add(model);
                ComparisonPageView.addOne(model);
                // Local.comparisonPageView.addOne(model);
                // me.dialogObj.removeDialog();
            });
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
    }

})(window, Bazi);