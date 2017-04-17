// JavaScript Document


// var oBg=document.getElementById('bg_all').children[0];



/*顶部菜单*/

var oTopLogin=oTList.children[0];
var oView=oTList.children[2];
var oResearch=oTList.children[3];

var _t=getCookie('tabIndex') || 0;
aTabBtn[_t].className='active';
for(var i=0; i<aTabBtn.length; i++){
	aTabBtn[i].index=i;
	aTabBtn[i].onclick=function(){
		
		for(var j=0; j<aTabBtn.length; j++){
			aTabBtn[j].className='';
		}
		this.className='active';

		
		
		startMoveQ(oMList,{
			left:-this.index*document.documentElement.clientWidth,
		},500,'easeOut' );	
		
		setCookie('tabIndex',this.index,1000);
	};
}


//左侧苹果菜单效果
var arrAp=[];

var a_ddz=new appleIco();
a_ddz.init({
	name:'斗地主'	
});
arrAp.push(a_ddz);

var a_ls=new appleIco();
a_ls.init({
	name:'乐视网'	
});
arrAp.push(a_ls);

var a_xiami=new appleIco();
a_xiami.init({
	name:'虾米音乐'	
});
arrAp.push(a_xiami);

var a_chongwu=new appleIco();
a_chongwu.init({
	name:'QQ宠物'	
});
arrAp.push(a_chongwu);

bind(document,'mousemove',apple_list);


function apple_list(ev){
	   var ev=ev || window.event;
	   var target=ev.target || ev.srcElement;
	
	   
	   for(var i=0; i<arrAp.length; i++){
		   var x=arrAp[i].img.offsetWidth/2+getLeft(arrAp[i].img);
		   var y=arrAp[i].img.offsetHeight/2+getTop(arrAp[i].img);
		   var a=ev.clientX-x;
		   var b=ev.clientY-y;
		   var c=Math.sqrt(a*a+b*b);
		   
		   var iScale=1-c/150;
		   if(iScale<0.5){
			   
			   iScale=0.5;
		   }
		
		 arrAp[i].img.style.width=80*iScale+'px';
		 arrAp[i].img.style.height=80*iScale+'px';

	   }
	   
   }	
	

/*中间图标部分*/
//ipage是从1开始算，数组下标从0开始

var arrO=[  //储存每页对象的数组
	[],[],[],[],[]
];

function putArrO(obj){

	arrO[obj.settings.ipage].push(obj);		
}

//
//第一页
var oDdz=new Ico();
oDdz.init({name:'斗地主',
});
putArrO(oDdz);

var oWeiBo=new Ico();
oWeiBo.init({name:'腾讯微博',
});
putArrO(oWeiBo);

var oVideo=new Ico();
oVideo.init({name:'腾讯视频',
});
putArrO(oVideo);

var oZone1=new Ico();
oZone1.init({
	name:'QQ空间',
	content:'http://qzone.qq.com/'
});
putArrO(oZone1);

var oEmail=new Ico();
oEmail.init({name:'QQ邮箱',
});
putArrO(oEmail);

var oWeather_icon=new Ico();
oWeather_icon.init({name:'天气',
});
putArrO(oWeather_icon);

var oQiDian=new Ico();
oQiDian.init({name:'起点中文网',
});
putArrO(oQiDian);


//第二页
var oMusicBox=new Ico();
oMusicBox.init({name:'音乐盒子',
ipage:1
});
putArrO(oMusicBox);


var oMap=new Ico();
oMap.init({name:'搜搜地图',
ipage:1
});
putArrO(oMap);

var oPet=new Ico();
oPet.init({name:'QQ宠物',
ipage:1
});
putArrO(oPet);

var oXiaMi=new Ico();
oXiaMi.init({name:'虾米音乐',
ipage:1
});
putArrO(oXiaMi);

var oRead=new Ico();
oRead.init({name:'QQ阅读',
ipage:1
});
putArrO(oRead);

