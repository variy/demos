var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');
var formatdate = require('../../util/formatdate');
var common = require('../../util/common');
var lang = require('../../lang/zh_cn');
var Handlebars = require('express-handlebars');
/**
 * 路径说明：
 * 弹窗排盘 /
**/

var paipanData;//排盘数据
var sizhu;//四柱
var uinfo;//个人信息

// 流年表信息
var dayun_data;
var liunian_data;
var liuyue_data;
var liuday_data;
var liushi_data;

//流年四柱
var dayunSizhu;
var liunianSizhu;
var liuyueSizhu;
var liudaySizhu;

// 数据转换
// 基本信息
function userinfo(data,name){
	var solarDate = {
		year: data.aBirthday.y,
        month: data.aBirthday.m,
        day: data.aBirthday.d,
        hour: data.aBirthday.h,
        min: data.aBirthday.min,
        second: 0
	}
	formatdate_data = formatdate.get.getDateDataFormSolar(solarDate);

	var Pinfo = name+ ' ' +lang.solarOrLunar[data.solarOrLunar] + lang.gender[data.iGender]  + " 属" + lang.shengXiao[data.shengXiao] + " 虚岁" + data.vage,
		Pluck = common.setLuck(data.aStartLuck),
		Pbirth_solar = common.setBirthday(data.aBirthday, 'solar'),
		Pbirth_Lunar = formatdate_data.lunarYearName+formatdate_data.lunarMonthName+formatdate_data.lunarDayName+' '+formatdate_data.GanZhiHour[1]+'时',
		luckGanZhiYear = lang.tianGan[data.intersectLuck.firstTg] + lang.tianGan[data.intersectLuck.secondTg],
		PluckStr =  '逢'+luckGanZhiYear+'年 '+lang.jieqi[data.intersectLuck.jieVal].name +'后 '+ data.intersectLuck.days+'天'+ data.intersectLuck.hours+'小时'+ data.intersectLuck.min+'分交大运'

	uinfo = {
		name:name,
		igender:data.iGender,
		birthsolar:data.aBirthday.y+'-'+ data.aBirthday.m+'-'+ data.aBirthday.d,
		birthtime:data.aBirthday.h+':'+ data.aBirthday.min+':00',
		Pinfo:Pinfo,
  		Pluck:Pluck,
  		Pbirth_solar:Pbirth_solar,
  		Pbirth_Lunar:Pbirth_Lunar,
  		PluckStr:PluckStr
	}
}

//显示四柱
function f_sizhu(data){
	sizhu = [];
	var name = ['yearZhu','monthZhu','dayZhu','hourZhu'];

	name.forEach(function(type){
		var tiangan = data.aSiZhu[type].tianGanAttr;
		var dizhi = data.aSiZhu[type].diZhiAttr;

		// 十神地支
		var dizhi_shishen = dizhi.shiShen.map(function(index){
			return lang.shiShen[index][1];
		});
		// 藏干地支
		var dizhi_cangGan = dizhi.cangGan.map(function(index){
			return lang.tianGan[index][0];
		});

		sizhu[type] = [
			lang.tianGan[data.aSiZhu[type].tianGanAttr.attrVal]+lang.diZhi[data.aSiZhu[type].diZhiAttr.attrVal],//干支
			lang.shiShen[tiangan.shiShen][1],//十神天干
			dizhi_shishen.join(''),//十神地支
			dizhi_cangGan.join(''),//藏干地支
			lang.wuXing[tiangan.wuXing[0]],//五行天干
			lang.wuXing[dizhi.wuXing[0]]//五行地支
		];
	});
}

//大运表
function f_dayun(data){
	dayun_data = [];

	var goodLuck = data.goodLuckYears;
    for (i = 0; i <	goodLuck.length; i++)
    {	
    	var age = goodLuck[i].age;
        var tiangan = goodLuck[i].tianGanAttr.attrVal;
		var dizhi = goodLuck[i].diZhiAttr.attrVal;
		var year = goodLuck[i].year;
		var ddefault = parseInt(goodLuck[i]['default']) === 0 ? '':'on';

		dayun_data[i] = {'age':age,'ganzhi':lang.tianGan[tiangan]+''+lang.diZhi[dizhi],'year':year,'ddefault':ddefault};
    }
}

