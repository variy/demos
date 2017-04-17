var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');
/**
 * 路径说明：
 * 保存修改记录 /
**/

var recordData;//记录数据
var uinfo;//个人信息

// 基本信息
// function recordInfo(data,name){
// 	var solarDate = {
// 		year: data.aBirthday.y,
//         month: data.aBirthday.m,
//         day: data.aBirthday.d,
//         hour: data.aBirthday.h,
//         min: data.aBirthday.min,
//         second: 0
// 	}
// 	formatdate_data = formatdate.get.getDateDataFormSolar(solarDate);

// 	var Pinfo = name+ ' ' +lang.solarOrLunar[data.solarOrLunar] + lang.gender[data.iGender]  + " 属" + lang.shengXiao[data.shengXiao] + " 虚岁" + data.vage,
// 		Pluck = common.setLuck(data.aStartLuck),
// 		Pbirth_solar = common.setBirthday(data.aBirthday, 'solar'),
// 		Pbirth_Lunar = formatdate_data.lunarYearName+formatdate_data.lunarMonthName+formatdate_data.lunarDayName+' '+formatdate_data.GanZhiHour[1]+'时',
// 		luckGanZhiYear = lang.tianGan[data.intersectLuck.firstTg] + lang.tianGan[data.intersectLuck.secondTg],
// 		PluckStr =  '逢'+luckGanZhiYear+'年 '+lang.jieqi[data.intersectLuck.jieVal].name +'后 '+ data.intersectLuck.days+'天'+ data.intersectLuck.hours+'小时'+ data.intersectLuck.min+'分交大运'

// 	uinfo = {
// 		Pinfo:Pinfo,
//   		Pluck:Pluck,
//   		Pbirth_solar:Pbirth_solar,
//   		Pbirth_Lunar:Pbirth_Lunar,
//   		PluckStr:PluckStr
// 	}
// }

// 排盘module
module.exports = {
	get:function(req,res){
		aUinfo = {
			sDate:req.query.sDate || '1980-01-01',
			Pbirth:req.query.Pbirth || '',
			sTime:req.query.sTime || '12:00:00',
			iGender:parseInt(req.query.iGender) === 0 ? '男':'女' || '男',
			rName:req.query.rName || ''
		}

	  	res.render('pop/record',{
	  		layout:'pop',
	  		aUinfo:aUinfo
	  	});
	},

	post:function(req,res){

	}
};