var oTuanGou=new Ico();
oTuanGou.init({name:'团购地图',
ipage:1
});
putArrO(oTuanGou);


//第三页
var oNetDisk=new Ico();
oNetDisk.init({name:'网络硬盘',
ipage:2
});
putArrO(oNetDisk);


var oMangGuo=new Ico();
oMangGuo.init({name:'芒果视频',
ipage:2
});
putArrO(oMangGuo);


var oLeShi=new Ico();
oLeShi.init({name:'乐视网',
ipage:2
});
putArrO(oLeShi);

var oTap=new Ico();
oTap.init({name:'便签',
ipage:2
});
putArrO(oTap);

var oHuDie=new Ico();
oHuDie.init({name:'蝴蝶绘图',
ipage:2
});
putArrO(oHuDie);

var oAppMarket=new Ico();
oAppMarket.init({name:'app市场',
ipage:2
});
putArrO(oAppMarket);

var oFriend=new Ico();
oFriend.init({name:'朋友网',
ipage:2
});
putArrO(oFriend);


//第四页

var oQQgroup=new Ico();
oQQgroup.init({name:'QQ群',
ipage:3
});
putArrO(oQQgroup);


var oKuaiDi=new Ico();
oKuaiDi.init({name:'快递查询',
ipage:3
});
putArrO(oKuaiDi);

var oNear=new Ico();
oNear.init({name:'附近的人',
ipage:3
});
putArrO(oNear);

var oBrowser=new Ico();
oBrowser.init({name:'QQ浏览器',
ipage:3
});
putArrO(oBrowser);

var oKxjy=new Ico();
oKxjy.init({name:'kxjy',
ipage:3
});
putArrO(oKxjy);

//第五页




var oJinShan=new Ico();
oJinShan.init({name:'金山网盘',
ipage:4
});
putArrO(oJinShan);

var oKaiXin=new Ico();
oKaiXin.init({name:'开心网',
ipage:4
});
putArrO(oKaiXin);

var o3366=new Ico();
o3366.init({name:'3366',
ipage:4
});
putArrO(o3366);





/*弹窗*/
oZone1.lat.onclick=function(){
	if(!oZone1.isClick)return;
	console.log(oZone1.img.cloneNode())
	var oZoneWindow=new Dialog();
	oZoneWindow.init({
		iNow:1,
		taskIco:oZone1.img.cloneNode(),
		taskTxt:oZone1.settings.name
	});
};

oDdz.lat.onclick=function(){
	if(!oDdz.isClick)return;
	var oDdzWindow=new Dialog();
	oDdzWindow.init({
		iNow:2,
		taskIco:oDdz.img.cloneNode(),
		taskTxt:oDdz.settings.name,
		content:'http://www.boyaa.com/'
	});
};

oWeiBo.lat.onclick=function(){
	if(!oWeiBo.isClick)return;
	var oWeiBoWindow=new Dialog();
	oWeiBoWindow.init({
		iNow:3,
		taskIco:oWeiBo.img.cloneNode(),
		taskTxt:oWeiBo.settings.name,
		content: 't.cn'
	});
};

oVideo.lat.onclick=function(){
	if(!oVideo.isClick)return;
	var oVideoWindow=new Dialog();
	oVideoWindow.init({
		iNow:4,
		taskIco:oVideo.img.cloneNode(),
		taskTxt:oVideo.settings.name,
		content:'www.youku.com'
	});
};

oEmail.lat.onclick=function(){
	if(!oEmail.isClick)return;
	var oEmailWindow=new Dialog();
	oEmailWindow.init({
		iNow:5,
		taskIco:oEmail.img.cloneNode(),
		taskTxt:oEmail.settings.name,
		content:'mail.qq.com'
	});
};

oWeather_icon.lat.onclick=function(){
	if(!oWeather_icon.isClick)return;
	var oWeather_iconWindow=new Dialog();
	oWeather_iconWindow.init({
		iNow:6,
		taskIco:oWeather_icon.img.cloneNode(),
		taskTxt:oWeather_icon.settings.name,
		content:'http://weather.com.cn/html/weather/101280601.shtml'
	});
};