//流年表
function f_liunian(data){
	liunian_data = [];

    for (i = 0; i <	data.length; i++)
    {	
    	var age = data[i].age;
        var tiangan = data[i].tianGanAttr.attrVal;
		var dizhi = data[i].diZhiAttr.attrVal;
		var year = data[i].year;
		var ddefault = parseInt(data[i]['default']) === 0 ? '':'on';

		liunian_data[i] = {'age':age,'ganzhi':lang.tianGan[tiangan]+''+lang.diZhi[dizhi],'year':year,'ddefault':ddefault,'tianGanAttr':data[i].tianGanAttr,'diZhiAttr':data[i].diZhiAttr};
    }
}

//流月(节气)表
function f_liuyue(data){
	liuyue_data = [];
    for (i = 0; i <	data.length; i++)
    {	
    	var jieVal = data[i].jieVal;
        var tiangan = data[i].tianGanAttr.attrVal;
		var dizhi = data[i].diZhiAttr.attrVal;
		var solarDate = data[i].solarDate;

		liuyue_data[i] = {'jieVal':lang.jieqi[jieVal].name,'jieValnum':jieVal,'ganzhi':lang.tianGan[tiangan]+''+lang.diZhi[dizhi],'solarDate':solarDate,'tianGanAttr':data[i].tianGanAttr,'diZhiAttr':data[i].diZhiAttr};
    }
}

//流日表
function f_liuday(data){
	liuday_data = [];

    for (i = 0; i <	data.length; i++)
    {	
        var tiangan = data[i].tianGanAttr.attrVal;
		var dizhi = data[i].diZhiAttr.attrVal;
		var solarDate = data[i].solarDate;

		liuday_data[i] = {'ganzhinum':tiangan,'ganzhi':lang.tianGan[tiangan]+''+lang.diZhi[dizhi],'solarDate':solarDate,'tianGanAttr':data[i].tianGanAttr,'diZhiAttr':data[i].diZhiAttr};
    }
}

//流时表
function f_liushi(data){
	liushi_data = [];

    for (i = 0; i <	data.length; i++)
    {	
        var tiangan = data[i].tianGanAttr.attrVal;
		var dizhi = data[i].diZhiAttr.attrVal;
		var hour = data[i].hour;

		liushi_data[i] = {'ganzhi':lang.tianGan[tiangan]+''+lang.diZhi[dizhi],'hour':hour};
    }
}

//流运四柱
function f_dayunSizhu(index){
	var dayun = paipanData.goodLuckYears[index];
	var tiangan = dayun.tianGanAttr;
	var dizhi = dayun.diZhiAttr;

	// 十神地支
	var dizhi_shishen = dizhi.shiShen.map(function(index){
		return lang.shiShen[index][1];
	});
	// 藏干地支
	var dizhi_cangGan = dizhi.cangGan.map(function(index){
		return lang.tianGan[index][0];
	});

	dayunSizhu = {
		display:'table-cell',
		year:dayun.year,
		age:dayun.age,
		ganzhi:lang.tianGan[dayun.tianGanAttr.attrVal]+lang.diZhi[dayun.diZhiAttr.attrVal],//干支
		shishenT:lang.shiShen[tiangan.shiShen][1],//十神天干
		shishenD:dizhi_shishen.join(''),//十神地支
		cangganD:dizhi_cangGan.join(''),//藏干地支
		wuxingT:lang.wuXing[tiangan.wuXing[0]],//五行天干
		wuxingD:lang.wuXing[dizhi.wuXing[0]]//五行地支
	};
}

function f_liunianSizhu(index){
	var liunian = liunian_data[index];
	var tiangan = liunian.tianGanAttr;
	var dizhi = liunian.diZhiAttr;

	// 十神地支
	var dizhi_shishen = dizhi.shiShen.map(function(index){
		return lang.shiShen[index][1];
	});
	// 藏干地支
	var dizhi_cangGan = dizhi.cangGan.map(function(index){
		return lang.tianGan[index][0];
	});

	liunianSizhu = {
		display:'table-cell',
		year:liunian.year,
		age:liunian.age,
		ganzhi:liunian.ganzhi,//干支
		shishenT:lang.shiShen[tiangan.shiShen][1],//十神天干
		shishenD:dizhi_shishen.join(''),//十神地支
		cangganD:dizhi_cangGan.join(''),//藏干地支
		wuxingT:lang.wuXing[tiangan.wuXing[0]],//五行天干
		wuxingD:lang.wuXing[dizhi.wuXing[0]]//五行地支
	};
}

