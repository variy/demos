(function(win,utilities) {
    BAZI.calCtrlBar = function(opts) {
        this.options = opts;

        this.settings = {
            hasGanZhi: true,
            activeClass: 'cur'
        };
        $.extend(this.settings, opts);
        this.oBoxEl = opts.oBoxEl;
        this.render();
        this.initEvent();
    };

    BAZI.calCtrlBar.prototype = {
        render: function() {
            var html = $.tmpl(BAZI.tpls.tpls_cal_ctrlBar)({hasGanZhi: this.settings.hasGanZhi});
            this.el = $(html);
            this.el.appendTo(this.oBoxEl);

            this.typeToggleBtn = this.el.find('.calendar-type');
            this.calLunarInfoBox = this.el.find('.cal-lunar-info');
        },

        initEvent: function() {
            this.el.on('updateDate', function(e,data){
                me.options.updateDate(data);
            });

            var me = this;
            var calendar = new Calendar({
                boxEl: me.oBoxEl,
                defaultDate: me.options.defaultDate

            }, function(data) {
                me.refreshDate.call(me, data);
                me.el.trigger('updateDate',data);
            });

            calendar.$el.on('dateChange', function(e, data) {
                if( 'nextShow' in data){
                    me.el.find('.' + me.settings.activeClass).removeClass(me.settings.activeClass)
                        .end().find('[data-send='+ data.nextShow+']').addClass(me.settings.activeClass);
                }
                me.refreshDate(data.result);
                me.el.trigger('updateDate',data.result);
            });

            calendar.$el.on('calendarHide', function(e, data) {
                 me.el.find('.' + me.settings.activeClass).removeClass(me.settings.activeClass);
            });



                // 日期界面切换
            this.el.delegate('.cal-picker-ctrl', 'click', function(e) {
                me.el.find('.' + me.settings.activeClass).removeClass(me.settings.activeClass);
                $(this).addClass(me.settings.activeClass);

                var type = $(this).data('send');

                me.el.find('[data-send='+type+']').addClass(me.settings.activeClass);
                calendar.showPannel(type);
            });
            // 阴阳历切换
            me.calLunarInfoBox.find('[data-caltype=cal]').each(function() {
                $(this).css('display', 'inline-block').siblings().hide();
            });
            this.typeToggleBtn.delegate('.cal-type-item', 'click', function(e) {
                $(this).addClass('active').siblings().removeClass('active');
                var calType = $(this).data('caltype');
                calendar.toggleCalType();
                me.calLunarInfoBox.find('[data-caltype=' + calType + ']').each(function() {
                    $(this).css('display', 'inline-block').siblings().hide();
                });
            });

        },

        refreshDate: function(data) {
            var me = this;
            data.datailHour = data.hour + ':' + data.min + ':' + data.second + data.GanZhiHour.slice(1);
            var renderDataType = ['year', 'month', 'day', 'lunarYear', 'lunarMonthName', 'lunarDayName', 'GanZhiYear', 'GanZhiMonth', 'GanZhiDay', 'GanZhiHour', 'datailHour']
            renderDataType.forEach(function(type) {
                me.el.find('[data-fill=' + type + ']').html(data[type]);
            });

        }
    }

    /****日历对象，result值始终是满的****/
    function Calendar(opts, loadSuccess) {
        this.options = opts;
        this.result = utilities.getDateData(opts.defaultDate); //时间初始化
        this.isLunarInput = opts.isLunarInput === undefined ? false : opts.isLunarInput;
        this.settings = {
            startYear: 1601,
            long: 600,
            chosenClass: 'cur'
        };

        $.extend(true, this.settings, opts);

        this.oBox = $(opts.boxEl);
        this.init(loadSuccess);
    }

    Calendar.prototype = {

        init: function(cb) {
            var me = this;

            $(BAZI.tpls.tpls_calendar).appendTo(this.oBox);
            this.$el = this.oBox.find('.datetimepicker');

            this.el = {
                tops: me.oBox.find('.datetimepicker-top'),
                pannelBox: me.oBox.find('.datetime-pannels-box'),

                years: me.oBox.find('.datetimepicker-years'),
                months: me.oBox.find('.datetimepicker-months'),
                days: me.oBox.find('.datetimepicker-days'),
                hours: me.oBox.find('.datetimepicker-hours')
            };

            this.prevBtn = this.el.tops.find('.date-toggle-btn.prev-btn');
            this.nextBtn = this.el.tops.find('.date-toggle-btn.next-btn');
            this.closeBtn = this.el.tops.find('.dialog-close');

            this.bindEvent();

            this.getYears();
            this.getMonths();
            this.getDays();
            this.getHours();

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
                self.setTops('month');
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
                self.setTops('day');
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

                self.setTops('hour');
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

            ~ function() {
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
            }();

            this.closeBtn.on('click',function(){
                self.hideCalendar();
            })


            this.$el.on('dateChange', function(event, data) {

                if (!('curEl' in data)) return;
                data.curEl.parents('.dates-tb').find('.' + self.settings.chosenClass).removeClass(self.settings.chosenClass);
                data.curEl.addClass(self.settings.chosenClass);
            });
        },

        topsInit: function(){
            this.isInitTops = true;
            var btnWidth = this.el.tops.find('.date-btn').outerWidth();
            var innerWidth = Math.floor( this.el.tops.innerWidth() - btnWidth*2 );
            var topInfoBox = this.el.tops.find('.top-info-box').width(innerWidth);

            this.yearsTop = this.el.tops.find('.year-slider-box');
            this.dateTop = this.el.tops.find('.date-except-year-toggle-box');
            this.initYearsTop();
        },

        setScrollTop: function(year) {
            // 一排5个
            var radix = 5;
            // var target = this.el.datePageBox.find('> [data-acpt='+ etype+']');
            var index = this.el.years.find('[data-year='+ year +']').index();
            var elHeight = this.el.years.find('.date-cell').outerHeight();
            var topY = Math.floor(index / 5) * elHeight;
            this.el.years.scrollTop(topY);
        },

        setTops: function(type) {
            var me = this;
            var html = "";

            // 阳历农历切换
            if (!type) {
                if (me.el.years[0].style.display == 'block') {
                    type = "year";
                } else if (me.el.months[0].style.display == 'block') {
                    type = "month";
                } else if (me.el.days[0].style.display == "block") {
                    type = "day";
                } else if (me.el.hours[0].style.display == "block") {
                    type = "hour";
                } else {
                    return;
                }
            }

            if (type == "year") {
                // me.setYearsTab();
                return;
            }

            var y = me.result.year + "(" + me.result.GanZhiYear + ")年";
            var m = me.result.month + "(" + me.result.GanZhiMonth + ")月";
            var d = me.result.day + "(" + me.result.GanZhiDay + ")日";

            // 阳历农历切换
            if (me.isLunarInput) {
                m = me.result.lunarMonthName + "(" + me.result.GanZhiMonth + ")";
                d = me.result.lunarDayName + "(" + me.result.GanZhiDay + ")";
            }

            switch (type) {
                case 'month':
                    html = y;
                    me.getMonths();
                    break;
                case 'day':
                    html = y + m;
                    me.getDays();
                    break;
                case 'hour':
                    html = y + m + d;
                    me.getHours();
                    break;
                default:
                    break;
            }
            this.el.tops.find('span').html(html);
            this.el.tops.show();

            // this.el.tops.find('.sub').unbind();
            // this.el.tops.find('.sub').on('click', function(){
            //     me.subFunc(type);
            // });
            // this.el.tops.find('.plus').unbind();
            // this.el.tops.find('.plus').on('click', function(){
            //     me.plusFunc(type);
            // });
        },

        initYearsTop: function() {
            var me = this;
            var startY = this.settings.startYear;
            var length = this.settings.long;
            var gap = 100;
            var iLength = parseInt(length / gap);
            var html = '';

            for (var i = 0; i < iLength; i++) {
                var a = startY + (i * 100);
                var b = startY + ((i + 1) * 100) - 1;
                if (me.result.year >= a && me.result.year <= b) {
                    html += "<i data-start=" + a + " class='cur'>" + a + "-" + b + "</i>";
                } else {
                    html += "<i data-start=" + a + ">" + a + "-" + b + "</i>";
                }
            }

            // this.el.tops.show();
            this.yearsTopScrollBox = this.yearsTop.find('.years-top-slider-box');
            this.prevYearBtn = this.yearsTop.find('.prev-btn');
            this.nextYearBtn = this.yearsTop.find('.next-btn');

            this.yearsTopScrollBox.html(html);
            var showNum = 3;
            var innerWidth = this.yearsTopScrollBox.innerWidth();
            var sliderWidth = Math.floor(innerWidth/showNum);
            var sliderNum = iLength;
            this.yearsTopScrollBox.width(sliderWidth*sliderNum);
            this.yearsTopScrollBox.find('i').width(sliderWidth);

            // 初始化
            this.yearsTopScrollBox.css('left','-'+sliderWidth*2+'px');
            this.el.years.scrollTop(4260);

            // top上slider的点击
            this.yearsTopScrollBox.delegate('i', 'click', function(event) {
                $(this).addClass('cur').siblings().removeClass('cur');
                var startYear = $(this).data('start');
                if( me.isLunarInput){
                    me.result.lunarYear = startYear;
                }else{
                    me.result.year = startYear;
                }
                me.result = utilities.getDateData(me.result, me.isLunarInput);

                // me.el.years.find('[data-year=' + startYear + ']').addClass(me.settings.chosenClass).siblings().removeClass(me.settings.chosenClass);
                me.setScrollTop(startYear);
            });

            // 暂时解除左右按钮的绑定，后续再添加滚动
            var scrollBox =  this.yearsTopScrollBox;
            // 切换按钮的点击
            this.prevYearBtn.unbind();
            this.prevYearBtn.on('click', function() {
                var index = scrollBox.find('.cur').index();
                if (index !== 0) {
                    var target = scrollBox.find('i').eq(index - 1);
                    var dis = Math.abs(scrollBox[0].offsetLeft) -   (target[0].offsetLeft + sliderWidth);
                    if( dis >= 0){
                        scrollBox.css('left','-'+(target[0].offsetLeft)+ 'px' );
                    }
                    target.trigger('click');
                }
            });
            this.nextYearBtn.unbind();
            this.nextYearBtn.on('click', function() {
                // if (me.isLunarInput) {
                //     this.el.typeToggleBtn.eq(0).trigger('click');
                // }
                var index = scrollBox.find('.cur').index();
                var length = scrollBox.find('i').length - 1;

                if (index !== length) {
                    var target = scrollBox.find('i').eq(index + 1);
                    var dis = target[0].offsetLeft - innerWidth;
                    if( dis >= 0){

                        scrollBox.css('left','-'+(dis+sliderWidth)+ 'px' );
                    }
                    target.trigger('click');
                }
            });



            // 滚动监听
            this.el.years.scroll(function(e) {
                // console.log(e.target.scrollTop)
                var y = e.target.scrollTop;
                var radix = 5;
                var elHeight = $(this).find('.date-cell').outerHeight();

                for (var i = 0; i < iLength; i++) {
                    var a = i * parseInt(100 / radix) * elHeight;
                    var b = (i + 1) * parseInt(100 / radix) * elHeight;
                    if (y >= a && y <= b) {
                        var target =  scrollBox.find('i').eq(i);
                        target.addClass('cur').siblings().removeClass('cur');
                        var dis = target[0].offsetLeft - innerWidth;
                        if( dis >= 0){

                            scrollBox.css('left','-'+(dis+sliderWidth)+ 'px' );
                        }
                        var dis2 = Math.abs(scrollBox[0].offsetLeft) -   (target[0].offsetLeft + sliderWidth);
                        if( dis2 >= 0){
                            // debugger;
                            scrollBox.css('left','-'+(target[0].offsetLeft)+ 'px' );
                        }
                    }
                }
            });
        },

        getYears: function() {
            var years = utilities.getYearsData(this.settings.startYear, this.settings.long);
            var html = $.tmpl(BAZI.tpls.tpls_cal_years, {
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
            var targetMonth = '';
            if (this.isLunarInput) {
                var MonthsData = utilities.getMonthsDataFromLunar(this.result.lunarYear); //获取当年每月的干支
                targetMonth = this.result.lunarMonth;
            } else {
                var MonthsData = utilities.getMonthsData(this.result.year); //获取当年每月的干支
                targetMonth = this.result.month;
            }

            var html = $.tmpl(BAZI.tpls.tpls_cal_months, {
                months: MonthsData
            })
            this.el.months.children().remove().end().html(html);
            this.el.months.find('[data-month=' + targetMonth + ']').addClass(this.settings.chosenClass);

        },

        getDays: function() {
            var html = $.tmpl(BAZI.tpls.tpls_cal_days);
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
                        var html = '<td class="date-cell day-cell" data-solar=' + (j + 1) + '><p class="date-lunar">' + lunarInfo + '</p><p class="date-day">' + (j + 1) + '</p><p class="date-ganzhi">' + data.monthData[j].GanZhiDay + '</p></td>';
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

            var html = $.tmpl(BAZI.tpls.tpls_cal_hours, {
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
            !(this.isInitTops) && this.topsInit();
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
        }
    }

 //   win.Calendar = Calendar;

})(window,BAZI.utilities);