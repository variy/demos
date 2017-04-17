~function(win){

    var utilities = {
        init: function(){
            /******'算法'中,天干地支的索引值都是从1开始*******/
            this.tianganArr = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
            this.dizhiArr = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];


            this.lunarMonthName = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
            this.lunarHourName = ["零点", "一点", "二点", "三点", "四点", "五点", "六点", "七点", "八点", "九点", "十点", "十一点", "十二点", "十三点", "十四点", "十五点", "十六点", "十七点", "十八点", "十九点", "二十点", "二十一点", "二十二点", "二十三点"];
            this.dataInit();
        },

        dataInit: function(){
            var self = this;

            // 得到24小时对应的时支
            var getZhiHour= function(){
                var zhi = [];
                self.dizhiArr.forEach(function(o){
                    zhi.push(o,o);
                });
                var zhi = zhi.concat( zhi.splice(0,1) );
                return zhi;
            };

            //得到干支表
           var getGanZhi= function(){

                var ganzhi = [];
                var firstGanzhi = self.tianganArr[0] + self.dizhiArr[0];
                ganzhi.push(firstGanzhi);
                var str ='',i=1;
                var len1 = self.tianganArr.length, len2 = self.dizhiArr.length;

                while(str!=firstGanzhi){
                    str = self.tianganArr[i%len1]+self.dizhiArr[i%len2];
                    ganzhi.push(str);
                    i++;
                }
                ganzhi.splice(ganzhi.length-1,1);
                return ganzhi;
            };

            this.zhiHour = getZhiHour();
            this.ganzhi = getGanZhi();


            this.forGetYear_Gan = ['庚','辛','壬','癸','甲','乙','丙','丁','戊','己'];
            this.forGetYear_Zhi = ['申','酉','戌','亥','子','丑','寅','卯','辰','巳','午','未'];
        },

        // 获取小时的时干支
        getGanZhiHour: function(ganDay,hour){
            var ganDayIndex = this.tianganArr.indexOf(ganDay)+1;
            var zhiHourIndex = this.dizhiArr.indexOf(this.zhiHour[hour])+1;
            var ganHourIndex = (ganDayIndex*2 + zhiHourIndex -2)%10; //时干计算公式
                ganHourIndex = ganHourIndex == 0? 10:ganHourIndex;

            return this.tianganArr[ganHourIndex-1] +this.zhiHour[hour];
        },

        //获取一天内里每小时的小时时间和对应的时干支的对象的数组
        getGanZhiHours: function(ganDay){
            var ganzhiHours = [];

            for (var i = 0; i < 24; i++) {
                var ganzhiHour = this.getGanZhiHour(ganDay,i);
                ganzhiHours.push({calendar:(i+':00'), ganzhi:ganzhiHour});
            };
            return ganzhiHours;
        },
        // 获得年干支
        getGanzhiYear: function(year){

            var tiangan = this.forGetYear_Gan[parseInt((year+'').slice(-1))];
            var dizhi = this.forGetYear_Zhi[year%12];
            return tiangan+dizhi;
        },

        // 获得某年的所有月的 阳历月份的对应月干支（没选择到月，不精确）
        getMonthsData: function(year){
            var JanData = LunarCalendar.calendar(year,1,false); //获取当年一月份数据
            // 没选择到'日'时，取该月的月中那天的月干支作为当月的干支
            var self = this;

            var midDay = Math.floor(JanData.monthDays/2);
            var janGanZhi = JanData.monthData[midDay].GanZhiMonth;;

            //获取一月干支，然后从干支表中截取12个干支，为该年月份干支
            var beginIndex = this.ganzhi.indexOf(janGanZhi);
            if(beginIndex + 12 > this.ganzhi.length){  //干支从尾和头各取一段
                var ganzhi1 = this.ganzhi.slice(beginIndex);

                var endIndex = beginIndex + 12 - this.ganzhi.length;
                var ganzhi2 = this.ganzhi.slice(0,endIndex);
                var ganzhi = ganzhi1.concat(ganzhi2);
            }else{
                var ganzhi = this.ganzhi.slice(beginIndex,beginIndex+12);
            }

            var months = [];
            ganzhi.forEach(function(gz,i){
                var obj = {ganzhi:gz, solarOrLunar:(i+1)+'月'  };
                months.push(obj);
            })

            return months;
        },

        getMonthsDataFromLunar: function(lunarYear){
            // 获取农历正月初一的公历信息
            var solarInfo1 = LunarCalendar.lunarToSolar(lunarYear,1,1);
            // 通过该年的阳历6月1号获取闰月
            var leapMonth = LunarCalendar.calendar(lunarYear,6,false).monthData[0].lunarLeapMonth;

            var monthCount = leapMonth===0? 12:13;
            // 获取正月15的月干支作为当月干支
            var solarInfo2 = LunarCalendar.lunarToSolar(lunarYear,1,15);
            var GanZhi_lunarJan = LunarCalendar.calendar(solarInfo2.year,solarInfo2.month,false).monthData[solarInfo2.day-1].GanZhiMonth;

            var beginIndex = this.ganzhi.indexOf(GanZhi_lunarJan);
            if(beginIndex + monthCount > this.ganzhi.length){  //干支从尾和头各取一段
                var ganzhi1 = this.ganzhi.slice(beginIndex);

                var endIndex = beginIndex + monthCount - this.ganzhi.length;
                var ganzhi2 = this.ganzhi.slice(0,endIndex);
                var ganzhi = ganzhi1.concat(ganzhi2);
            }else{
                var ganzhi = this.ganzhi.slice(beginIndex,beginIndex+monthCount);
            }
            if(leapMonth === 0  ){
                var  lunarMonths = this.lunarMonthName.slice(0);
            }else{
                // debugger;
                var leapMonthName = this.lunarMonthName[leapMonth-1];
                leapMonthName = '闰'+leapMonthName;
                var  lunarMonths = this.lunarMonthName.slice();
                lunarMonths.splice(leapMonth,0,leapMonthName);
            }


            var lunarMonthData = [];
            lunarMonths.forEach(function(lunar,i){
                var obj = { solarOrLunar:lunar, ganzhi: ganzhi[i] }
                lunarMonthData.push(obj);
            })
            // console.log(lunarMonthData);
            return lunarMonthData;
        },
        // 获得农历月的日信息  ！
        getDaysDataFromLunar: function(lunarYear, lunarMonth){
            // debugger;
            // lunarMonth 农历月 范围[1-13]（有闰月情况，比如当前闰9月，10表示闰9月，11表示10月）
            // 获得该月初一的阳历信息
            var solarInfo = LunarCalendar.lunarToSolar(lunarYear,lunarMonth,1);
            // 获得阳历的该月信息,和下月信息。从中找到下一个初一的时间段，即为该月公历信息
            var curMonthDataAll = LunarCalendar.calendar(solarInfo.year, solarInfo.month,false);
            var curMonthData = curMonthDataAll.monthData;
            // 获得该月初一星期几
            var solarFirst = curMonthDataAll.firstDay; // 0-6
            var firstDay = ( solarFirst+(solarInfo.day-1)%7 )%7;
            firstDay = firstDay===0? 7: firstDay;

            var nextMonth = -1, yearOfNextMonth = -1;
            if( solarInfo.month===12){
               nextMonth = 1;
               yearOfNextMonth = solarInfo.year +1;
            }else {
               nextMonth = solarInfo.month+1;
               yearOfNextMonth = solarInfo.year
            }
            var nextMonthData = LunarCalendar.calendar(yearOfNextMonth, nextMonth,false).monthData;
            function getMonthData(){
                var firstLunarInfo = curMonthData[solarInfo.day-1].term === undefined ?  curMonthData[solarInfo.day-1].lunarDayName : curMonthData[solarInfo.day-1].term
                var monthData = [{day: solarInfo.day,lunarInfo: firstLunarInfo, ganzhi:curMonthData[solarInfo.day-1].GanZhiDay }];
                for (var i = solarInfo.day,len=curMonthData.length; i < len; i++) {
                    if( curMonthData[i].lunarDayName != '初一' ){
                        monthData.push({
                            day: curMonthData[i].day,
                            lunarInfo: curMonthData[i].term === undefined ? curMonthData[i].lunarDayName :curMonthData[i].term,
                            ganzhi: curMonthData[i].GanZhiDay
                        });
                    }else{
                        return monthData;
                    }
                };

                for (var i = 0,len=nextMonthData.length ; i < len; i++) {

                    if( nextMonthData[i].lunarDayName != '初一' ){
                        monthData.push({
                            day: nextMonthData[i].day,
                            lunarInfo: nextMonthData[i].term === undefined ? nextMonthData[i].lunarDayName :nextMonthData[i].term,
                            ganzhi: curMonthData[i].GanZhiDay
                        });
                    }else{
                        return monthData;
                    }
                };
                if( i==nextMonthData.length){ throw new Error('找不到初一！'+JSON.stringify(monthData))}
            }

            var monthData = getMonthData();

            console.log(monthData)
            return {monthData:monthData, monthFirstDay: firstDay,monthDays:monthData.length };
        },

        // 获得一段时间的年份和对应年干支的对象的数组
        getYearsData: function(begin,long){
            var begin = parseInt(begin);
            var long = parseInt(long);
            var ganzhiYears = [];
            for(var i=0; i<long; i++){
                var json ={};
                json.calendar = begin+i;
                json.lunar = this.getGanzhiYear( begin+i);
                ganzhiYears.push(json);
            }
            return ganzhiYears;
        },
        hasLeapMonth: function(year){
            return LunarCalendar.solarToLunar(year,1,1).lunarLeapMonth===0;
        },
        // 时间初始化
        getDateData: function(opts,needTurnSolar){

            var needTurnSolar = needTurnSolar===undefined? false: needTurnSolar;
            if( needTurnSolar){
                var solarInfo = LunarCalendar.lunarToSolar(opts.lunarYear,opts.lunarMonth,opts.lunarDay);
                $.extend(opts,solarInfo);
            }
            var settings = {
                year: 1980,
                month:1,
                day:1,
                hour:12
            }
            if( !(opts===undefined) ){
                _.extend(settings,opts);
            }else{
                var now = new Date();
                settings = {
                    year: now.getFullYear(),
                    month: now.getMonth()+1,
                    day: now.getDate(),
                    hour:now.getHours()
                }
            }
            var data = {};
            if ('calendarInfo' in localStorage && JSON.parse(localStorage.calendarInfo).year == settings.year && JSON.parse(localStorage.calendarInfo).month == settings.month  ){
                data = JSON.parse(localStorage.calendarInfo);
            }else {
                data = LunarCalendar.calendar(settings.year,settings.month,false);

                localStorage.calendarInfo = JSON.stringify(data);
            }
            // console.log(data)
            var result = data.monthData[settings.day-1];
            var monthInfo = {
                monthData: data.monthData,
                monthDays: data.monthDays,
                monthFirstDay:data.firstDay===0? 7:data.firstDay,
            };

             $.extend(result,monthInfo,{min:0,second:0});

            result.hour = settings.hour;
            result.lunarMonthName = result.lunarMonthName ==='十二月'?'腊月': result.lunarMonthName;
            result.GanZhiHour = this.getGanZhiHour(result.GanZhiDay.charAt(0),settings.hour);
            result.lunarHourName = this.lunarHourName[settings.hour];
            // console.log(result);
            return result;
        }

    }
    utilities.init();
    win.utilities = utilities;

    /****日历对象，result值始终是满的****/
    function Calendar(opts,loadSuccess){
        this.options = opts;
        this.result = utilities.getDateData(opts.defaultDate);  //时间初始化
        this.$el = $(opts.boxEl);
        this.isLunarInput = opts.isLunarInput=== undefined? false: opts.isLunarInput;

        this.init();
        this.renderMain(loadSuccess);
    }

    Calendar.prototype = {
        init:function(){
            this.tpls = {
                days:['<table class="table-condensed">',
                    '<thead>',
                        '<tr>',
                            '<th width="14.28%">一</th>',
                            '<th width="14.28%">二</th>',
                            '<th width="14.28%">三</th>',
                            '<th width="14.28%">四</th>',
                            '<th width="14.28%">五</th>',
                            '<th width="14.28%">六</th>',
                            '<th width="14.28%">日</th>',
                        '</tr>',
                    '</thead>',
                    '<tbody>',
                    '</tbody>',
                '</table>'].join(''),

                years:['<ul class="clearfix border-box table-condensed">',
                            '<% _.each(years,function(year){ %>',
                                '<li class="date-cell year-cell" data-year=<%= year.calendar%> >',
                                    '<p class="solar cal-year"><%= year.calendar%></p>',
                                    '<p class="lunar"><%= year.lunar%></p>',
                                '</li>',
                            '<%})%>',
                        '</ul>'].join(''),
                months:['<ul class="clearfix border-box table-condensed table-condensed-month">',
                            '<% _.each(months,function(month,i){%>',
                                '<li class="date-cell month-cell" data-month=<%=(i+1)%> >',
                                    '<p class="solar"><%=(month.solarOrLunar)%></p>',
                                    '<p class="lunar"><%=month.ganzhi%></p>',
                                '</li>',
                            '<%})%>',
                        '</ul>'].join(''),
                hours:[
                '<div class="condensed-bd">',
                    '<div class="condensed-bd-item">',
                        '<ul class="clearfix border-box table-condensed table-condensed-hours">',
                                '<% _.each(hours,function(hour,i){ %>',
                                    '<li class="date-cell hour-cell" data-hour=<%= i%> >',
                                        '<p class="solar"><%= hour.calendar%></p>',
                                        '<p class="lunar"><%= hour.ganzhi%></p>',
                                    '</li>',
                                '<% })%>',
                        '</ul>',
                    '</div>'].join('')
            };
        },

       renderMain: function(cb){
            var self = this;
            this.el = {
                years: $('<div class="dates-tb datetimepicker-years" data-acpt="year"></div>'),
                months:$('<div class="dates-tb datetimepicker-months"  data-acpt="month"></div>'),
                days:$('<div class="dates-tb datetimepicker-days" data-acpt="day"></div>'),
                hours: $('<div class="dates-tb datetimepicker-hours" data-acpt="hour"></div>')
            };
            for(var attr in this.el){
                this.$el.append(this.el[attr]);
            }
            this.renderBranch();

            this.bindEvent();

            this.getYears();
            this.getMonths();
            this.getDays();
            this.getHours();
            // this.showChooseDate();
            cb && cb(this.result);
        },

        bindEvent: function(){
            var self = this;
            this.el.years.delegate('.date-cell', supportEvent, function(e){
                var me = $(this);
                var newYear = me.find('> .cal-year').text();
                if(self.isLunarInput){
                    self.result.lunarYear = newYear;
                }else{
                    self.result.year = newYear;
                }


                self.result = utilities.getDateData(self.result,self.isLunarInput);

                self.getMonths();
                self.getDays();
                self.getHours();

                self.el.years.hide();
                self.el.months.show();

                self.$el.trigger('dateChange',{'result':self.result,'nextShow':'month','curEl':me});
            });

            this.el.months.delegate('.date-cell', supportEvent, function(){
                var me = $(this);
                var newMonth = $(this).data('month');
                if(self.isLunarInput){
                    self.result.lunarMonth = newMonth;

                }else{
                    self.result.month = newMonth;
                }

                self.result.month = newMonth;
                self.result = utilities.getDateData(self.result, self.isLunarInput);

                self.getDays();
                self.getHours();

                self.el.months.hide();
                self.el.days.show();

                self.$el.trigger('dateChange',{'result':self.result,'nextShow':'day','curEl':me});

            });

            this.el.days.delegate('.date-cell', supportEvent, function(){
                var me = $(this);
                var newDay = parseInt( $(this).data('solar') );
                // var newDay = $(this).find('> .date-day').html().match(/^\d+/)[0];
                // 农历输入 在选择日期的时候可以直接获取农历的日期
                self.result.day = newDay;
                self.result = utilities.getDateData(self.result, false);
                self.getHours();

                self.el.days.hide();
                self.el.hours.show();

                self.$el.trigger('dateChange',{'result':self.result,'nextShow':'hour','curEl':me});
            });

            this.el.hours.delegate('.date-cell', supportEvent, function(){
                var me = $(this);
                var newHour = $(this).data('hour');
                if( newHour != self.result.hour){
                    self.result.hour = newHour;
                    self.result = utilities.getDateData(self.result);
                }
                self.$el.trigger('dateChange',{'result':self.result,'curShow':'hour','curEl':me});
                self.$el.trigger('chooseHour',[self.result]);
            });

            this.$el.on('dateChange',function(event,data){
                // 日期界面坑爹的表格布局 导致不能用siblings()
                data.curEl.parents('.dates-tb').find('.'+self.options.chosenClass).removeClass(self.options.chosenClass);
                data.curEl.addClass(self.options.chosenClass);
            });
        },

        renderBranch: function(){
            var html = $.tmpl(this.tpls.days);
            this.el.days.html(html).show();
            this.el.days.tbody = this.el.days.find('tbody');
        },

        getDays:function(){
            /***日的界面，星期从星期一开始***/
            // debugger;
            var data = '';
            if( this.isLunarInput){
                data = utilities.getDaysDataFromLunar(this.result.lunarYear, this.result.lunarMonth);
                now = data.lunarDay;
            }else{
                data = this.result;
                now = data.day;
            }
            /***生成六行 七列的表格，42个格子 可以容纳所有日期的排列，最后一行没数据的话就自动隐藏***/
            var  tbodyHTML = [];
            var total = 42;
            var start = data.monthFirstDay -1;
            // debugger;
            for (var i = 0; i < 42; i++) {
                if( i< start || i>=data.monthDays+start){
                   tbodyHTML.push('<td class="day-cell empty-cell"></td>');
                }else{
                    var j = i - start
                    if( this.isLunarInput){
                        var html = '<td class="date-cell day-cell" data-solar='+data.monthData[j].day+'>\
                            <p class="date-day">'+data.monthData[j].lunarInfo+'</p>\
                            <p class="date-lunar">'+data.monthData[j].day+'</p>\
                            <p class="date-ganzhi">'+data.monthData[j].ganzhi+'</p>\
                            </td>';
                    }else{
                        var lunarInfo = data.monthData[j].term === undefined ? data.monthData[j].lunarDayName :data.monthData[j].term;
                        if( lunarInfo === undefined){
                            throw new Error('cant find the luanrInfo,the date info is'+JSON.stringify(data) +'day_s index is' +j);
                        }
                        var html = '<td class="date-cell day-cell" data-solar='+(j+1)+'><p class="date-day">'+(j+1)+'</p><p class="date-lunar">'+lunarInfo+'</p><p class="date-ganzhi">'+data.monthData[j].GanZhiDay+'</p></td>';
                    }


                    tbodyHTML.push(html);
                }

                if( i%7 ==0){
                    if( i!=0){
                        tbodyHTML[i-1] += '</tr>';
                    }
                    tbodyHTML[i]='<tr>' + tbodyHTML[i];
                }

            };
            tbodyHTML[total-1] +='</tr>';

            var html = tbodyHTML.join('');
            this.el.days.tbody.children().remove()
                .end().html(html);

            this.el.days.find('[data-solar='+ this.result.day+']').addClass(this.options.chosenClass);
        },

        getYears: function(){
            var years = utilities.getYearsData(this.options.startYear, this.options.long);
            var html = $.tmpl(this.tpls.years, {years:years});
            this.el.years.html(html);

            var targetYear = 0;
            if( this.isLunarInput){
                targetYear = this.result.lunarYear;
            }else{
                targetYear = this.result.year;
            }

            this.el.years.find('[data-year='+targetYear+']').addClass(this.options.chosenClass);

        },

        getMonths: function(){
            var targetMonth = '';
            if(this.isLunarInput){
                var MonthsData = utilities.getMonthsDataFromLunar(this.result.lunarYear);//获取当年每月的干支
                targetMonth = this.result.lunarMonth;
            }else{
                var MonthsData = utilities.getMonthsData(this.result.year);//获取当年每月的干支
                targetMonth = this.result.month;
            }

            var html = $.tmpl(this.tpls.months,{months:MonthsData})
            this.el.months.children().remove()
                .end().html(html);

            this.el.months.find('[data-month='+targetMonth+']').addClass(this.options.chosenClass);
        },

        getHours: function(){
            var ganDay = this.result.GanZhiDay.charAt(0);
            var hours = utilities.getGanZhiHours(ganDay); //获取一天内小时和干支时的对象的数组

            var html = $.tmpl(this.tpls.hours,{hours:hours});
            this.el.hours.children().remove()
                .end().html(html);

            this.el.hours.find('[data-hour='+this.result.hour+']').addClass(this.options.chosenClass);
        },

        toggleCalType: function(){
            this.isLunarInput = !this.isLunarInput;
            this.getMonths();
            this.getDays();
            this.showChooseDate();
        },
        showChooseDate: function(){
            this.$el.find('.'+this.options.chosenClass).removeClass(this.options.chosenClass);
            var target = {}, me = this.result;
            if(!this.isLunarInput){
                target = {
                    year: me.year,
                    month: me.month
                }
            }else{
                target = {
                    year: me.lunarYear,
                    month: me.lunarMonth
                }
            }

            this.el.years.find('[data-year='+target.year+']').addClass(this.options.chosenClass);
            this.el.months.find('[data-month='+target.month+']').addClass(this.options.chosenClass);
            this.el.days.find('[data-solar='+this.result.day+']').addClass(this.options.chosenClass);
            this.el.hours.find('[data-hour='+this.result.hour+']').addClass(this.options.chosenClass);
        },

        utils: {
            getGanZhiHour: function(ganDay,hour){
                return utilities.getGanZhiHour(ganDay,hour);
            }
        },
        showPannel: function(type){
            this.$el.show();
            this.$el.find('> [data-acpt='+ type +']').show().siblings('.dates-tb').hide();
        },
        hidePannels: function(){
            this.$el.find('> .dates-tb').hide();
        },
        hourHiddenChosen: function(hour){
            
            this.el.hours.find('.cur').removeClass('cur');
            this.el.hours.find('[data-hour='+ hour+']').addClass('cur');
        }
    }

    win.Calendar = Calendar;

    // 详细小时
    function DetailHour(opts){
        this.time = {
            hour:0,
            min:0,
            second:0
        };

        this.typeArr = ['hour','min','second'];

        this.oBox = $(opts.oBox);
        this.options = opts;

        this.dataInit(this.render);

    }

    DetailHour.prototype = {
        dataInit: function(cb){

            var tpl = ['<% for(var attr in data){%>',
                '<div class="swiper-container <%=attr%>-swiper">',
                    '<div class="swiper-wrapper">',
                        '<% data[attr].forEach(function(time){%>',
                           ' <div class="swiper-slide"><%= time%></div>',
                       ' <%})%>',
                   ' </div>',
                '</div>',
            '<%}%>' ].join('');

            var data = {};
            (function(){
                data.hour = [];
                for (var i = 0; i < 24; i++) {
                    i= i<10?('0'+i):i;
                    data.hour.push(i);
                };

                data.min = [];
                for (var i = 0; i < 60; i++) {
                    i= i<10?('0'+i):i;
                    data.min.push(i);
                };
                data.second = data.min.slice(0);
            })();

            cb.call(this,tpl,data);
        },

        render: function(tpl,_data ){

            var self = this;
            var html = $.tmpl(tpl, { data: _data });
            this.oBox.html( html );
            // debugger;
            this.swiperSliders = [];
            this.timeStr = {};//为了拼字符串
            var hourInitialSlide = this.options.startHour-1;
            var startTime = [];  //初始化时间

            this.options.startTime.forEach(function(time){
                startTime.push( time -1);
            })

            this.typeArr.forEach(function(type,idx){
                var containerClass= '.'+type + '-swiper';
                var len = type==='hour'? 24:60;
                var initialSlide = startTime[idx];

                var swiper = new Swiper(containerClass, {
                    slidesPerView: 3,
                    direction: 'vertical',
                    loop: true,
                    speed:100,
                    initialSlide:initialSlide,
                    onSlideChangeEnd: function(swiper){
                        var me = this;
                        var now = swiper.snapIndex-2;
                        if(now<0)now+=len;
                        if(now>=len)now-=len;

                        if(type === 'hour'){
                            self.options.onHourChangeEnd && self.options.onHourChangeEnd(now);
                        }

                        var nowStr = now<10?('0'+now):(''+now);

                        self.time[type] = now;
                        self.timeStr[type] = nowStr;

                        self.options.onSlideChangeEnd({
                            timeData:self.time,
                            timeStr:(self.timeStr.hour+':'+self.timeStr.min +':'+ self.timeStr.second) +' '+ utilities.zhiHour[self.time.hour]+'时'
                        });
                    }
                });

                self.swiperSliders[type] = swiper;

            })

        },
        sliderToHour: function(hour,cb){

            this.swiperSliders.hour.slideTo( (hour+2)%24,0,function(){
                cb && cb(self.timeData);
            });
            this.swiperSliders.min.slideTo( 2,0,function(){
            });
            this.swiperSliders.second.slideTo( 2,0,function(){
            });
        }
    };


    win.DetailHour = DetailHour;
}(window);
