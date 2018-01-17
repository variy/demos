(function(win) {

    win.CalCtrl = function(opts){
        this.options = opts;
        this.inputEl = opts.inputEl;
        this.init();
        this.initEvent();
    } 

    CalCtrl.prototype = {
        init: function(){
            this.calendar = new Calendar({
                
            }, function(data) {
                // me.el.trigger('updateDate',data);
            });
        },
        initEvent: function(){
            var me = this;
            this.inputEl.on('focus',function(){
                me.showDropDownMenu.call(me);
            })
        },
        showDropDownMenu: function(){
            debugger;
            this.showCalendarEl();     
        },
        
        showCalendarEl: function(){
            this.calendar.showPannel('year');
        }    
    }

    win.Calendar = Calendar;

    function Calendar(opts, loadSuccess) {
        this.options = opts;
        this.result = {}; //时间初始化
        this.isLunarInput = opts.isLunarInput === undefined ? false : opts.isLunarInput;
        this.settings = {
            startYear: 1980,
            long: 16,
            chosenClass: 'cur'
        };

        $.extend(true, this.settings, opts);
        this.init(loadSuccess);
    }

    Calendar.prototype = {

        init: function(cb) {
            var me = this;
            this.$el = $(tpls.tpls_calendar);
            
            this.$el.appendTo($('body'));
            
            var zIndex =  9999;
            this.$el.css('z-index', zIndex)

            this.el = {
                tops: me.$el.find('.datetimepicker-top'),
                pannelBox: me.$el.find('.datetime-pannels-box'),

                years: me.$el.find('.datetimepicker-years'),
                months: me.$el.find('.datetimepicker-months'),
                days: me.$el.find('.datetimepicker-days'),
                hours: me.$el.find('.datetimepicker-hours')
            };

            this.prevBtn = this.el.tops.find('.date-toggle-btn.prev-btn');
            this.nextBtn = this.el.tops.find('.date-toggle-btn.next-btn');
            this.closeBtn = this.el.tops.find('.dialog-close');
            this.curTime = this.el.tops.find('.picker-cur-datetime');
            this.bindEvent();

            this.getYears();
            /*this.getMonths();
            this.getDays();
            this.getHours();*/

            cb && cb(this.result);
        },

        bindEvent: function() {
            var self = this;
            this.el.years.delegate('.date-cell', 'click', function(e) {
                var me = $(this);
                var newYear = me.find('> .cal-year').text();
                if (self.isLunarInput) {
                    self.result.lunarYear = newYear;
                } else {
                    self.result.year = newYear;
                }

                self.result = utilities.getDateData(self.result, self.isLunarInput);
                // self.setTops('month');
                self.getMonths();

                self.showPannel('month');
                self.$el.trigger('dateChange', {
                    'result': self.result,
                    'nextShow': 'month',
                    'curEl': me
                });
            });

            this.el.months.delegate('.date-cell', 'click', function() {
                var me = $(this);
                var newMonth = $(this).data('month');
                if (self.isLunarInput) {
                    self.result.lunarMonth = newMonth;
                } else {
                    self.result.month = newMonth;
                }

                self.result.month = newMonth;
                self.result = utilities.getDateData(self.result, self.isLunarInput);
                // self.setTops('day');
                self.getDays();

                self.showPannel('day');

                self.$el.trigger('dateChange', {
                    'result': self.result,
                    'nextShow': 'day',
                    'curEl': me
                });

            });

            this.el.days.delegate('.date-cell', 'click', function() {
                var me = $(this);
                var newDay = parseInt($(this).data('solar'));
                // var newDay = $(this).find('> .date-day').html().match(/^\d+/)[0];
                // 农历输入 在选择日期的时候可以直接获取农历的日期
                self.result.day = newDay;
                self.result = utilities.getDateData(self.result, false);

                // self.setTops('hour');
                self.getHours();

                self.showPannel('hour');

                self.$el.trigger('dateChange', {
                    'result': self.result,
                    'nextShow': 'hour',
                    'curEl': me
                });
            });

            this.el.hours.delegate('.date-cell', 'click', function() {
                var me = $(this);
                var newHour = $(this).data('hour');
                if (newHour != self.result.hour) {
                    self.result.hour = newHour;
                    self.result = utilities.getDateData(self.result);
                }

                self.$el.trigger('dateChange', {
                    'result': self.result,
                    'curShow': 'hour',
                    'curEl': me
                });
            });

            this.prevBtn.on('click', function() {
                switch (self.curPannel) {
                    case 'year':

                    break;
                    case 'month':
                        if (self.isLunarInput) {
                            self.result.lunarYear--;
                        }else{
                            self.result.year--;
                        }
                        self.result = utilities.getDateData(self.result, self.isLunarInput);
                        self.getMonths();
                        self.updataTopTxt('month');
                        break;

                    case 'day':

                        if (self.result.month === 1) {
                            self.result.month = 12;
                            self.result.year--;
                        } else {
                            self.result.month--;
                        }
                        self.result = utilities.getDateData(self.result, false);


                        self.getDays();
                        self.updataTopTxt('day');
                        break;

                    case 'hour':
                        self.result = utilities.getYesterdayData(self.result);
                        self.getHours();
                        self.updataTopTxt('hour');
                        break;
                }

                self.$el.trigger('dateChange', {
                    'result': self.result
                });
            });

            this.nextBtn.on('click', function() {
                switch (self.curPannel) {
                    case 'year':

                        break;
                    case 'month':
                        if (self.isLunarInput) {
                            self.result.lunarYear++;
                        }else{
                            self.result.year++;
                        }
                        self.result = utilities.getDateData(self.result, self.isLunarInput);
                        self.getMonths();
                        self.updataTopTxt('month');
                        break;

                    case 'day':

                        if (self.result.month === 12) {
                            self.result.month = 1;
                            self.result.year++;
                        } else {
                            self.result.month++;
                        }
                        self.result = utilities.getDateData(self.result, false);


                        self.getDays();
                        self.updataTopTxt('day');
                        break;

                    case 'hour':
                        self.result = utilities.getTomorrowData(self.result);
                        self.getHours();
                        self.updataTopTxt('hour');
                        break;
                }

                self.$el.trigger('dateChange', {
                    'result': self.result
                });

            });

            /*~ function() {
                if (self.oBox.attr('id') !== undefined) {
                    var str = '#' + self.oBox.attr('id');
                } else if (self.oBox.attr('class') !== undefined) {
                    var str = '.' + self.oBox.attr('class').replace(/\s/g, '.');
                } else {
                    throw new Error('日历的box元素没有id也没有class');
                }
                $('body').on('click', function(e) {

                    if ($(e.target).parents(str).length === 0) {
                        self.hideCalendar();
                    }
                });
            }();*/

            this.closeBtn.on('click',function(){
                self.hideCalendar();
            })


            this.$el.on('dateChange', function(event, data) {
                if (!('curEl' in data)) return;
                data.curEl.parents('.dates-tb').find('.' + self.settings.chosenClass).removeClass(self.settings.chosenClass);
                data.curEl.addClass(self.settings.chosenClass);
            });
        },

        getYears: function() {
            // debugger;
            var years = utilities.getYearsData(this.settings.startYear, this.settings.long);
            var html = _.template(tpls.tpls_cal_years)({
                years: years
            });
            this.el.years.html(html);
            // this.el.tops.hide();

            var targetYear = 0;
            if (this.isLunarInput) {
                targetYear = this.result.lunarYear;
            } else {
                targetYear = this.result.year;
            }

            // this.setYearsTab();
            this.el.years.find('[data-year=' + targetYear + ']').addClass(this.settings.chosenClass);
        },

        getMonths: function() {
            debugger;
            var targetMonth = '';
            if (this.isLunarInput) {
                var MonthsData = utilities.getMonthsDataFromLunar(this.result.lunarYear); //获取当年每月的干支
                targetMonth = this.result.lunarMonth;
            } else {
                var MonthsData = utilities.getMonthsData(this.result.year); //获取当年每月的干支
                targetMonth = this.result.month;
            }

            var html = _.template(tpls.tpls_cal_months, {
                months: MonthsData
            })
            this.el.months.children().remove().end().html(html);
            // this.el.months.find('[data-month=' + targetMonth + ']').addClass(this.settings.chosenClass);

        },

        getDays: function() {
            var html = _.template(tpls.tpls_cal_days);
            this.el.days.html(html);
            this.el.days.tbody = this.el.days.find('tbody');

            /***日的界面，星期从星期一开始***/
            var data = '';
            if (this.isLunarInput) {
                data = utilities.getDaysDataFromLunar(this.result.lunarYear, this.result.lunarMonth);
                now = data.lunarDay;
            } else {
                data = this.result;
                now = data.day;
            }
            /***生成六行 七列的表格，42个格子 可以容纳所有日期的排列，最后一行没数据的话就自动隐藏***/
            var tbodyHTML = [];
            var total = 42;
            var start = data.monthFirstDay - 1;
            // debugger;
            for (var i = 0; i < 42; i++) {
                if (i < start || i >= data.monthDays + start) {
                    tbodyHTML.push('<td class="day-cell empty-cell"></td>');
                } else {
                    var j = i - start
                    if (this.isLunarInput) {
                        var html = '<td class="date-cell day-cell" data-solar=' + data.monthData[j].day + '>\
                            <p class="date-lunar">' + data.monthData[j].day + '</p>\
                            <p class="date-day">' + data.monthData[j].lunarInfo + '</p>\
                            <p class="date-ganzhi">' + data.monthData[j].ganzhi + '</p>\
                            </td>';
                    } else {
                        var lunarInfo = data.monthData[j].term === undefined ? data.monthData[j].lunarDayName : data.monthData[j].term;
                        if (lunarInfo === undefined) {
                            throw new Error('cant find the luanrInfo,the date info is' + JSON.stringify(data) + 'day_s index is' + j);
                        }
                        var html = '<td class="date-cell day-cell" data-solar=' + (j + 1) + '><span class="day-cell-main date-day">' + (j + 1) + '</span><span class="day-cell-lesser date-lunar">' + lunarInfo + '</span><span class="day-cell-lesser date-ganzhi">' + data.monthData[j].GanZhiDay + '</span></td>';
                    }
                    tbodyHTML.push(html);
                }

                if (i % 7 == 0) {
                    if (i != 0) {
                        tbodyHTML[i - 1] += '</tr>';
                    }
                    tbodyHTML[i] = '<tr>' + tbodyHTML[i];
                }

            };
            tbodyHTML[total - 1] += '</tr>';

            var html = tbodyHTML.join('');
            this.el.days.tbody.children().remove().end().html(html);
            this.el.days.tbody.find('[data-solar=' + this.result.day + ']').addClass(this.settings.chosenClass);
        },

        getHours: function() {
            var ganDay = this.result.GanZhiDay.charAt(0);
            var hours = utilities.getGanZhiHours(ganDay); //获取一天内小时和干支时的对象的数组

            var html = _.template(tpls.tpls_cal_hours, {
                hours: hours
            });
            this.el.hours.children().remove().end().html(html);
            this.el.hours.find('[data-hour=' + this.result.hour + ']').addClass(this.settings.chosenClass);

            this.initHours();
        },

        initHours: function() {
            var me = this;
            var formatOpt = function(num) {
                    var html = '';
                    for (var i = 0; i < num; i++) {
                        var n = i < 10 ? ('0' + i) : i;
                        var opt = "<option data-opt= " + n + ">" + n + "</option>";
                        html += opt;
                    }
                    return html;
                }
                // 初始化"详细"
            this.el.hours.find('.selectH').html(formatOpt(24));
            this.el.hours.find('.selectM').html(formatOpt(60));
            this.el.hours.find('.selectS').html(formatOpt(60));

            this.el.hours.find('.selectH, .selectM, .selectS').change(function() {
                var h = me.el.hours.find('.selectH').find("option:selected").data('opt');
                var m = me.el.hours.find('.selectM').find("option:selected").data('opt');
                var s = me.el.hours.find('.selectS').find("option:selected").data('opt');
                $.extend(me.result, {
                    hour: parseInt(h)
                });
                me.result = utilities.getDateData(me.result);
                $.extend(me.result, {
                    min: parseInt(m),
                    second: parseInt(s)
                });

                me.$el.trigger('dateChange', {
                    'result': me.result
                });

            });

            var setDetailTime = function() {
                var h = me.result.hour < 10 ? ('0' + me.result.hour) : me.result.hour;
                var m = me.result.min < 10 ? ('0' + me.result.min) : me.result.min;
                var s = me.result.second < 10 ? ('0' + me.result.second) : me.result.second;

                $('.condensed-bd-simple').find('[data-hour=' + me.result.hour + ']').addClass(me.settings.chosenClass).siblings().removeClass(me.settings.chosenClass);

                me.el.hours.find('.selectH').find('[data-opt=' + h + ']').attr('selected', 'selected');
                me.el.hours.find('.selectM').find('[data-opt=' + m + ']').attr('selected', 'selected');
                me.el.hours.find('.selectS').find('[data-opt=' + s + ']').attr('selected', 'selected');
            };

            // "简易"和"详细"tab操作
            var tab = this.el.hours.find('.condensed-hd-tab');
            var content = this.el.hours.find('.condensed-bd');
            tab.find('.col-bnt').unbind();
            tab.find('.col-bnt').on('click', function() {
                var index = $(this).index();
                $(this).addClass('on').siblings().removeClass('on');
                content.find('.condensed-bd-item').eq(index).show().siblings().hide();
                setDetailTime();
            });

        },

        updataTopTxt: function(type) {
            var me = this;
            if (type === 'year') {
                this.yearsTop.show();
                this.dateTop.hide();
                
            } else {
                this.dateTop.show();
                this.yearsTop.hide();

                if (!me.isLunarInput) {
                    var y = me.result.year + "(" + me.result.GanZhiYear + ")年";
                    var m = me.result.month + "(" + me.result.GanZhiMonth + ")月";
                    var d = me.result.day + "(" + me.result.GanZhiDay + ")日";

                    // 阳历农历切换
                } else {
                    var y = me.result.lunarYear + "(" + me.result.GanZhiYear + ")年";
                    var m = me.result.lunarMonthName + "(" + me.result.GanZhiMonth + ")";
                    var d = me.result.lunarDayName + "(" + me.result.GanZhiDay + ")";
                }
                // debugger;
                switch (type) {
                    case 'month':
                        html = y;
                        break;
                    case 'day':
                        html = y + m;
                        break;
                    case 'hour':
                        html = y + m + d;
                        break;
                    default:
                        break;
                }
                this.dateTop.find('.top-info-box').html(html);
                this.el.tops.show();
            }
        },

        showChooseDate: function() {
            this.$el.find('.' + this.settings.chosenClass).removeClass(this.settings.chosenClass);
            var target = {},
                me = this.result;
            if (!this.isLunarInput) {
                target = {
                    year: me.year,
                    month: me.month
                }
            } else {
                target = {
                    year: me.lunarYear,
                    month: me.lunarMonth
                }
            }

            this.el.years.find('[data-year=' + target.year + ']').addClass(this.settings.chosenClass);
            this.el.months.find('[data-month=' + target.month + ']').addClass(this.settings.chosenClass);
            this.el.days.find('[data-solar=' + this.result.day + ']').addClass(this.settings.chosenClass);
            this.el.hours.find('[data-hour=' + this.result.hour + ']').addClass(this.settings.chosenClass);
        },
        showPannel: function(type) {
            
            this.$el.show();
            this.el.tops.show();
            this.el.pannelBox.find('> [data-acpt=' + type + ']').show().siblings('.dates-tb').hide();
            this.curPannel = type;
            this.updataTopTxt(type);
        },
        toggleCalType: function(){
            this.isLunarInput = !this.isLunarInput;
            this.getMonths();
            this.getDays();
            this.showChooseDate();
        },
        hideCalendar: function(){
            this.$el.hide();
            this.$el.trigger('calendarHide');
        },
        removeCalendarEl: function(){
            this.$el.remove();
        }
    }

 //   win.Calendar = Calendar;

})(window);