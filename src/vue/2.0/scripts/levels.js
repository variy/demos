(function(win){
	/*公共方法*/
	// var tapEvt = 'ontouchstart' in document? 'touchstart': 'click';
	// var classNames = ['rft', 'bfr', 'lfb', 'tfl'];
	// var map = {
	// 	'line-right': 'bfr',
	// 	'line-bottom': 'lfb',
	// 	'line-left': 'tfl',
	// 	'line-top': 'rft'
	// };

	/*
		0:  light or battery or nonexit, A\B\0;  + lighten, - darken
		1: topLine, 1 exit 0 nonexit, + -
		2: rightLine
		3: bottomLine
		4: leftLine
	*/
	var eventHub = new Vue();

	var grid = Vue.extend({
		template: '#grid-tpl',
		props: {
			sign: {
				type: String,
				required: true
			},
			rotate: {
				type: Number,
				required: true
			},
			lighted: {
				type: Boolean
			},
			index: {
				type: Number
			}
		},
		created: function(){
		},
		data: function() {
			return {
				hasLight: this.sign[0] === 'A',
				hasBattery: this.sign[0] === 'B',
				topLine: this.sign[1] === '1',
				rightLine: this.sign[2] === '1',
				bottomLine: this.sign[3] === '1',
				leftLine: this.sign[4] === '1',
				// rotate: 0,
				aaa: 'rotate3d(0,0,0)'
			}
		},
		methods: {
			roll: function(){
				// this.rotate++;
				
				eventHub.$emit('rollGrid', {
					index: this.index
				});
			},
			parseData: function(){
				
				this.hasLight = this.sign[0] === 'A';
				this.hasBattery= this.sign[0] === 'B';
				this.topLine= this.sign[1] === '1';
				this.rightLine= this.sign[2] === '1';
				this.bottomLine= this.sign[3] === '1';
				this.leftLine= this.sign[4] === '1';
			}
		},
		watch: {
			'sign': function(){
				this.parseData();
			},
			'rotate': function(){

				this.aaa = 'rotateZ('+ this.rotate*90+'deg)'
				if(this.rotate === 1 && this.index === 9){
					console.log('index=>'+this.sign)
				}
			}
		}
	}) 
	Vue.component('grid', grid);
/**/
	win.Levels = Vue.extend({
		computed: {
		    lightCount: function(){
		        return PowerFn.getLightLen(this.mapData);
		    },
		    batteryIndex: function(){
		        return PowerFn.getBatteryIndex(this.mapData);
		    },

		},
		created: function(){
			var me =  this;
			// this.lightCount = PowerFn.getLightLen(this.mapData);
			// this.batteryIndex = PowerFn.getBatteryIndex(this.mapData);

			eventHub.$on('rollGrid', function(signOpt){
				var rotate = ++me.mapData[signOpt.index].rotate;
				var sign = me.mapData[signOpt.index].sign;
				var realSign = PowerFn.signTurn(sign, rotate);

				Vue.set(me.mapData, signOpt.index, {
					lighted: false,
					rotate: rotate,
					sign: sign,
					turnSign: realSign
				});
				me.parseLighted();
			});

			this.parseLighted();
		},
		methods: {
			resetLevel: function(){

			},
			parseLighted: function(){
				var me = this;
				var connectedInfo = PowerFn.getConnectedLines(this.mapData, this.col, this.batteryIndex);

				var activeGrids = connectedInfo.gridArr;
				var successLen = connectedInfo.successLen;
				console.log(successLen)
				var adjust = {};
				this.mapData.forEach(function(item, index){
					if(activeGrids.indexOf(index) > -1){
						// 在亮灯的索引里
						if(!item.lighted){
							adjust[index] = {
								lighted: true,
								turnSign: item.turnSign,
								sign: item.sign,
								rotate: item.rotate

							}
						}
					}else{
						if(item.lighted){
							adjust[index] = {
								lighted: false,
								turnSign: item.turnSign,
								sign: item.sign,
								rotate: item.rotate
							}
						}
					}
				});
				
				for(var attr in adjust){
					Vue.set(me.mapData, attr, adjust[attr])
				}

				if(this.lightCount === successLen){
					alert('success');
					me.level++;
					sessionStorage.LEVEL = me.level;
				}
			}
		},
		events: {
		},
		watch: {
			'level': function(){
				var me = this;
				this.col = levelData[this.level].col;
				(levelData[this.level].data).forEach(function(item, index){
					Vue.set(me.mapData, index, item);
				});
				// this.lightCount = PowerFn.getLightLen(this.mapData);
				// this.batteryIndex = PowerFn.getBatteryIndex(this.mapData);
				setTimeout(function(){
					me.parseLighted();
				},300)
			},
			'mapData': function(){
				
			},
			timeout: function(){
				if(confirm('时间用完了')){

				}
			}
		}

	});
})(window)