function f_liuyueSizhu(index){
	var liuyue = liuyue_data[index];
	var tiangan = liuyue.tianGanAttr;
	var dizhi = liuyue.diZhiAttr;

	// 十神地支
	var dizhi_shishen = dizhi.shiShen.map(function(index){
		return lang.shiShen[index][1];
	});
	// 藏干地支
	var dizhi_cangGan = dizhi.cangGan.map(function(index){
		return lang.tianGan[index][0];
	});

	liuyueSizhu = {
		display:'table-cell',
		solarDate:liuyue.solarDate,
		jieVal:liuyue.jieVal,
		ganzhi:liuyue.ganzhi,//干支
		shishenT:lang.shiShen[tiangan.shiShen][1],//十神天干
		shishenD:dizhi_shishen.join(''),//十神地支
		cangganD:dizhi_cangGan.join(''),//藏干地支
		wuxingT:lang.wuXing[tiangan.wuXing[0]],//五行天干
		wuxingD:lang.wuXing[dizhi.wuXing[0]]//五行地支
	};
}

function f_liudaySizhu(index){
	var liuday = liuday_data[index];
	var tiangan = liuday.tianGanAttr;
	var dizhi = liuday.diZhiAttr;

	// 十神地支
	var dizhi_shishen = dizhi.shiShen.map(function(index){
		return lang.shiShen[index][1];
	});
	// 藏干地支
	var dizhi_cangGan = dizhi.cangGan.map(function(index){
		return lang.tianGan[index][0];
	});

	liudaySizhu = {
		display:'table-cell',
		solarDate:liuday.solarDate,
		ganzhi:liuday.ganzhi,//干支
		shishenT:lang.shiShen[tiangan.shiShen][1],//十神天干
		shishenD:dizhi_shishen.join(''),//十神地支
		cangganD:dizhi_cangGan.join(''),//藏干地支
		wuxingT:lang.wuXing[tiangan.wuXing[0]],//五行天干
		wuxingD:lang.wuXing[dizhi.wuXing[0]]//五行地支
	};
}

