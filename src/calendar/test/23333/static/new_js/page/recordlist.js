(function(win, $, Bazi){
    // 发布订阅
    var publisher = {
        subscribers: {
            any: [] // 对应事件类型的订阅者
        },
        subscribe: function(fn, type) {
            type = type || 'any';
            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(fn);
        },
        unsubscribe: function(fn, type) {
            this.visitSubscribers('unsubscribe', fn, type);
        },
        publish: function(publication, type) {
            this.visitSubscribers('publish', publication, type);
        },
        visitSubscribers: function(action, arg, type) {
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                i,
                max = subscribers.length;

            for (i = 0; i < max; i += 1) {
                if (action === 'publish') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
    };

    var makePublisher = function(o) {
        var i;
        for (i in publisher) {
            if (publisher.hasOwnProperty(i) && typeof publisher[i] === "function") {
                o[i] = publisher[i];
            }
        }
        o.subscribers = {
            any: []
        };
    };

    function has(obj1, obj2) {
        if (obj1 === document.body) return false;
        if (obj1 === obj2) {
            return true;
        } else {
            obj1 = obj1.parentNode;
            return has(obj1, obj2);
        }
    };
  
    var initRecordsEvent = function(){
        $('.select').mouseover(function(e){
            $(e.currentTarget).find('.select-list').show();
        }).mouseout(function(e) {
            $(e.currentTarget).find('.select-list').hide();
        });
        // 单条记录删除
        $('.record-delete').click(function(e){
            e.stopPropagation();
            var recordEl = $(e.currentTarget).parents('.record-list-item');
            var udid = recordEl.data('udid');
            Bazi.pop.show({
                prompt: '确定要删除这条记录吗？',
                title: '提示',
                btn: [{
                    label: '确定',
                    handle: function(cur,obj) {
                        var data = {
                            mod: 'iudatas',
                            act: 'delRelation',
                            udids: udid
                        };
                        $.ajax({
                            data: data,
                            type: 'POST',
                            url: '/recordlist',
                            success: function(data){
                                if( data.ret === 0){
                                    recordEl.fadeOut('500', function() {
                                        recordEl.remove();
                                    });
                                    
                                    obj.hide();
                                }
                                
                            }
                        });
                        return false;
                    }
                }, {
                    label: '取消',
                    handle: function() {}
                }]
            });
        });

        $('.record-list-item').click(function(e){
            var el = $(e.currentTarget);
            if(RecordsPage.isEditable){
                // 处于可编辑状态
                if( _.indexOf(RecordsPage.chosenUdids, el.data('udid') ) === -1){
                    RecordsPage.chosenUdids.push(el.data('udid'));
                    el.addClass('list-item-cur');
                }else{
                    el.removeClass('list-item-cur');
                   RecordsPage.chosenUdids =  _.without(RecordsPage.chosenUdids, el.data('udid'));
                }
            }else{
                var solarDateStr = el.find('[data-fill=solarDateStr]').html();
                var year = solarDateStr.match(/\d*年/)[0].slice(0,-1);
                var month = solarDateStr.match(/\d*月/)[0].slice(0,-1);
                var day = solarDateStr.match(/\d*日/)[0].slice(0,-1);
                var hour = solarDateStr.match(/\d*时/)[0].slice(0,-1);
                var min = solarDateStr.match(/\d*分/)[0].slice(0,-1);
              
                var data = {
                    sDate: Bazi.Common.formatDateData(year, month, day),
                    sTime: Bazi.Common.formatTimeData(hour, min, 0),
                    iGender: el.find('[data-fill=sex]').html() === '男'? 0: 1,
                    rName: el.find('[data-fill=name]').html(),
                    relClassify:el.find('[data-fill=relClassify]').html(),
                    relClassId: el.find('[data-fill=relClassify]').data('classid'),
                    mobile: el.data('mobile')=== undefined? ' ': el.data('mobile'),
                    udid:el.data('udid'),
                    From:'editRecord'
                };
                Bazi.pop.show({
                    src: '/pop/paipan',
                    width: 720,
                    title: '排盘',
                    data:data,
                    id:'pop_paipan'
                });
            }
        });

        $('.record-compare').click(function(e){
            e.stopPropagation();
            var recordEl = $(e.currentTarget).parents('.record-list-item');
            if( recordEl.data('becompareid') === undefined ){
                if( $('.different-left').length === 0 ){
                    var comparisonBox = _.template(Bazi.tpls.tpls_dif_left)({});
                    $('body').append(comparisonBox);
                }
                $('.different-left').show();
                var data = {
                    name: recordEl.find('[data-fill=name]').html(),
                    sex: recordEl.find('[data-fill=sex]').html(),
                    GanZhiYear: recordEl.find('[data-fill=GanZhiYear]').html(),
                    GanZhiMonth:  recordEl.find('[data-fill=GanZhiMonth]').html(),
                    GanZhiDay: recordEl.find('[data-fill=GanZhiDay]').html(),
                    GanZhiHour: recordEl.find('[data-fill=GanZhiHour]').html(),
                    solarDateStr: recordEl.find('[data-fill=solarDateStr]').html()
                };
                data.compareid = _.uniqueId('');
                recordEl.attr('data-becompareid', data.compareid);
                data.ondestroy = function(){
                    recordEl.css('border-color', '#D4D4D4').removeAttr('data-becompareid');
                };
                var comparisonItem = new ComparisonItem(data);
                ComparisonCollection.add(comparisonItem)
            }
        });
    };

    initRecordsEvent();
       

    $('.dropdown .dropdown-toggle').click(function(e){
        $(e.currentTarget).parent('.dropdown').toggleClass('open');
    });
    $('body').click(function(e){
        $('.dropdown').each(function(){
            if( $(this).hasClass('open') && !has(e.target, this) ){
                $(this).removeClass('open');
            }
        });
    });

    var listBox = $('#record-list-main');
    var nomoreTipEl = $('.record-list-wrapper> .nomore-tips');
    var relId = 0, mjId = 0; //关系id和命局id， 进来默认是全部关系和全部命局

    setScroll();
    function setScroll(){
        // 下拉刷新
        nomoreTipEl.hide();
        var iPage = 2;
        var hasMoreRecordsData = true;
        var isShowAllList = true;
        var itemHeight = listBox.find('.record-list-item').outerHeight();
        $(window).on('scroll', pullRefresh);
        pullRefresh();
        function pullRefresh(e) {
            if(!isShowAllList) return;
            if(!hasMoreRecordsData){
                $(window).off('scroll', pullRefresh);
            }else{
                var lastRecordItemElOffsetTop = listBox.find('.record-list-item:last-child').length === 0 ? 0 : listBox.find('.record-list-item:last-child').offset().top;
                var isBeyond = document.body.scrollTop + document.documentElement.clientHeight > lastRecordItemElOffsetTop + itemHeight;
                if (isBeyond) {
                    console.log('rel>>'+relId+',mjId>>'+ mjId+', page>>'+ iPage);

                    $.ajax({
                        type: "POST",
                        data: {
                            act: 'getRecords',
                            mod: 'iudatas',
                            rel: relId,
                            mj: mjId,
                            page: iPage
                        },
                        success: function(data){
                            listBox.append(data);
                            initRecordsEvent();
                            if( listBox.find('>li:last-child').data('nomore') === true){
                                hasMoreRecordsData = false;
                                nomoreTipEl.show();
                            }else{
                                iPage++;
                            }
                        }
                    });
                }
            } 
        };
    }
    
    var RecordsPage = {
        chosenUdids: [],
        isEditable: false,
        toggleEditStatus: function(){
            this.isEditable = !this.isEditable;
            this.publish(this.isEditable, 'editable');
        }
    };

    makePublisher(RecordsPage);

    var toggleEditableBtn = $('.record-list-hd .toggle-editable');

    var barnerBtns = {
        toggle: function(isEditable){
            if(isEditable){
                $('.record-list-hd .fn-right').children().css('display', 'inline-block');
                toggleEditableBtn.html('取消');
                
            }else{
                toggleEditableBtn.html('编辑').show().siblings().hide();
                $('.list-item-cur').removeClass('list-item-cur');
                RecordsPage.chosenUdids = [];
            }
        }
    };

    RecordsPage.subscribe(barnerBtns.toggle, 'editable');

    toggleEditableBtn.click(function(){
        RecordsPage.toggleEditStatus();
    });

    // 分类筛选
    var curRelClassEl = $('.filter-relclass-dropdown .dropdown-toggle .txt');
    var curProfClassEl = $('.filter-profclass-dropdown .dropdown-toggle .txt');

    $('.filter-relclass-dropdown .dropdown-menu').delegate('li', 'click', function(e){
        relId = $(e.currentTarget).data('id');
        var val = $(e.currentTarget).text();
        $.ajax({
            type:'POST',
            url:'/recordlist',
            data: {
                mod: 'iudatas',
                act: 'getRecords',
                rel: relId,
                mj: mjId
            },
            success: function(data){
                listBox.empty().html(data);
                $(e.currentTarget).parents('.dropdown').removeClass('open');
                curRelClassEl.data('id',relId).html(val);
                initRecordsEvent();
                setScroll();
            }
        });
        
    });

    $('.filter-profclass-dropdown .dropdown-menu').delegate('li', 'click', function(e){
        mjId = $(e.currentTarget).data('id');
        var val = $(e.currentTarget).text();
        $.ajax({
            type:'POST',
            url:'/recordlist',
            data: {
                mod: 'iudatas',
                act: 'getRecords',
                rel: relId,
                mj: mjId
            },
            success: function(data){
                listBox.empty().html(data);
                $(e.currentTarget).parents('.dropdown').removeClass('open');
                curProfClassEl.data('id', mjId).html(val);
                initRecordsEvent();
                setScroll();
            }
        });  
    });

    // 移动分类
    var moveClassifyObj = Bazi.Common.addClassify({
        oBox: $('.dropdown-box'),
        beforeOpenBtnClick: function() {
            if(RecordsPage.chosenUdids.length === 0){
                Bazi.pop.show({
                    prompt: '请选择要移动的记录',
                    timeout: 1000
                });
                return false;
            }
            return true;
        },
        onaddclassify: function(val, beforeEl) {
            var data = {
                act: 'add',
                rtype: 0,
                relname: val
            };
            $.ajax({
                url: '/recordlist',
                data: data,
                type: 'POST',
                success: function(data){
                    // 往移动关系中加数据
                    var moveEl = $('<li class="classify-item" data-type="move" data-id="'+ data.id+'"><a class="classify-item-link" href="javascript:;">'+data.name+'</a></li>');
                    // 筛选关系的
                    var filterEl = $('<li data-id="'+data.id+'"><a href="javascript:;">'+data.name+'</a></li>');

                    moveEl.insertBefore( $('.add-class-func') );
                    filterEl.insertBefore($('.relClassify-select-list .divider'))
                }
            })
        },
        onmoveclassify: function(id, name) {
            var udids = RecordsPage.chosenUdids.slice();
            
            var data = {
                mod: 'iudatas',
                act: 'moveRelation',
                udids: udids.join(','),
                rtype: 0,
                relation: id
            }

            $.ajax({
                url: '/recordlist',
                data: data,
                type: 'POST',
                success: function(data){
                    RecordsPage.chosenUdids.forEach(function(udid){
                        $('[data-udid='+udid+']').find('.rel-classify-txt').html(name);
                        RecordsPage.toggleEditStatus();
                    });
                }
            })
        }
    });

    // 批量删除
    $('.record-list-delete').click(function(){
        if( RecordsPage.chosenUdids.length === 0){
            Bazi.pop.show({
                prompt: '请选择要删除的记录',
                timeout: 1000
            });
            return;
        }

        var udids = RecordsPage.chosenUdids.join(',');
        Bazi.pop.show({
            prompt: '确定要删除这条记录吗？',
            title: '提示',
            btn: [{
                label: '确定',
                handle: function(cur, obj) {
                    var data = {
                        mod: 'iudatas',
                        act: 'delRelation',
                        udids: udids
                    };
                    $.ajax({
                        data: data,
                        type: 'POST',
                        url: '/recordlist',
                        success: function(data) {
                            if (data.ret === 0) {
                                RecordsPage.chosenUdids.forEach(function(udid){
                                    $('[data-udid='+ udid +']').remove();
                                });
                                RecordsPage.chosenUdids = [];
                                obj.hide();
                            }

                        }
                    });
                    return false;
                }
            }, {
                label: '取消',
                handle: function() {}
            }]
        });
    });
})(window, jQuery, Bazi);