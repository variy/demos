var LunarCalendar = require("lunar-calendar");
var _ = require("underscore");

var o = {
    init: function() {
        /******'算法'中,天干地支的索引值都是从1开始*******/
        this.tianganArr = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        this.dizhiArr = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

        this.lunarNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        this.lunarMonthName = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "腊月"];
        this.lunarHourName = ["零点", "一点", "二点", "三点", "四点", "五点", "六点", "七点", "八点", "九点", "十点", "十一点", "十二点", "十三点", "十四点", "十五点", "十六点", "十七点", "十八点", "十九点", "二十点", "二十一点", "二十二点", "二十三点"];
        this.defaultSolarDate = {
            year: 1980,
            month: 1,
            day: 1,
            hour: 12,
            min: 0,
            second: 0
        };

        this.defaultLunarDate = {
            lunarYear: 1980,
            lunarMonth: 1,
            lunarDay: 1,
            hour: 12,
            min: 0,
            second: 0
        };

        this.dataInit();
    },

    LunarYearToLunarYearName: function(lunarYear){
        var me = this;
        var name = '';
        (lunarYear+'').split('').forEach(function(n){
            name += me.lunarNum[parseInt(n)];
        });
        return name;
    },

    dataInit: function() {
        var self = this;
        // 得到24小时对应的时支
        var getZhiHour = function() {

            var zhi = [];
            self.dizhiArr.forEach(function(o) {
                zhi.push(o, o);
            });
            var zhi = zhi.concat(zhi.splice(0, 1));
            return zhi;
        };

        //得到干支表
        var getGanZhi = function() {

            var ganzhi = [];
            var firstGanzhi = self.tianganArr[0] + self.dizhiArr[0];
            ganzhi.push(firstGanzhi);
            var str = '',
                i = 1;
            var len1 = self.tianganArr.length,
                len2 = self.dizhiArr.length;

            while (str != firstGanzhi) {
                str = self.tianganArr[i % len1] + self.dizhiArr[i % len2];
                ganzhi.push(str);
                i++;
            }
            ganzhi.splice(ganzhi.length - 1, 1);
            return ganzhi;
        };

        this.zhiHour = getZhiHour();
        this.ganzhi = getGanZhi();

        this.forGetYear_Gan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'];
        this.forGetYear_Zhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'];
    },
    // 获取小时的时干支
    getGanZhiHour: function(ganDay, hour) {
        var ganDayIndex = this.tianganArr.indexOf(ganDay) + 1;
        var zhiHourIndex = this.dizhiArr.indexOf(this.zhiHour[hour]) + 1;
        var ganHourIndex = (ganDayIndex * 2 + zhiHourIndex - 2) % 10; //时干计算公式
        ganHourIndex = ganHourIndex == 0 ? 10 : ganHourIndex;

        return this.tianganArr[ganHourIndex - 1] + this.zhiHour[hour];
    },
    // 农历转信息
    getDateDataFormLunar: function(opts) {
        var dateObj = {};
        _.extend(dateObj, this.defaultLunarDate, opts);
        var solarInfo = LunarCalendar.lunarToSolar(dateObj.lunarYear, dateObj.lunarMonth, dateObj.lunarDay);
        console.log( solarInfo);
        var data = LunarCalendar.calendar(solarInfo.year,solarInfo.month,false);

        var result = data.monthData[solarInfo.day-1];
        var monthInfo = {
            monthDays: data.monthDays,
            monthFirstDay: data.firstDay === 0 ? 7 : data.firstDay
        };

        _.extend(dateObj, result, monthInfo);
        dateObj.lunarYearName = this.LunarYearToLunarYearName(dateObj.lunarYear)+'年',
        dateObj.lunarMonthName = dateObj.lunarMonthName === '十二月' ? '腊月' : dateObj.lunarMonthName;
        dateObj.GanZhiHour = this.getGanZhiHour(dateObj.GanZhiDay.charAt(0), dateObj.hour);
        dateObj.lunarHourName = this.lunarHourName[dateObj.hour];
        return dateObj;   
    },
    // 阳历转信息
    getDateDataFormSolar: function(opts) {
        var dateObj = {};
        _.extend(dateObj, this.defaultSolarDate, opts);

        var data = LunarCalendar.calendar(dateObj.year,dateObj.month,false);

        var result = data.monthData[dateObj.day-1];
        var monthInfo = {
            monthDays: data.monthDays,
            monthFirstDay: data.firstDay === 0 ? 7 : data.firstDay
        };

        _.extend(dateObj, result, monthInfo);
        dateObj.lunarYearName = this.LunarYearToLunarYearName(dateObj.lunarYear)+'年',
        dateObj.lunarMonthName = dateObj.lunarMonthName === '十二月' ? '腊月' : dateObj.lunarMonthName;
        dateObj.GanZhiHour = this.getGanZhiHour(dateObj.GanZhiDay.charAt(0), dateObj.hour);
        dateObj.lunarHourName = this.lunarHourName[dateObj.hour];
        return dateObj;
    }
};

var p = {
    toDoubleString: function(num){
        if( num < 10)return '0' + num;
        if( num >= 10)return '' + num;
    },
    formatDateStr: function(year, month, day){
        return year + '-' + this.toDoubleString(month) + '-' + this.toDoubleString(day);
    },
    formatTimeStr: function(hour, min, second){
        return this.toDoubleString(hour) + ':' + this.toDoubleString(min) + ':' + this.toDoubleString(second);   
    },
    DateStrToArr: function(str){
        // console.log( str);
        return str.split('-').map(function(i) {
            return parseInt(i)
        })
    },
    TimeStrToArr: function(str){
        return str.split(':').map(function(i) {
            return parseInt(i)
        })
    },

};
o.init();
exports.get= o;
exports.parse= p;