// JavaScript Document
function isLoad(){
	var str=window.navigator.userAgent;
	
	if( str.indexOf('Chrome') ==-1 && str.indexOf('Firefox') == -1 ){
		preventLoad();
	}

}
// isLoad();
//alert( window.navigator.userAgent );

function preventLoad(){
	var otextNotice=document.createElement('div');
	otextNotice.className='textNotice';
	
	otextNotice.innerHTML='<div class="bigMask"></div><p class="notice">系统检测到您使用的浏览器不太好，小站运用了CSS3和HTML5的效果，为了您的完美浏览体验，请选择谷歌或火狐浏览器。</p></div>';
	
	document.body.appendChild(otextNotice);
}


loadBar();
function loadBar(){
	
	var oLoadBar=document.getElementById('loadBar');
	var oNow=oLoadBar.children[1].children[0];
	var Num=oLoadBar.children[1].children[1];
	
	var oBarLength=parseInt( getComputedStyle(oLoadBar.children[1]).width );
	
	var All_img=document.getElementsByTagName('img');
	var iCur=0;
	
	var arrSrc=[
		"images/skin-bg/bg1.jpg",
		"images/skin-bg/bg2.jpg",
		"images/skin-bg/bg3.jpg",
		"images/skin-bg/bg4.jpg",
		"images/skin-bg/bg5.jpg",
		"images/111/images/icon/doudizhu.png",
		"images/111/images/icon/musicbox.png",
		"images/111/images/icon/wangdesk.png",
		"images/111/images/icon/appmarket.png",
		"images/111/images/icon/kaikai.png",
		"images/111/images/icon/3366.png",
		"images/fang360/clos.png",
		"images/fang360/refresh.png",
		"images/icon1/dialog_button_bg.gif",
		"images/icon1/weather_bg.png"
	];	
	var oImage = new Image();
	
	loadImg();
	
	oLoadBar.style.display='none';
	
	function loadImg(){
		
		oImage.src=arrSrc[iCur];
		
		oImage.onload=function(){
			
			iCur++;
			
			var iScale=iCur/arrSrc.length;
			
			oNow.style.width=iScale*oBarLength+'px';
			
			Num.innerHTML=(iScale*100).toFixed(2)+'%';
			//document.title=iCur;
			if(iCur<arrSrc.length){
				loadImg();
			}
				
			
			
		};	
		
	}
} 

 
/*function ToolDialog(){
	
	this.dialog=null;
	this.oMask=null;
	
	this.settings={
		
		mark:true
		
	};	
	
}

ToolDialog.prototype.init=function( opt ){   //配置参数
	
	for( var attr in opt){
		this.settings[attr] = opt[attr];
	}		
	
	this.create();
	this.setData();
};*/