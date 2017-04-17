// JavaScript Document

//弹窗组件
function Dialog(){
	
	this.dialog=null;
	this.titleBar=null;
	this.windowBody=null;
	this.mixBtn=null;
	this.max_revBtn=null;
	this.closeBtn=null;
	this.mixMask=null;
	
	this.content='';
	this.oMark=null;
	this.disX=0;
	this.disY=0;
	this.isMax=false;
	this.isMix=false;
	
	this.settings={
		
		width:580,
		height:480,
		left:470,
		top:40,
		dir:'center',	
		title:'',
		mark:false,
		content:'http://www.baidu.com'
	};	
	
}

Dialog.prototype.json={};  //防止一个一个图标多次点开同一个窗口

Dialog.prototype.init=function(opt){
	
	for(var attr in opt){  //配置参数输入
		this.settings[attr]=opt[attr];
	}
	
	if(this.json[this.settings.iNow] == undefined ){
		this.json[this.settings.iNow]=true;
	}
	
	if(this.json[this.settings.iNow]){
		
		this.create();
		
		this.setData();
		
		/*this.fnClose();*/
		
		if(this.settings.mark){
			this.mark();
		}
		
		this.json[this.settings.iNow] = false;
		
	}
};

Dialog.prototype.create=function(){
	
	this.dialog=document.createElement('div');
	
	this.dialog.id='dialog';
	this.dialog.style.height=this.settings.height+'px';
	this.dialog.style.width=this.settings.width+'px';
	this.dialog.style.left=this.settings.left+'px';
	this.dialog.style.top=this.settings.top+'px';
	this.dialog.style.zIndex=izIndex++;
	
	this.dialog.innerHTML='<div class="titleBar"><span class="titleTxt"></span><div class="buttonBar"><a class="windowMix"></a><a class="windowMax"></a><a class="windowClose"></a></div></div><div class="windowBody"><iframe src='+this.settings.content+'></iframe></div>'; 	
	
	this.titleBar=this.dialog.children[0];
	this.windowBody=this.dialog.children[1];
	
	this.mixBtn=getByClass(this.dialog,'windowMix')[0];
	this.max_revBtn=getByClass(this.dialog,'windowMax')[0];
	this.closeBtn=getByClass(this.dialog,'windowClose')[0];
	
	document.body.appendChild(this.dialog);
	
	this.createTaskMask();
};

Dialog.prototype.setData=function(){
	this.getChildrenWH();
	
	var _this=this;
	
	this.dialog.onmousedown=function(ev){
		var ev = ev || event;
		var target=ev.target || ev.srcElement;
		if(target.className=='titleBar'){
			return _this.fnDown(ev);
		}
		
	};
	
	
	this.max_revBtn.onclick=function(){
		if(!this.isMax){
			_this.beMax();
			this.isMax=true;
		}else{
			_this.beRev();
			this.isMax=false;	
		}
	};
	
	this.mixBtn.onclick=function(){
		_this.beMix();	
	};
	
	this.closeBtn.onclick=function(){
		_this.closeDialog();
	};
};

Dialog.prototype.getChildrenWH=function(){
	this.titleBar.style.width=this.windowBody.children[0].style.width=this.dialog.offsetWidth+'px';
	this.titleBar.style.height=this.dialog.offsetHeight*0.05+'px';
	this.windowBody.children[0].style.height=this.dialog.offsetHeight*0.95+'px';
	
};

Dialog.prototype.fnDown=function(ev){
	var _this=this;
	this.dialog.style.zIndex=++izIndex;
	this.disX=ev.clientX-this.dialog.offsetLeft;
	this.disY=ev.clientY-this.dialog.offsetTop;
	
	
	
	document.onmousemove=function(ev){
		var ev =ev || event;
		_this.fnMove(ev);
	};
	
	document.onmouseup=function(){
		_this.fnUp();	
		
	};	
	return false;
};

Dialog.prototype.fnMove=function(ev){
	var L=ev.clientX-this.disX;
	var T=ev.clientY-this.disY;

	L=L<0?0:L;
	T=T<0?0:T;
	L=L>(document.documentElement.clientWidth-this.dialog.offsetWidth)?(document.documentElement.clientWidth-this.dialog.offsetWidth):L;
	T=T>(document.documentElement.clientHeight-this.dialog.offsetHeight)?(document.documentElement.clientHeight-this.dialog.offsetHeight):T;
	this.dialog.style.left=L+'px';
	this.dialog.style.top=T+'px';	
	
};

Dialog.prototype.fnUp=function(){

	document.onmousemove=null;	
	document.onmouseup=null;
	
};

Dialog.prototype.beMax=function(){
	this.dialog.zIndex=izIndex++;
	this.dialog.style.left='100px';
	this.dialog.style.top='20px';
	this.dialog.style.height=document.documentElement.clientHeight-40+'px';
	this.dialog.style.width=document.documentElement.clientWidth-120+'px';	
	
	this.getChildrenWH();
	this.max_revBtn.style.backgroundPosition='-45px -14px';
	
};

Dialog.prototype.beRev=function(){
	this.max_revBtn.style.backgroundPosition='-15px -14px';
	this.dialog.style.left=this.settings.left+'px';
	this.dialog.style.top=this.settings.top+'px';
	this.dialog.style.height=this.settings.height+'px';
	this.dialog.style.width=this.settings.width+'px';	
	
	this.getChildrenWH();	
	
};

Dialog.prototype.beMix=function(){
	if(!this.isMix){
		
		this.dialog.style.display='none';
		this.isMix=true;
	}
};

Dialog.prototype.createTaskMask=function(){
	
	this.mixMask=document.createElement('div');
	this.mixMask.className='mixMask';
	this.mixMask.style.zIndex=izIndex++;
	this.mixMask.innerHTML='<img class="itemIcon" src='+this.settings.taskIcoSrc+'/><span class="itemTxt">'+this.settings.taskTxt+'</span>';
	oTaskContainer.appendChild(this.mixMask);
	
	_this=this;	
	this.mixMask.onclick=function(){
		_this.showDialog();
		
	}	
};

Dialog.prototype.showDialog=function(){

	this.dialog.style.display='block';
	this.isMix=false;
	 
	
};

Dialog.prototype.closeDialog=function(){
	
	document.body.removeChild(this.dialog);
	this.dialog=null;
	oTaskContainer.removeChild(this.mixMask);
	this.mixMask=null;	
	this.json[this.settings.iNow] = true;
};