
var arrName=[];

function isok(name){
	for(var i=0; i<arrName.length; i++){
		if(arrName[i]==name){
			return false;
		}
	}
	return true;
}

function getImg(name){
	for(var i=0; i<arrMatch[0].length;i++){
		if(name==arrMatch[0][i]){
			return arrMatch[1][i];
		}
	}
	
}

function getPageLi(obj){
	return pages[obj.settings.ipage].getElementsByTagName('li');
}

var arrMatch=[['斗地主','腾讯微博','腾讯视频','QQ空间','QQ邮箱','天气','起点中文网','音乐盒子','搜搜地图','QQ宠物','虾米音乐','QQ阅读','团购地图','网络硬盘','芒果视频','乐视网','便签','蝴蝶绘图','app市场','朋友网','QQ群','快递查询','附近的人','QQ浏览器','kxjy','开心网','金山网盘','3366'],['doudizhu','weibo','video','zone','mail','weather','qidian','musicbox','sosomap','qqbaby','xiami','qqread','tuanmap','wangdesk','mangguo','leshi','bianqian','hudie','appmarket','friend','QQgroup','fastsearch','friendnear','internet','kxjy','kaikai','jinshan','3366']];


// 面向对象的格子
function Ico(){
	
	this.lat=null;
	
	this.img=null;
	
	this.title=null;
	
	this.box=null;
	
	this.contextmenu=null;
	

	this.isClick = true;
	this.changeWrap=null;
	
	this.sec_menu=null;
	
	this.menu_option=null;
	
	this.remove_option=null;
	
	this.menu_disX=0;
	
	this.menu_disY=0;
			
	this.index=-1;
	
	this.settings={		//默认参数
		name:'未命名',
		marginLeft:25,
		marginTop:20,
		ipage:0		
	};
	
}

Ico.prototype.init=function(opt){  //初始化
	
	for(var attr in opt){        //配置参数输入
		this.settings[attr] = opt[attr];
	}
	
	this.create();
	this.setData();
	
	var _this=this;
	
	this.lat.onmousedown=function(ev){
	   var ev = ev || window.event;
	    return _this.fnDown(ev);
   	};	

	this.lat.oncontextmenu=function(ev){
		var ev= ev || event;
		return _this.fnContextmenu(ev);
	};	
	
	this.lat.onmouseover=function(){
		_this.fnOver();	
		
	};
	
	this.lat.onmouseout=function(){
		_this.fnOut();	
		
	};
};


Ico.prototype.create = function(){
	this.lat=document.createElement('li');
	this.lat.className='lat';
	this.lat.innerHTML='<a href="javascript:;"><img  src="images/111/images/icon/'+getImg(this.settings.name)+'.png"/></a><div class="icoTitle"><p class="icoTitleCont latMark">'+this.settings.name+'</p><div class="icoTitleIn"></div></div>';  
	
	this.img=this.lat.getElementsByTagName('img')[0];
	this.title=this.lat.getElementsByTagName('p')[0];
	this.box=pages[this.settings.ipage];
	this.box.appendChild(this.lat);	
};

Ico.prototype.setData=function(){
	this.getIndex();
	this.getPosition();	
};

Ico.prototype.getIndex = function(){
	this.index=this.box.children.length-1;

};

Ico.prototype.getPosition=function(callback){
	//alert(this.box.offsetHeight+'索引是'+this.index+'在'+this.settings.ipage+'标签是'+this.lat.nodeName+'内容是'+this.lat.innerHTML);
	var self = this;
	var row=Math.floor( this.box.offsetHeight/(88+this.settings.marginTop) );
	var i=this.index;
	this.lat.style.left= Math.floor(i/row)*(88+this.settings.marginLeft)+'px';
	this.lat.style.top=(i%row)*(88+this.settings.marginTop)+'px';
	if( callback){
		this.lat.addEventListener('webkitTransitionEnd',end);
		this.lat.addEventListener('transitionend',end);
		function end(){
			self.lat.removeEventListener('webkitTransitionEnd',end);
			self.lat.removeEventListener('transitionend',end);
			callback();
		}
	}
};