oQiDian.lat.onclick=function(){
	if(!oQiDian.isClick)return;
	var oQiDianWindow=new Dialog();
	oQiDianWindow.init({
		iNow:6,
		taskIco:oQiDian.img.cloneNode(),
		taskTxt:oQiDian.settings.name,
		content:'http://www.qidian.com/Default.aspx'
	});
};

/*oIc_textmenu.children[1].onmouseover=function(){
	oIc_changePage.style.display='block';
	for(var i=0; i<aIc_changePage.length; i++){
		aIc_changePage[i].children[0].style.color='#333';
	}
	aIc_changePage[getTabindex()].children[0].style.color='#aaa';
	
};
oIc_textmenu.children[1].onmouseout=function(){
	oIc_changePage.style.display='none';	
	
};
*/


resize();
window.onresize=resize;

function resize(){
	var T=getTabindex();
	
	var W=document.documentElement.clientWidth-200;
	var H=document.documentElement.clientHeight*0.8;
	
	oMList.style.left=-T*(document.documentElement.clientWidth)+'px';
	
	
	if( H<200 ){
		 H=200;
	}
	for(var i=0; i<pages.length; i++){
		pages[i].style.height=H+'px';
		pages[i].style.width=W+'px';
	}
	oMList.style.width=pages.length*W+2000+'px';
	//alert(arrO[T][0].index);
	//alert(arrO[T][1].index);
	/*for(var i=0; i<arrO[T].length;i++){
		
		arrO[T][i].getPosition();
		
	}*/
	for(var i=0; i<arrO.length; i++){
		for(var j=0; j<arrO[i].length; j++){
			arrO[i][j].getPosition();
		}
	}
	// oBg.style.width=document.documentElement.clientWidth+'px';
	// oBg.style.height=document.documentElement.clientHeight+'px';	
	
};

function maxlat(mrl,mrt){
	var rows = Math.floor( pages[0].offsetWidth/(88+mrl) );
	var cols = Math.floor( pages[0].offsetHeight/(88+mrt) );
	
	return rows*cols;	
} 



function ispg(obj1,obj2){   //碰撞检测——obj1主动，obj2被动
	var L1=getLeft(obj1);
	var R1=getLeft(obj1)+obj1.offsetWidth;
	var T1=getTop(obj1);
	var B1=getTop(obj1)+obj1.offsetHeight;
	
	var L2=getLeft(obj2);
	var R2=getLeft(obj2)+obj2.offsetWidth;
	var T2=getTop(obj2);
	var B2=getTop(obj2)+obj2.offsetHeight;
	
	if(R1<L2 || L1>R2  ||B1<T2 || T1>B2){
		return false;
	}
	
	return obj2;
}

function getN(obj,arr){  //获得离obj最近的元素，arr储存的是碰撞元素集合;返回的是兄弟节点索引值
	var L=getLeft(obj);
	var T=getTop(obj);
	var arr1=[];
	for(var i=0; i<arr.length; i++){
		var L1=getLeft( arr[i] );
		var T1=getTop( arr[i] );
		var C1=Math.sqrt( Math.pow(L-L1,2)+Math.pow(T-T1,2) );
		arr1.push(C1);
	}
	var index=0;
	var tmp=arr1[0];
	for(var i=1; i<arr1.length; i++){
		if(arr1[i]<tmp){
			tmp=arr1[i];
			index=arr1[i].index;	
		}
	}
	
	return index;
}


/*转动部分*/
var oPerson=document.getElementById('personCenter');
var oHome=oPerson.getElementsByTagName('dt')[0];
var aImg=document.getElementsByTagName('dd');
	var iR=150;
	var bOff=true;
