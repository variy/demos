// JavaScript Document
/*公用的包装函数*/
 Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


function getTop(obj){
	var iTop=0;
	while(obj){
		iTop+=obj.offsetTop;
		obj=obj.offsetParent;
	}
	return iTop;
}

function getLeft(obj){
	var iLeft=0;

	while(obj){
		iLeft+=obj.offsetLeft;
		obj=obj.offsetParent;
	}
	return iLeft;
}

function getStyle(obj,attr){
	if(obj.currentStyle){
		return parseInt( obj.currentStyle[attr] );
	}
	return parseInt( getComputedStyle(obj)[attr] );
}

function getByClass(oParent,oClass){
	var arr=[];
	var aElems=oParent.getElementsByTagName('*');
	for(var i=0; i<aElems.length; i++){
		var arr1=aElems[i].className.split(' ');
		for(var j=0; j<arr1.length; j++){
			if(arr1[j]==oClass){
				arr.push(aElems[i]);
			}
		}
	}
	return arr;
}

function comDrag(obj){
	var disX=0;
	var disY=0;
	obj.onmousedown=function(ev){
		
		//console.log(getStyle(obj,'transition'));

		var ev = ev || window.event;
		disX=ev.clientX-getLeft(obj);
		disY=ev.clientY-getTop(obj);
		this.style.zIndex=izIndex;
		bind(document,'mousemove',fnMove);
		function fnMove(ev){
			var ev= ev || event;
			var L=ev.clientX-disX;
			var T=ev.clientY-disY;
			L=L<0?0:L;
			L=L>document.documentElement.clientWidth-obj.offsetWidth?document.documentElement.clientWidth-obj.offsetWidth:L;
			T=T<0?0:T;
			T=T>document.documentElement.clientHeight-obj.offsetHeight?document.documentElement.clientHeight-obj.offsetHeight:T;
			obj.style.left=L+'px';
			obj.style.top=T+'px';
			//document.title=obj.offsetLeft;
		}
		
		bind(document,'mouseup',fnUp);
		function fnUp(){
			remove(document,'mousemove',fnMove);
			remove(document,'mouseup',fnUp);
			setCookie(obj.className+'Left',obj.offsetLeft,1000);
			setCookie(obj.className+'Top',obj.offsetTop,1000);
		};
		
		return false;	
	}
}

function ispg(obj1,obj2){   //碰撞检测——obj1主动，obj2被动
	var L1=obj1.offsetLeft;
	var R1=obj1.offsetLeft+obj1.offsetWidth;
	var T1=obj1.offsetTop;
	var B1=obj1.offsetTop+obj1.offsetHeight;
	
	var L2=obj2.offsetLeft;
	var R2=obj2.offsetLeft+obj2.offsetWidth;
	var T2=obj2.offsetTop;
	var B2=obj2.offsetTop+obj2.offsetHeight;
	
	if(R1<L2 || L1>R2  ||B1<T2 || T1>B2){
		console.log('没找到');
		return false;
	}
	console.log('找到la');
	return obj2;
}

function bind(obj, evName, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evName, fn, false);
	} else {
		obj.attachEvent('on' + evName, function() {
			fn.call(obj);
		});
	}
}

function remove(obj, evName, fn){
	if( obj.removeEventListener){
		obj.removeEventListener(evName,fn,false);
	}else{
		obj.detachEvent('on'+evName, function(){
			fn.call(obj);	
		});	
	}
	
}

function getDisDot(arr1,arr2){
	return Math.sqrt( Math.abs( (arr2[0]-arr1[0])*2 )+Math.abs( (arr2[1]-arr1[1])*2) );
	
}

function   setCookie  (key, value, t) {
	var oDate = new Date();
	oDate.setDate(oDate.getDate() + t);
	document.cookie = key + '=' + value + ';expires=' + oDate.toUTCString();
}

function getCookie(key) {	
	var arr1 = document.cookie.split('; ');
	for (var i=0; i<arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if (arr2[0] == key) {
			return arr2[1];
		}
	}
}

function delCookie(key) {
	setCookie(key, '', -1);
}



function startMove(obj,json,endFn){

	clearInterval(obj.timer);
	
	obj.timer = setInterval(function(){
		
		var bBtn = true;
		
		for(var attr in json){
			
			var iCur = 0;
		
			if(attr == 'opacity'){
				if(Math.round(parseFloat(getStyle(obj,attr))*100)==0){
				iCur = Math.round(parseFloat(getStyle(obj,attr))*100);
				
				}
				else{
					iCur = Math.round(parseFloat(getStyle(obj,attr))*100) || 100;
				}	
			}
			else{
				iCur = parseInt(getStyle(obj,attr)) || 0;
			}
			
			var iSpeed = (json[attr] - iCur)/8;
		iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if(iCur!=json[attr]){
				bBtn = false;
			}
			
			if(attr == 'opacity'){
				obj.style.filter = 'alpha(opacity=' +(iCur + iSpeed)+ ')';
				obj.style.opacity = (iCur + iSpeed)/100;
				
			}
			else{
				obj.style[attr] = iCur + iSpeed + 'px';
			}
			
			
		}
		
		if(bBtn){
			clearInterval(obj.timer);
			
			if(endFn){
				endFn.call(obj);
			}
		}
		
	},30);

}

function startMoveQ(obj,json,times,fx,fn){
		
	var iCur = {};
	var startTime = nowTime();
	
	if( typeof times == 'undefined' ){
		times = 400;
		fx = 'linear';
	}
	
	if( typeof times == 'string' ){
		if(typeof fx == 'function'){
			fn = fx;
		}
		fx = times;
		times = 400;
	}
	else if(typeof times == 'function'){
		fn = times;
		times = 400;
		fx = 'linear';
	}
	else if(typeof times == 'number'){
		if(typeof fx == 'function'){
			fn = fx;
			fx = 'linear';
		}
		else if(typeof fx == 'undefined'){
			fx = 'linear';
		}
	}
	
	for(var attr in json){
		iCur[attr] = 0;
		if( attr == 'opacity' ){
			iCur[attr] = Math.round(getStyle(obj,attr)*100);
		}
		else{
			iCur[attr] = parseInt(getStyle(obj,attr));
		}
	}
	
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		
		var changeTime = nowTime();
		
		//startTime changeTime
		
		var scale = 1-Math.max(0,startTime + times - changeTime)/times; //2000 - 0 -> 1-0 -> 0-1
		
		for(var attr in json){
			
			var value = Tween[fx](scale*times,iCur[attr],json[attr] - iCur[attr],times);
			
			if(attr == 'opacity'){
				obj.style.filter = 'alpha(opacity='+ value +')';
				obj.style.opacity = value/100;
			}
			else{
				obj.style[attr] = value + 'px';
			}
			
		}
		
		if(scale == 1){
			clearInterval(obj.timer);
			if(fn){
				fn.call(obj);
			}
		}
		
		
	},30);
	
	
	function nowTime(){
		return (new Date()).getTime();
	}
	
	
}



var Tween = {
	linear: function (t, b, c, d){  //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){  //加速曲线
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){  //减速曲线
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){  //加速减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){  //加加速曲线
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){  //减减速曲线
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 3.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
}