Ico.prototype.fnDown=function(ev){
	//alert(this.box.offsetHeight);
	var oldtrans = getComputedStyle(this.lat)['transition'];
	
	this.lat.style.transition = 'all 0s ease 0s';
	this.lat.style.zIndex=izIndex++;

	var disX=ev.clientX-this.lat.offsetLeft,
	    disY=ev.clientY-this.lat.offsetTop,
		down_evX=ev.clientX,
		down_evY=ev.clientY;
	
	var _this=this;	
	document.onmousemove=function(ev){
		var ev=ev || window.event;
		_this.fnMove(ev,down_evX,down_evY,disX,disY);	
		
	};
	
	document.onmouseup=function(ev,oldtransition){
		var ev=ev || window.event;
		_this.fnUp(ev,oldtrans);
	};
	
	return false;	
	//ev.preventDefault()
};

Ico.prototype.fnMove=function(ev,down_evX,down_evY,disX,disY){
	this.lat.style.left = ev.clientX-disX+'px';
	this.lat.style.top =  ev.clientY-disY+'px';
	
	var iDis = getDisDot([down_evX,down_evY],[ev.clientX,ev.clientY]);
	if(iDis >2)this.isClick=false;
	for(var i=0; i<this.box.children.length; i++){
		this.box.children[i].style.border='';
	}

	if(getNearest(this)!=-1){		
		this.box.children[getNearest(this)].style.border='1px solid #FFF';
	}
};

Ico.prototype.fnUp=function(ev,oldtrans){
	var self = this;
	this.lat.style.transition = oldtrans; //把拖动前的过渡属性重新赋值
	
	
	for(var i=0; i<this.box.children.length; i++){
		this.box.children[i].style.border='';
	}
	if(getNearest(this)!=-1){		
		var other=arrO[this.settings.ipage][getNearest(this)];
		var tmp=this.index;
		this.index=other.index;
		other.index=tmp;
		other.getPosition();
	}

	this.getPosition(function(){self.isClick = true});
	document.onmousemove=null;	
	document.onmouseup=null;	
};


Ico.prototype.fnOver=function(){
	this.lat.style.backgroundPosition='1px 0';	
	
}

Ico.prototype.fnOut=function(){
	this.lat.style.backgroundPosition='-90px 0';	
	
}

//

Ico.prototype.fnContextmenu=function(ev){
	

		
	 if( this.contextmenu!=null){
	
		 document.body.removeChild(this.contextmenu);
		 this.contextmenu=null;
	 }
	
	this.contextmenu=document.createElement('ul');
	this.contextmenu.id='ic_textmenu';
	this.contextmenu.innerHTML='<li><a class="ico_btn" href="#">打开应用</a></li><li><a class="ico_btn" href="#">移动至 →</a><ul class="changePage"><li><a href="#">桌面一</a></li><li><a href="#">桌面二</a></li><li><a class="active" href="#">桌面三</a></li><li><a href="#">桌面四</a></li><li><a href="#">桌面五</a></li></ul></li><li><a class="ico_btn" href="#">卸载应用</a></li>';
	
	this.sec_menu=getByClass(this.contextmenu,'changePage')[0];  //
	
	this.remove_option=this.contextmenu.children[2];  //卸载应用选项
	
	this.changeWrap=this.contextmenu.children[1];    //更改桌面的BOX
	
	this.menu_option=this.changeWrap.children[1].children;//li的页码选项集合（包含a标签的li的页码选择）
	
	document.body.appendChild(this.contextmenu);
	this.menu_disX=ev.clientX;
	this.menu_disY=ev.clientY;
	
	this.contextmenu.style.left=this.menu_disX+'px';
	this.contextmenu.style.top=this.menu_disY+'px';
	this.contextmenu.style.zIndex=izIndex++;
	
	var _this=this; 
	
	this.remove_option.onclick=function(){             //卸载应用
		_this.removeIco();
		_this.contextmenu.style.display='none';	
	};
	
	this.changeWrap.onmouseover=function(){            //鼠标移入“移动→”
		_this.showSecMenu();
	};
	
	this.changeWrap.onmouseout=function(){				//鼠标移出"移动→"
		_this.disMenu();
	};
	
	for(var i=0; i<this.menu_option.length; i++){  //页码选项
		if(i==this.settings.ipage){
			
			this.menu_option[i].children[0].style.color='#aaa';
			this.menu_option[i].onclick=function(){
				return false;	
			}	
		}else{
			(function(i){
				_this.menu_option[i].onmouseover=function(){
					_this.option_over(i);
				}
				
				_this.menu_option[i].onmouseout=function(){
					_this.option_out(i);
				}
				
				_this.menu_option[i].onclick=function(){
					_this.changeIpage(i);
					_this.contextmenu.style.display='none';
				}
			})(i)  //i是从0计数
		}
		
		
		
	}
	
	bind(document,'click',function(){
		_this.contextmenu.style.display='none';		
	});
	
/*	bind(document,'contextmenu',function(){
		_this.contextmenu.style.display='none';		
	});*/
	/*bind(document,'mousemove',menu_move);
	function menu_move(eve){
		var eve =eve || event;
		var idis=8;
		if(eve.clientX<_this.menu_disX-idis || eve.clientX>_this.menu_disX+_this.contextmenu.offsetWidth+getStyle(_this.sec_menu,'width')+idis || eve.clientY<_this.menu_disY-idis ||eve.clientY>_this.menu_disY+getStyle(_this.sec_menu,'height')+idis+30){  //一级菜单比二级菜单高出一个li的高度，所以减去30
			_this.contextmenu.style.display='none';	
		}
	};*/
	
	   
	

	
	return false;
	
};