oHome.onclick=function(){
if(bOff){
   this.style.WebkitTransform="rotate(-360deg)";
   this.style.MozTransform="rotate(-360deg)";
   this.style.Transform="rotate(-360deg)";
   for(var i=0;i<aImg.length;i++){
	   var oTL=getLT(90/(aImg.length-1)*i,iR);
	   aImg[i].style.transition=".5s "+i*100+"ms";
	   aImg[i].style.WebkitTransform="rotate(-360deg)";
	   aImg[i].style.MozTransform="rotate(-360deg)";
	   aImg[i].style.Transform="rotate(-360deg)";
	   aImg[i].style.left=oTL.l+"px";
	   aImg[i].style.top=oTL.t+"px";
   }
}else{
	  this.style.WebkitTransform="rotate(0deg)";
	  this.style.MozTransform="rotate(0deg)";
	  this.style.Transform="rotate(0deg)";
	  for(var i=0;i<aImg.length;i++){
		  aImg[i].style.transition="2s";
		  aImg[i].style.WebkitTransform="rotate(0deg)";
		  aImg[i].style.left=0+"px";
		  aImg[i].style.top=0+"px";
	  }
  }
  bOff=!bOff;
};
for(var i=0;i<aImg.length;i++)
{
  aImg[i].onclick=function()
  {
	  this.addEventListener('transitionend',fn,false);
	  this.addEventListener('webkitTransitionEnd',fn,false);
	  with(this.style)
	  {
		  transition="0.3s ease-out";
		  WebkitTransform="rotate(-360deg) scale(2)";
		  opacity=0.1;
	  }
  };
}
function fn()
{
  this.removeEventListener('transitionend',fn,false);
  this.removeEventListener('webkitTransitionEnd',fn,false);
  with(this.style)
  {
	  transition="0.1s ease-in";
	  WebkitTransform="rotate(-360deg) scale(1)";
	  opacity=1;
  }
}
function getLT(iDeg,iR){
  var iLeft=-Math.round(iR*Math.sin(iDeg/180*Math.PI));
  var iTop=-Math.round(iR*Math.cos(iDeg/180*Math.PI));
  return {l:iLeft,t:iTop}
}


/*天气模块*/

var oWeather=document.getElementById('weatherBox');
var oWeatherData=getByClass(oWeather,'weatherData')[0];
var oWeatherText=oWeatherData.getElementsByTagName('span');

var oWeatherCont=getByClass(oWeather,'weatherCont')[0];
var oAdr=getByClass(document,'adress')[0];
var oAdrA=oAdr.getElementsByTagName('a')[0];
var oAdrData=getByClass(oAdr,'adressData')[0];
var aAdrSel=oAdr.getElementsByTagName('select');
var aAdrBtn=oAdr.getElementsByTagName('input');

var oWeahterFooter=getByClass(oWeather,'weatherFooter')[0];
var oFooterBtn=oWeahterFooter.getElementsByTagName('a')[0];
var oFooterTime=oWeahterFooter.getElementsByTagName('span')[0];


oWeather.style.left=getCookie('weatherBoxLeft')+'px';
oWeather.style.top=getCookie('weatherBoxTop')+'px';

comDrag(oWeather);


oWeatherCont.onmousedown= function(ev){
	var ev= ev|| window.event;
	ev.cancelBubble=true;	
};

oAdrA.onclick=function(){
	oAdrData.style.display=oAdrData.style.display=='block'?'none':'block';
}

//天气里的数据
var cityName='深圳';

getWeather();

for(var attr in citymap){
	var option=document.createElement('option');
	option.innerHTML=attr;
	option.value=attr;
	aAdrSel[0].appendChild(option);
	
}

