(function(win, $, Global) {
	// 公用视图对象
	Global.Views = {
		SearchTableView: SearchTableView,
		pageHearView: pageHearView,
		LeftSideNav: LeftSideNav
	};

	function LeftSideNav(opts) {
		var str = "";
		var forTree = function(o, isFirst) {
			for (var i = 0; i < o.length; i++) {
				var urlstr = "";
				var _isFirst = isFirst === undefined;

				var url = o[i]["url"] ? o[i]["url"] : 'javascript:;';
				var icon = _isFirst ? '<span class="glyphicon glyphicon-folder-close"></span>&nbsp;&nbsp;' : '<span class="glyphicon glyphicon-file"></span>&nbsp;&nbsp;';
				var dropDwonIcon = '';
				var isOpenClass = '';
				if (o[i]["children"] && o[i]["children"].length > 0) {
					if (o[i].open) {
						dropDwonIcon = '<span class="toggle-icon glyphicon glyphicon-menu-up pull-right" style="margin-right:25px;"></span>';
						isOpenClass = 'open';
					} else {
						dropDwonIcon = '<span class="toggle-icon glyphicon glyphicon-menu-down pull-right" style="margin-right:25px;"></span>';
					}
				}
				var target=o[i]["target"]?o[i]["target"]:"_self";
				
				urlstr = "<li class='left-nav-item " + isOpenClass + "'><a class='left-nav-item-title' target="+target+" href=" + url + " data-id='"+ o[i].id+"'>" + icon + o[i]["title"] + dropDwonIcon + "</a><ul class='left-nav-submenu'>";

				str += urlstr;
				if (o[i]["children"] && o[i]["children"].length > 0) {
					forTree(o[i]["children"], false);
				}
				str += "</ul></li>";

			}
			return str;
		}
		this.boxEl = opts.boxEl;
		this.boxEl.html('<ul class="left-nav-menu">' + forTree(opts.renderData) + '</ul>');
		
		this.initEvent();
	}

	LeftSideNav.prototype.initEvent = function() {
		var me = this;
		this.boxEl.on('click', '.left-nav-item-title', function(e) {
			if( $(this).find('> .toggle-icon').length > 0){
				$(this).find('.toggle-icon').toggleClass('glyphicon-menu-down glyphicon-menu-up')
					.end().parent('.left-nav-item').toggleClass('open');
			}else{
				$(this).parent('li').siblings().find('.active').removeClass('active');
				$(this).parent('li').addClass('active')
			}

			var hash = $(e.currentTarget).attr('href');
			if (hash.slice(0, 1) === '#') {
				var i = location.pathname.lastIndexOf('/');
				var name = location.pathname.slice(i+1);
				if (name === 'index.html') {
					location.href = hash + '/' + (new Date()).getTime();
					e.preventDefault();
				}else{
					location.href = 'index.html'+hash + '/' + (new Date()).getTime();
				}
				
			}


		})
	}

	function SearchTableView(opts) {
		var me = this;

		// 默认配置
		opts = opts? opts : {};
		var settings = {
			isShortPageKey: true,
			ps: 15,
			pn: 1,
			hasSearchCtrl: true,
			hasOrder: false,
			hasAddBtn: true,
			searchReq:{
				sameWithGetList: true
			}
		};
		this.options = $.extend(true,settings, opts);

		this.$el = $('<div class="search-table-form"></div>');
		// 数据初始化
		this.initData();
		// 函数初始化
		this.initFn();
		// 搜索请求的封装
		// this.getSearchFn();
		this.pagenum = 1;
		this.render();
		this.triggerPageEvent(1, function(data) {
			me.renderNav.call(me, data);
			me.initEvent.call(me);
		})
	};
	SearchTableView.prototype = {
		initData: function(){
			var me = this;
			var opts = this.options;
			// 表头、ajax的属性值、静态属性值
			// ajax属性值和 静态属性值不能重名
			this.titleList = [];
			this.fetchKeys = [];
			this.staticKeys = [];
			this.keyList = [];

			if (opts.hasOrder) {
				this.titleList.push('序号');
			}
			for (var i = 0; i < opts.dataList.length; i++) {

				this.titleList.push(opts.dataList[i].key);
				this.keyList.push({
					form: opts.dataList[i].form,
					V: opts.dataList[i].value
				})
				if (opts.dataList[i].form === 'ajax') {
					this.fetchKeys.push(opts.dataList[i].value);
				}
				if (opts.dataList[i].form === 'static') {
					this.staticKeys.push(opts.dataList[i].value);
				}
			};

			this.searchData = {};

			// 如果搜索和获取列表url一样
			if( this.options.searchReq.sameWithGetList ){

				if( me.options.isShortPageKey){
					this.searchData = {
						url: me.options.getListReq.url,
						type: me.options.getListReq.type,
						data: {
							keyword: me.keyword,
							ps: me.options.ps
						}
					};
				}else{
					this.searchData = {
						url: me.options.getListReq.url,
						type: me.options.getListReq.type,
						data: {
							keyword: me.keyword,
							pagesize: me.options.ps
						}
					};
				}
					
			}else{
			// 如果搜索和获取列表url不一样
				if( me.options.isShortPageKey){
					this.searchData = {
						type: me.options.searchReq.ajaxData.type,
						url: me.options.searchReq.ajaxData.url,
						data: {
							key: me.keyword,
							ps: me.options.ps
						}
					};
				}else{
					this.searchData = {
						type: me.options.searchReq.ajaxData.type,
						url: me.options.searchReq.ajaxData.url,
						data: {
							key: me.keyword,
							pagesize: me.options.ps
						}
					};
				}
					
			}
		},
		initFn: function(){
			var me = this;
			var searchData = me.searchData;
			me.searchFn = function(pn,cb){
				if( this.options.searchReq.sameWithGetList ){
					searchData.data.keyword = me.keyword;
				}else{
					searchData.data.key = me.keyword;
				}

				if( me.options.isShortPageKey){
					searchData.data.pn = pn;
				}else{
					searchData.data.pagenum = pn;
				}
				searchData.success = function(data){
					cb(data);
				};

				$.ajax(searchData);
			};

			this.updateStaticOrder = function(i){
				if( !me.options.hasOrder)return;
				this.$el.find('[data-staticorder]').each(function(index,item){
					var item = $(item);
					var order = parseInt( item.data('staticorder'));
					if(  order > parseInt(i) ){
						item.attr('data-staticorder', order--).html(order--);
					}
				});
			}
		},
		render: function() {
			var me = this;
			var html = _.template(Global.tpls.search_table)({
				data: {
					hasSearchCtrl: me.options.hasSearchCtrl,
					hasAddBtn: me.options.hasAddBtn,
					list:this.titleList,
					colspan: this.titleList.length
				}
			});
			this.$el.html(html).hide().appendTo(this.options.boxEl);
			this.$el.fadeIn();
			this.$tbodyEl = this.options.boxEl.find('tbody');
			
			if( 'afterStaticRender' in this.options){
				this.options.afterStaticRender(this.$el, this);
			}
		},
		bindSearchNavEvent: function(){
			var me = this;
			this.$el.find('nav').on('click', 'li', function(e) {

				var numStr = e.currentTarget.innerText;
				var num = parseInt(numStr);
				var waitingEl = $('<span class="tip-icon" style="position: absolute; left:0; top:0; opacity: 0.4; "></span>');
				waitingEl.appendTo($(this));
				me.searchFn(num, function(data){
					waitingEl.remove();
					$(e.currentTarget).siblings('.active').removeClass('active')
					.end().addClass('active');

					me.reRenderTbody.call(me, data.data);
				});
				
			});
		},
		initEvent: function() {

			var me = this;
			this.$el.find('nav').on('click', 'li', function(e) {

				var numStr = e.currentTarget.innerText;
				var num = parseInt(numStr);
				var waitingEl = $('<span class="tip-icon" style="position: absolute; left:0; top:0; opacity: 0.4; "></span>');
				waitingEl.appendTo($(this));
				me.triggerPageEvent(num, function(){
					waitingEl.remove();
					$(e.currentTarget).siblings('.active').removeClass('active')
						.end().addClass('active');
				});
			});
			if( this.options.hasSearchCtrl){
				this.$el.find('.search-btn').click(function(e) {
					var val = $(e.currentTarget).siblings('input[type=search]').val();
					me.keyword = _.escape(val);
					
					me.searchFn(1,function(data){
						if( data.err === 0){
							me.reRenderTbody.call(me, data.data);
							
							me.$el.find('nav').remove();
							if(data.totalPage > 1){
								me.renderNav({
									curNum: data.pageNum,
									len: data.totalPage
								});

								me.bindSearchNavEvent.call(me);
							}
						}					
					});
				});
			}

			this.$tbodyEl.on('click', '.edit-item-link', function(e) {
				var id = $(e.currentTarget).parents('.search-table-item').data('id');
				if (id === undefined) throw Error('找id出错了');
				location.href = me.options.editUrl + '?id=' + id;
			});
			this.$tbodyEl.on('click', '.viewlog-item-btn', function(e) {
				var id = $(e.currentTarget).parents('.search-table-item').data('id');
				if (id === undefined) throw Error('找id出错了');
				var url=me.options.viewlogReq.url + '?id=DATA_EXCHANGE_PUSHLOG&name=DATA_EXCHANGE_PUSHLOG&title=%E6%95%B0%E6%8D%AE%E6%8E%A5%E5%8F%A3%E6%8E%A8%E9%80%81%E6%97%A5%E5%BF%97&params={%22ID%22:%22'+id+'%22}';
				window.open(url);
			});
			this.$tbodyEl.on('click', '.del-item-btn', function(e) {
				var id = $(e.currentTarget).parents('.search-table-item').data('id');
				if (id === undefined) throw Error('找id出错了');
				Global.Dialog.tipModal({
					tip_txt: '确定删除这条记录吗？',
					icon_info: 'warning',
					footer: {
					    show: true,
					    btns: [{
					        type: 'submit',
					        txt: "确定",
					        sty: 'primary',
					        callback: function(fnClose) {
					        	$.ajax({
					        		type: me.options.delReq.type,
					        		url: me.options.delReq.url + '/' + id,
					        		data: {
					        			operator: Global.fn.checkLogin()
					        		},
					        		success: function(data) {
					        			if (data.err === 0) {
					        				$(e.currentTarget).parents('.search-table-item').remove();
					        				fnClose();
					        			} else {
					        				alert('请求出错');
					        			}
					        		}
					        	});
					        }
					    }, {
					        type: 'button',
					        txt: "取消",
					        sty: 'default',
					        callback: function(fnClose) {
					            fnClose();
					        }
					    }]
					}

				});
				
			});

			if(this.options.addCustomEvent){
				this.options.addCustomEvent(this);
			}

		},
		fetchPerPageData: function(pageNum, success) {
			var me = this;
			if( this.options.isShortPageKey){
				var sendData = {
					ps: me.options.getListReq.pageSize,
					pn: pageNum
				};
			}else{
				var sendData = {
					pagesize: me.options.getListReq.pageSize,
					pagenum: pageNum
				};
			}
			
			if( 'data' in this.options.getListReq){
				var recData = this.options.getListReq.data;

				if( Object.prototype.toString.call(recData).slice(8,-1) === 'String'){
					sendData[recData] = this[recData];
				}
			}
			
			$.ajax({
				url: me.options.getListReq.url,
				type: 'GET',
				data: sendData,
				success: function(data) {
					if (data.err === 0) {
						success.call(me, data);
					}

				}
			})
		},
		reRenderTbody: function(data, startIndex) {
			var me = this;
			startIndex = startIndex===undefined?1:startIndex;

			if(  me.options.getListReq.parse){
				data =  me.options.getListReq.parse(data);
			}
			
			var renderData = [];
			if( data.length === 0){
				var html = '<tr><td colspan="'+ this.titleList.length+'" style="font-weight: 600; font-size: 16px; color: #ff4400;; padding: 18px;">没有相关数据</td></tr>'
				this.$tbodyEl.empty().html(html);
				return;
			}
			_.each(data, function(item, i) {
				
				var renderItem = {
					id: item.id,
					content: []
				};
				if (me.options.hasOrder) {
					renderItem.content.push('<span data-staticorder="'+(startIndex + i)+'">'+(startIndex + i)+'</span>');
				}
				for (var j = 0; j < me.fetchKeys.length; j++) {
					renderItem.content.push(item[(me.fetchKeys[j])]);
				}

				for (var j = 0; j < me.staticKeys.length; j++) {
					renderItem.content.push(me.staticKeys[j]);
				}

				renderData.push(renderItem);
			});

			var html = _.template(Global.tpls.search_table_item)({
				data: renderData
			});
			this.$tbodyEl.empty().html(html);
		},
		triggerPageEvent: function(pageNum, cb) {
			var me = this;
			this.fetchPerPageData(pageNum, function(data) {
				if( ('pageSize' in data) && ('totalPage' in data) ){
					var startIndex = data.pageSize * (pageNum - 1) + 1;
					var totalPage = data.totalPage;
				}else if( ('pageSize' in data.data) && ('pageCount' in data.data) ){
					var startIndex = data.data.pageSize * (pageNum - 1) + 1;
					var totalPage = data.data.pageCount;
				}
				me.reRenderTbody.call(me, data.data, startIndex);
				cb && cb({
					curNum: pageNum,
					len: totalPage
				});
			})

		},
		renderNav: function(data) {
			var html = _.template(Global.tpls.search_table_item_nav)({
				data: data
			});
			this.$el.find('form').append(html);
		}
	};

	function pageHearView(opts) {
		this.options = opts;
		this.$el = opts.boxEl;
		this.template = _.template(Global.tpls.page_header);
		this.render();
		this.initEvent();
	}

	pageHearView.prototype = {
		render: function() {
			var User = this.options.renderData;
			var html = this.template({
				User: User
			});
			this.$el.html(html);
		},
		initEvent: function() {
			this.$el.find('.logout-btn').click(function() {
				Global.fn.logout();
			});
		}
	};
})(window, $, Global);