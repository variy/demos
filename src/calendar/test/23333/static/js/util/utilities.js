(function(win){

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
                //解决forEach兼容
                if (!Array.prototype.forEach) {  
                    Array.prototype.forEach = function(fun /*, thisp*/){  
                        var len = this.length;  
                        if (typeof fun != "function")  
                            throw new TypeError();  
                        var thisp = arguments[1];  
                        for (var i = 0; i < len; i++){  
                            if (i in this)  
                                fun.call(thisp, this[i], i, this);  
                        }  
                    };  
                }

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
                            ganzhi: nextMonthData[i].GanZhiDay
                        });
                    }else{
                        return monthData;
                    }
                };
                // 有一种特殊情况，如果当年农历时间对应的阳历为 1月份30、31，那么对应的阳历时间找到到阳历2月底，还是会不足30天，
                // 所以循环2个月找不到下一个初一
                if( solarInfo.month ===1 && solarInfo.day > 29 ){
                    var nextOfNextMonthData = LunarCalendar.calendar(yearOfNextMonth, 3,false).monthData;
                    for (var i = 0,len=nextOfNextMonthData.length ; i < len; i++) {
                        if( nextOfNextMonthData[i].lunarDayName != '初一' ){
                            monthData.push({
                                day: nextOfNextMonthData[i].day,
                                lunarInfo: nextOfNextMonthData[i].term === undefined ? nextOfNextMonthData[i].lunarDayName :nextOfNextMonthData[i].term,
                                ganzhi: nextOfNextMonthData[i].GanZhiDay
                            });
                        }else{
                            return monthData;
                        }
                    };
                }
                if( i==nextMonthData.length){ throw new Error('找不到初一！'+JSON.stringify(monthData))}
            }

            var monthData = getMonthData();

            // console.log('monthData-----------', monthData);
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
            return LunarCalendar.solarToLunar(year,6,1).lunarLeapMonth===0;
        },
        getYesterdayData: function(opts){
            var time = {hour: opts.hour, min: opts.min, second: opts.second};
            var data;
            if( opts.day != 1){
                opts.day--;
                data = this.getDateData(opts,false);
            }else{
                if( opts.month!=1){
                    opts.month--;
                    opts.day = LunarCalendar.calendar(opts.year,opts.month, false).monthDays;
                    data = this.getDateData(opts,false);
                }else{
                    opts.year--;
                    opts.month = 12;
                    opts.day = 31;
                    data = this.getDateData(opts);
                }
            }

            $.extend(data, time);
            return data;
        },
        getTomorrowData: function(opts){
            var time = {hour: opts.hour, min: opts.min, second: opts.second};
            var monthDays = LunarCalendar.calendar(opts.year,opts.month, false).monthDays;
            var data;
            if( opts.day != monthDays){
                opts.day++;
                data = this.getDateData(opts,false);
            }else{
                if( opts.month!=12){
                    opts.month++;
                    opts.day = 1;
                    data = this.getDateData(opts,false);
                }else{
                    opts.year++;
                    opts.month = 1;
                    opts.day = 1;
                    data = this.getDateData(opts);
                }
            }

            $.extend(data, time);
            return data;
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
                hour:12,
                min: 0
            };
          
            _.extend(settings,opts);
           
            var data = LunarCalendar.calendar(settings.year,settings.month,false);

            var result = data.monthData[settings.day-1];
            var monthInfo = {
                monthData: data.monthData,
                monthDays: data.monthDays,
                monthFirstDay:data.firstDay===0? 7:data.firstDay
            };

             $.extend(result,monthInfo,{ second:0});

            result.hour = settings.hour;
            result.min = settings.min;
            result.lunarMonthName = result.lunarMonthName ==='十二月'?'腊月': result.lunarMonthName;
            result.GanZhiHour = this.getGanZhiHour(result.GanZhiDay.charAt(0),settings.hour);
            result.lunarHourName = this.lunarHourName[settings.hour];
            // console.log(result);
            return result;
        }

    }
    utilities.init();
    BAZI.utilities = utilities;

})(window);