// 排盘module
module.exports = {
	get:function(req,res){
		var sDate = req.query.sDate || '1980-01-01';
		var sTime = req.query.sTime || '12:00:00';
		var iGender = req.query.iGender || '0';
		var rName = req.query.rName || '';
		var udid = req.query.udid;

 		api({
			mod:'paipan',
			act:'getBase',
			sDate:sDate,
			sTime:sTime,
			iGender:iGender,
			rName:rName
		}).complete(function(data,status){
			paipanData = data;
			userinfo(data,rName);
			f_sizhu(data);
			f_dayun(data);
			
		  	res.render('pop/paipan',{
		  		layout:'pop',
		  		uinfo:uinfo,
		  		sizhu:sizhu,
		  		dayun:dayun_data
		  	});
		})
	},

	post:function(req,res){
		var sizhu_index = parseInt(req.body.sizhu_index);
		var item_index = parseInt(req.body.item_index);
		var dayTianGan = paipanData.aSiZhu.dayZhu.tianGanAttr.attrVal;

		switch(req.body.act){
		  	case 'dayun'://点击大运表-->（获取流运表传的参数根据页面传的item_index从全局变量获取）
				var paipanData_g = paipanData.goodLuckYears[item_index];
		  		api({
					mod:'paipan',
	            	act:'getLiuYear',
	            	year:paipanData_g.year,
	            	age:paipanData_g.age,
	            	yearTianGan:paipanData_g.tianGanAttr.attrVal,
	            	yearDiZhi:paipanData_g.diZhiAttr.attrVal,
	            	dayTianGan:dayTianGan,
	            	yearNum:'10'
				}).complete(function(data,status){
					f_liunian(data);

					res.render('pop/paipan_liunian',{//显示流年表
				  		layout:null,
				  		liunian:liunian_data,
				  	});
				})
		  		break;
	  		case 'liunian'://点击流年表
		  		api({
					mod:'paipan',
	            	act:'getJie',
	            	year:liunian_data[item_index].year,
	            	dayTianGan:dayTianGan
				}).complete(function(data,status){
					f_liuyue(data);
					res.render('pop/paipan_liuyue',{
				  		layout:null,
				  		liuyue:liuyue_data
				  	});
				})
		  		break;
	  		case 'liuyue'://点击流月表
	  		 	var sdate = {
	  		 		sDate : liuyue_data[item_index].solarDate.split('/').map(function(item){
                        return item;
                    })
  		 		}
	  		 	var liuyue_solarDate = liunian_data[item_index].year+'-'+sdate.sDate[1]+'-'+sdate.sDate[0];

		  		api({
					mod:'paipan',
	            	act:'getLiuDays',
	            	solarDate:liuyue_solarDate,
					jieVal:liuyue_data[item_index].jieValnum,
					dayTianGan:dayTianGan
				}).complete(function(data,status){
					f_liuday(data);
					res.render('pop/paipan_liuday',{
				  		layout:null,
				  		liuday:liuday_data
				  	});
				})
		  		break;
	  		case 'liuday'://点击流日
		  		api({
					mod:'paipan',
	            	act:'getLiuHours',
	            	currDayTianGan:liuday_data[item_index].ganzhinum,
					dayTianGan:dayTianGan
				}).complete(function(data,status){
					f_liushi(data);
					res.render('pop/paipan_liushi',{
				  		layout:null,
				  		liushi:liushi_data
				  	});
				})
		  		break;
	  	}

  		// 流运数据交互
	  	switch(req.body.liuyun_sizhu){
	  		case 'dayun'://点击大运
				f_dayunSizhu(item_index);

				res.render('pop/liuyun_sizhu',{
			  		layout:null,
			  		dayunSizhu:dayunSizhu
			  	});
		  		break;
	  		case 'liunian'://点击流年
	  			f_dayunSizhu(item_index);
	  			f_liunianSizhu(item_index);
				
				res.render('pop/liuyun_sizhu',{
			  		layout:null,
			  		dayunSizhu:dayunSizhu,
			  		liunianSizhu:liunianSizhu
			  	});
		  		break;
	  		case 'liuyue'://点击流月
	  			f_dayunSizhu(item_index);
	  			f_liunianSizhu(item_index);
	  			f_liuyueSizhu(item_index);

				res.render('pop/liuyun_sizhu',{
			  		layout:null,
			  		dayunSizhu:dayunSizhu,
			  		liunianSizhu:liunianSizhu,
			  		liuyueSizhu:liuyueSizhu
			  	});
		  		break;
	  		case 'liuday'://点击流日
	  			f_dayunSizhu(item_index);
	  			f_liunianSizhu(item_index);
	  			f_liuyueSizhu(item_index);
	  			f_liudaySizhu(item_index);

				res.render('pop/liuyun_sizhu',{
			  		layout:null,
			  		dayunSizhu:dayunSizhu,
			  		liunianSizhu:liunianSizhu,
			  		liuyueSizhu:liuyueSizhu,
			  		liudaySizhu:liudaySizhu
			  	});
		  		break;
	  	}



		//是否登录
		var user = isLogin(req,res);
		if(!user || !req.query.udid){
			return;
		}


		//事件数据交互
		switch(req.body.ievents){
			case 'add':
				api({
					mod :'ievents',
					act : 'add',
					mkey : user.mkey,
					udid : req.query.udid,
					labname : req.body.labname,
					evdate : req.body.evdate,
					time : req.body.time,
					info:req.body.info
				}).complete(function(data){
					res.json(data);
				});
				//api({
				//	mod :'ievents',
				//	act : 'add',
				//	mkey : user.mkey,
				//	udid : req.query.udid,
				//	labid : 5,
				//	evdate : req.body.evdate,
				//	time : req.body.time,
				//	info:req.body.info
				//}).complete(function(data){
				//	res.json(data);
				//});
				break;
		}
	}
};