//
Ico.prototype.showSecMenu=function(){
	this.sec_menu.style.display='block';	
	
	
};

Ico.prototype.disMenu=function(){
	this.sec_menu.style.display='none';	
	
};

Ico.prototype.option_over=function(num){
	this.menu_option[num].className='active';

};

Ico.prototype.option_out=function(num){
	this.menu_option[num].className='';
	
};

Ico.prototype.changeIpage=function(num){  //num是从0计数(移动到第几页)
	
	var proName=this.settings.name;  //之前的名字
	var proPage=this.settings.ipage;  //之前的页码
	var _this = this;

	var iTarget = {
		left:( getLeft(aTabBtn[num]) + aTabBtn[num].offsetWidth/2 ) - getLeft(this.lat.parentNode)-this.lat.offsetWidth/2,
		top:( getTop(aTabBtn[num]) + aTabBtn[num].offsetHeight/2 ) - getTop(this.lat.parentNode)-this.lat.offsetHeight/2
	}
	this.lat.style.top = iTarget.top+'px';
	this.lat.style.left = iTarget.left+'px';
	this.lat.style.opacity = 0;

	this.lat.addEventListener("webkitTransitionEnd",end,false);
	this.lat.addEventListener("transitionend",end,false);

	function end (){
		_this.lat.removeEventListener("webkitTransitionEnd",end,false);
		_this.lat.removeEventListener("transitionend",end,false);
		
		_this.removeIco();
	}

// _this.removeIco(this);
	var obj= new Ico();
	obj.init({
		name:proName,
		ipage:num	
	})
	putArrO(obj);
	
};


Ico.prototype.removeIco=function(){
	var proIndex=this.index;
	var proPage=this.settings.ipage;
	pages[this.settings.ipage].removeChild(this.lat);
	arrO[this.settings.ipage].splice(this.index,1);


	for(var i=0; i<arrO[proPage].length; i++){
		
		if( arrO[proPage][i].index>proIndex){
			
			arrO[proPage][i].index--;

			arrO[proPage][i].getPosition();
			
			
		}
	}
};
//
function getNearest(obj){
	var L=obj.lat.offsetLeft;
	var T=obj.lat.offsetTop;
	var arr1=[[],[]];
	for(var i=0; i<obj.box.children.length; i++){
		if( !ispg(obj.lat,obj.box.children[i]) || obj.box.children[i]==obj.lat )continue;
		var L1=obj.box.children[i].offsetLeft;
		var T1=obj.box.children[i].offsetTop;
		var C1=Math.sqrt( Math.pow(L-L1,2)+Math.pow(T-T1,2) );
		
		arr1[0].push(i);
		arr1[1].push(C1);
		
	}
	if(arr1[0].length==0){
		return -1;
	}
	var index=arr1[0][0];
	var tmp=arr1[1][0];
	for(var i=1; i<arr1[1].length; i++){
		if(arr1[1][i]<tmp){
			tmp=arr1[1][i];
			index=arr1[0][i];	
		}
	}
	return index;
}