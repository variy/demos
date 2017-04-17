// JavaScript Document
var oLeft=document.getElementById('leftSide');
var oLList=oLeft.getElementsByTagName('ul')[0];

//左侧苹果菜单の面向对象

function appleIco(){
	
	this.lat=null;
	
	this.img=null;
	
	this.index=-1;
	
	this.disX=0;
	
	this.disY=0;	
	
	this.settings={  //默认参数
		name:'未命名',	
		where:'left',
	};
	
}

appleIco.prototype.init=function(opt){
	
	for(var attr in opt){			//配置参数输入
		this.settings[attr]=opt[attr];
	}	
	
	this.create();
	this.setData();
	document.onmouseover=function(){
		
	}
};

appleIco.prototype.create=function(){
	this.lat=document.createElement('li');
	this.lat.innerHTML='<img src="images/111/images/icon/'+getImg(this.settings.name)+'.png"/>';
	this.img=this.lat.children[0];	
	oLList.appendChild(this.lat);
};

appleIco.prototype.setData=function(){
	this.getIndex();
	this.getPosition();	
	
};

appleIco.prototype.getIndex=function(){
	this.index=	oLList.children.length-1;
	
};

appleIco.prototype.getPosition=function(){
	this.lat.style.left=0;
	this.lat.style.top=25+(30+getStyle(this.lat,'height'))*this.index+'px';	
	
};