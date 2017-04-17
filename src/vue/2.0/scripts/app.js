/*
	基本设定： 只有一个电源，有N个灯泡
*/
var LEVEL = 0;
var a = new Levels({
	data: function(){
		this.level = Number(sessionStorage.LEVEL || '0');
		var oneLevelData = levelData[this.level];
		var copyData = oneLevelData.data.slice();
		return {
			level: this.level,
			col: oneLevelData.col,
			time: oneLevelData.time,
			timeout: oneLevelData.timeout,
			mapData: copyData
		}
	},
	methods: {
		resetLevelData: function(){
			var oneLevelData = levelData[this.level];
			var copyData = oneLevelData.data.slice();

			this.mapData = copyData;
			this.time = oneLevelData.time;
			this.timeout = oneLevelData.timeout;
			this.parseLighted();
		},
		switchVoice: function(){
			
		}
	}

});
a.$mount('#container');

// var Game = new Vue.extend({
// 	methods: {
// 		handlePass: function(){

// 		}
// 	}
// });

// new Game({
// 	data: function(){
// 		return {
// 			level: Number(sessionStorage.LEVEL || '0')
// 		}
// 	}
// })

var showDialog = function(opts){
	opts = opts || {};

	var btnDefaultOpt = {
		txt: '',
		style:'default',
		cb: function(){
			return true
		}
	}

	opts.title = opts.title || '';
	opts.btns = opts.btns || [];

	opts.btns = opts.btns.map(function(item){
		for(var attr in btnDefaultOpt){
			if(!(attr in item))item[attr] = btnDefaultOpt[attr]
		}
		return item;
	});
	var template =  _.template($('#dialog-tpl').html());
	
	var o = {
		init: function(){
			this.render();
			this.initEvent();
			return this;
		},
		render: function(){
			this.$el = $('<div class="dialog"></div>');
			this.$el.html(template(opts)).appendTo('body');
		},
		initEvent: function(){
			var me = this;
			this.show = function(){
				me.$el.show();
			};
			this.hide = function(){
				me.$el.remove();
			}
			me.$el.find('button').each(function(item){
				$(this).click(function(){
					var index = $(this).index();
					var isClose = opts.btns[index].cb();
					if(isClose)me.hide();
				})
			});

			this.show();
		}
	}

	return o.init.call(o);
};
showDialog({
	title: '哇哦，时间到了，请集中念力，再来一次',
	btns: [{
		txt: '确定',
		cb: function() {
			return true;
		}
	},{
		txt: '不确定',
		cb: function() {
			alert(1)
			return true;
		}
	}]
})

setInterval(function() {
	if (!a.timeout) {
		a.time--;
		if (a.time <= 0) {
			// Vue.set(me.timeout, true);
			a.timeout = true;
		}
	}
}, 1000);