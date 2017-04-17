// JavaScript Document

var oD_textmenu=document.getElementById('d_textmenu');//空白处的菜单

var arrD_ClassName=['bgImg_all','pagewrap','page'];

function isokName(oname,arr){  //把className和检验的数组传进去
	var aClass=oname.split(' ');
	for(var i=0; i<aClass.length; i++){
		for(var j=0; j<arr.length; j++){
			if(arr[j] == aClass[i]){
				return true;
			}
		}
	
	}
	return false;
}

bind(document,'contextmenu',function(ev){
	
	var ev= ev || event;
		
	D_contextmenu(ev);
	
	ev.preventDefault();
	
});

function D_contextmenu(ev){

	var target = ev.target || ev.srcElement;
	
	if( isokName(target.className,arrD_ClassName) ){
		
		oD_textmenu.style.display='block';
		oD_textmenu.style.zIndex=izIndex++;
		
		var L=ev.clientX;
		var T=ev.clientY;
			if (L > document.documentElement.clientWidth - oD_textmenu.offsetWidth-10) {
			L = document.documentElement.clientWidth - oD_textmenu.offsetWidth-10;
		}
		
		if (T > document.documentElement.clientHeight - oD_textmenu.offsetHeight-10) {
			T = document.documentElement.clientHeight - oD_textmenu.offsetHeight-10;
		}
	
		oD_textmenu.style.left=L+'px';
		oD_textmenu.style.top=T+'px';
		//bind(document,'mouseover','menu_move');
		/*function menu_move(ev){
			var ev = ev || event;
			var idis=40;
			if(ev.clientX<L-idis || ev.clientX>L+oD_textmenu.offsetWidth+idis || ev.clientY<T-idis ||ev.clientY>T+oD_textmenu.offsetHeight+idis){
				oD_textmenu.style.display='none';	
			}
		}*/
	}else{
		oD_textmenu.style.display='none';
	}
	

	return false;
}

bind(document,'click',function(ev){
	var ev = ev|| event;
	oD_textmenu_disappear(ev)
	
});
function oD_textmenu_disappear(ev){
	var target=ev.target || ev.srcElement;
	if(target.className!='d_textmenu'){
		oD_textmenu.style.display='none';
	}
}

(function(window){
	window.bg ={
		oDom: document.getElementById('client-bg-box').children[0],
		getImgRate:function(){
			return this.oDom.offsetWidth/this.oDom.offsetHeight
		},
		getWinRate: function(){
			return document.documentElement.clientWidth/document.documentElement.clientHeight;
		},
		setWh: function(){

			if( this.getWinRate() > this.getImgRate() ){
				// document.title = '宽'
				this.oDom.style.width = '100%';
				this.oDom.style.height= 'auto';	
			}else{
				// document.title = '高'
				this.oDom.style.height = '100%';
				this.oDom.style.width = 'auto';
			}
		},
		bindEvent:function(){
			var self = this;
			window.addEventListener('resize',function(){
				self.setWh();
			})
		},
		init:function(){
			this.setWh();
			this.bindEvent();
		}
	}
	bg.init();
})(window);

(function (win){
	var datas = [
		[
			'images/skin-bg/bg1_3d.png',
			'images/skin-bg/bg2_3d.png',
			'images/skin-bg/bg3_3d.png',
			'images/skin-bg/bg4_3d.png',
			'images/skin-bg/bg5_3d.png'
		],
		[
			'images/skin-bg/bg1.jpg',
			'images/skin-bg/bg2.jpg',
			'images/skin-bg/bg3.jpg',
			'images/skin-bg/bg4.jpg',
			'images/skin-bg/bg5.jpg'
		]
	];
	win.bgs = {
		oBackdrop: document.querySelector('body > .backdrop'),
		el: document.querySelector('#js-change-bg')
	};

	bgs.render=function(){
		var tpl = document.querySelector('#change-bg').innerHTML;
		var data ={data: datas[0]};
		var html = _.template(tpl,data);
		document.querySelector('#js-change-bg').innerHTML = html;
	}();
	
	bgs = {
		tier:1,
		index: -1,
		oBackdrop: document.querySelector('body > .backdrop'),
		el: document.querySelector('#js-change-bg'),
		aItems: document.querySelector('.bg-list').children,
		oBox: document.querySelector('.bg-list'),
		_target:document.querySelector('#client-bg'),
		pos:[],
		getPos:function(){
			_.each(this.aItems,function(a,i){
				a.className='item';
				a.style.left = this.pos[a.index][0]+'px';
				a.style.top = this.pos[a.index][1]+'px';
				a.style.zIndex = a.index;		
			},this);
		},
		init: function(){
			_.each(this.aItems,function(obj,i){

				obj.index = i;
				obj.style.left = 60*i + 'px';
				obj.style.top = -12*i + 'px';
				obj.style.zIndex = i;
				
				this.pos.push([(60*i),(-12*i)]);	
			},this);
			bgs.oBackdrop.style.display = 'block';
			bgs.el.style.display = 'block';
			startMoveQ(bgs.oBackdrop,{opacity:80},function(){
				startMoveQ(bgs.el,{opacity:100});
			});


			this.count = this.index = this.iNow = this.aItems.length-1;
			var self = this;
			this.oBox.onclick = function(e){
				console.log(e.target.parentNode.index);
				self.showItems(e.target.parentNode.index);
			};
			this.oBox.parentNode.children[1].children[0].onclick = function(){
				self.beUsed();
			};

			this.oBox.parentNode.children[1].children[1].onclick = function(){
				self.destory();					
			};
		},
		beUsed: function(){
			var n=-1;
			_.each(this.aItems,function(a,i){
				if(a.style.zIndex =='4'){
					n=i;
				}
			});
			if(n==-1)n=this.count;
			this._target.src=datas[1][n];

		},
		showItems: function(n){
			var dis = this.count - n;
			_.each(this.aItems,function(a){
				if(a.index == n){
					a.index = this.count;
				}else if(a.index > n){

					a.index =  (a.index+dis)-this.count-1;
				}else{
					a.index +=dis ;
				}
			},this);

			this.getPos();
		},
		destory: function(){
			var self = this;
			startMoveQ(self.el,{opacity:0},function(){
				self.el.style.display = 'none';
				startMoveQ(self.oBackdrop,{opacity:0},function(){
					self.oBackdrop.style.display="none";
				});
			})
		}

	};
	// setTimeout(function(){bgs.init.call(bgs)},0)

	document.querySelector('#leftSide .mainSet').addEventListener('click',function(){
		bgs.init.call(bgs);
	},false)

})(window);