aAdrSel[0].onchange=function(){
	if(this.value=='--请选择地区--')return;
	var c=citymap[this.value];
	aAdrSel[1].innerHTML='';
	for(var attr in c){
		var option=document.createElement('option');
		option.innerHTML=attr;
		option.value=attr;
		aAdrSel[1].appendChild(option);
		
	}	
	
};
aAdrSel[1].onchange=function(){
	
	
};
oFooterBtn.onclick=function(){
	getWeather();
	
	var oNow=new Date();
	var m=oNow.getMonth()+1;
	var d=oNow.getDate();
	var h=oNow.getHours();
	var mou=oNow.getMinutes();
	var str=h+':'+mou+','+m+'/'+d;
	oFooterTime.innerHTML='更新时间 '+str;
	oFooterTime.style.fontSize='12px';
		
	
};
aAdrBtn[1].onclick=function(){ 
	oAdrData.style.display='none';		

};


aAdrBtn[0].onclick=function(){   //确定按钮
	
	
	if(aAdrSel[1].value!='--请选择城市--'){
		
		cityName=aAdrSel[1].value;
	}

	
	getWeather();
	oAdrData.style.display='none';	
}

function getCityCode(){
	for(var attr in citymap){
		for(var c in citymap[attr] ){
			if(cityName == c){
				return citymap[attr][c];
			}
		}
	}	
}


function getWeather(){
	var url = 'http://mimg.127.net/weather/';
	var code=getCityCode().substring(0,2)+'/'+getCityCode().substring(2,4)+'/'+getCityCode().substring(4)+'.js';
	
	url+=formatdate()+'/'+code;
	
	var oScript=document.createElement('script');
	oScript.src=url;
	oScript.charset = 'gbk';//设置的是被加载文件的编码	
	document.body.appendChild(oScript);
	
	oScript.onload=function(){
		oAdrA.innerHTML=city.name;
		if(city.tianqi[0]==city.tianqi[1]){
			oWeatherText[0].innerHTML=city.tianqi[0];
		}else{
			oWeatherText[0].innerHTML=city.tianqi[0]+'转'+city.tianqi[0];
		}
		oWeatherText[1].innerHTML=city.wendum[0]+'℃到'+city.wendum[1]+'℃';
	};
}

function formatdate(){
	var now = new Date();
	var y=now.getFullYear();
	var m=now.getMonth()+1;
	var d=now.getDate();
	
	m=m<10?'0'+m:''+m;
	d=d<10?'0'+d:''+d;
	
	return y+m+d;	
	
}

/*tick模块*/
var oTick=document.getElementById('tick');
var oTickList=oTick.getElementsByTagName('ul')[0];

var oTickPoint=oTick.getElementsByTagName('span');//时分秒，中间小圆
/*var Thtml='';
for(var i=0; i<60; i++){
	Thtml+="<li style='-webkit-transform:rotate("+i*6+"deg); -moz-transform:rotate("+i*6+"deg); -ms-transform:rotate("+i*6+"deg);'></li>";
}
oTickList.innerHTML=Thtml;*/
//alert(getComputedStyle(oTickPoint[0]).left+''+getComputedStyle(oTickPoint[1]).left+getComputedStyle(oTickPoint[2]).left)
toDate();
oTick.timer=setInterval(toDate,100);
function toDate(){
	var now=new Date();
	var h=now.getHours();
	var m=now.getMinutes();
	var s=now.getSeconds();
	var ms=now.getMilliseconds();

	h=(h+m/60+s/3600)%12;
	m=m+s/60;
	ms=s*1000+ms;

	
	
	oTickPoint[0].style.WebkitTransform='rotate('+h*30+'deg)';
	oTickPoint[1].style.WebkitTransform='rotate('+m/60*360+'deg)';
	oTickPoint[2].style.WebkitTransform='rotate('+ms*360/60000+'deg)';
	
	oTickPoint[0].style.transform='rotate('+h*30+'deg)';
	oTickPoint[1].style.transform='rotate('+m/60*360+'deg)';
	oTickPoint[2].style.transform='rotate('+ms*360/60000+'deg)';

}
comDrag(oTick);

oTick.style.left=getCookie('tickLeft')+'px';
oTick.style.top=getCookie('tickTop')+'px';

/*桌面画框效果*/

/*document.onmousedown=function(ev){
	var ev= ev || window.event;
	var target= ev.target || ev.srcElement;
	
	
}*/