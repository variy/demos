(function() {

    window.Bazi = window.Bazi || {};

    // 模板快捷方式，（顺便兼容新版 undescore模板）
    $.tmpl = function(html, data) {
        if (data) {
            return _.template(html)(data);
        } else {
            return _.template(html);
        }
    };

    // 添加一些验证方法
    $.validator.addMethod("mobile", function(value) {
        var regMobile = /^0?(13[0-9]|15[0-9]|18[0-9]|14[57])[0-9]{8}$/;
        return regMobile.test(value);
    }, '手机号码格式不正确');
    $.validator.setDefaults({
        errorPlacement: function(error, element) {
            if (element[0]['type'] == 'checkbox' || element[0]['type'] == 'radio') {
                // error.appendTo($(element).parent().siblings('.error-tip'));
            } else {
                error.addClass('error-tips').insertBefore($(element));
            }
        },
        success: function(label, element) {
            $(label).remove();
        }


    });


//header部分
(function(){
    //导航状态
    (function(){
        var navs = [/\/friends$/i,/\/recordlist$/i];
        var pathname = location.pathname;
        if(location.pathname === '/'){
            $('.header .nav-wrap ul li').eq(0).addClass('on');
        }else{
            navs.forEach(function(elm,key){
                if(elm.test(pathname)){
                    $('.header .nav-wrap ul li').eq(key+1).addClass('on');
                }
            });
        }
    }());



    //输出登录状态
    ;(function(){
        var bind = '.k'+ Math.random().toString().slice(2).toString();


        $.ajax({
            url:'/ajax/loginstate',
            type:'POST',
            success:function(data){
                $('#login-state').html(data);
                var request_select = $('#TopFriendsRequest .request-select');
                var friends_request_btn = $('#friends_request_btn');
                friends_request_btn.click(function(){

                    if(request_select.is(':visible')){
                        request_select.fadeOut(100);
                        $(document).off('mousedown'+bind);
                        return;
                    }

                    $.ajax({
                        type:'POST',
                        url:'/ajax/friends',
                        data:{
                            act:'reqlist'
                        },
                        success:function(data){
                            request_select.html(data).fadeIn(100,function(){
                                $(document).off('mousedown'+bind).on('mousedown'+bind,function(event){
                                    if($(event.target).closest(request_select)[0] || event.target === request_select[0] ||
                                        $(event.target).closest(friends_request_btn)[0] || event.target === friends_request_btn[0]
                                    ){
                                        return;
                                    }
                                    request_select.fadeOut(100);
                                    $(document).off('mousedown'+bind);
                                });
                            });
                            //同意加好友请求
                            request_select.find('.conf-request-btn').click(function(){
                                var _this = this;
                                $.ajax({
                                    type:'POST',
                                    url:'/ajax/friends',
                                    data:{
                                        act:'acc',
                                        fuid:$(this).closest('li').data('fuid')
                                    },
                                    success:function(data){
                                        switch(data.ret){
                                            case 0://添加成功
                                                $(_this).parent().html('添加成功');
                                                break;
                                            case 107://已经是好友
                                                $(_this).parent().html('已经是好友');
                                                break;
                                            case 101://已经是好友
                                                $(_this).parent().html('参数有误');
                                                break;
                                        }
                                    }
                                });
                            });

                            //拒绝加好友请求
                            request_select.find('.del-request-btn').click(function() {
                                var _this = this;
                                $.ajax({
                                    type: 'POST',
                                    url: '/ajax/friends',
                                    data: {
                                        act: 'rej',
                                        fuid: $(this).closest('li').data('fuid')
                                    },
                                    success: function (data) {
                                        switch (data.ret) {
                                            case 0://拒绝成功
                                                $(_this).unbind().closest('li').fadeOut(300,function(){
                                                    var ul = $(this).parent();
                                                    $(this).remove();
                                                    if(ul.find('li').length === 0){
                                                        ul.append('<li class="clearfix s-request-item"><div class="no-result">当前没有新的好友请求</div></li>');}
                                                });
                                                break;
                                            case 101://参数错误
                                                $(_this).parent().html('参数有误');
                                                break;
                                        }
                                    }
                                });
                            });



                        }
                    });
                });
            }
        });
    }());




    //搜索框
    ;(function(){
        var search_wrap = $('#search-wrap');
        var searchInput = $('#search-input');
        var search_select;
        var search_ul;
        var search_btn = $('#search-btn');
        var bind = '.k'+ Math.random().toString().slice(2).toString();
        if(searchInput[0]){
            if(searchInput[0].oninput === null){
                searchInput[0].oninput = search;
            }else{
                searchInput[0].onkeyup = search;
            }
        }

        var searchBind = '.k'+ Math.random().toString().slice(2).toString();
        searchInput.on('focus',function(event){
            search.call(this);
            $(document).off('keydown'+searchBind).on('keydown'+searchBind,function(event){
                if(event.keyCode === 13){
                    var searchKey = searchInput.val();
                    //去掉两端空格
                    searchKey = $.trim(searchKey);
                    if(searchKey === ''){
                        return;
                    }
                    search_btn.trigger('click');
                    $(document).off('keydown'+searchBind);
                }
            });
        }).on('blur',function(){
            $(document).off('keydown'+searchBind);
        });



        search_btn.click(function(){
            var searchKey = searchInput.val();
            //去掉两端空格
            searchKey = $.trim(searchKey);
            if(searchKey === ''){
                Bazi.pop.show({
                    prompt:'请输入要搜索的关键词',
                    btn:[
                        {
                            label:'确定'
                        }
                    ],
                    timeout:600,
                    title:'提示',
                    after_hide:function(){
                        searchInput.trigger('focus');
                    }
                });
                return;
            }
            location.href = '/s/'+encodeURIComponent(searchKey);
        });





        function search(){
            search_select = search_select || $('.search_select');
            search_ul = search_ul || $('.search_select .dropdown-list');
            var searchKey = $(this).val();

            //去掉两端空格
            searchKey = $.trim(searchKey);

            if(searchKey === ''){
                search_select.hide();
                return;
            }
            $.ajax({
                url:'/ajax/friends',
                type:'POST',
                data:{
                    act:'search',
                    key: searchKey
                },
                success:function(data){
                    if(typeof data === 'object' && data.isLogin === false){
                        Bazi.pop.show({
                            src:'/pop/login',
                            title:'登　录',
                            width:650,
                            load:function(cur){
                                cur.$('#login-username').trigger('focus');
                            },
                            id:'login'
                        });
                        searchInput.trigger('blur');
                        return;
                    }
                    search_select.show();
                    $(document).off('mousedown'+bind).on('mousedown'+bind,function(event){
                       if($(event.target).closest(search_select)[0] || event.target === search_select[0] ||
                        $(event.target).closest(search_wrap)[0] || event.target === search_wrap[0]
                       ){
                           return;
                       }
                        search_select.hide();
                        $(document).off('mousedown'+bind)
                    });

                    search_ul.html(data);

                    var add_ing = false;
                    search_ul.find('.add-f-btn').click(function(){
                        if(add_ing === true){
                            return;
                        }
                        if(!$(this).data('tuid')){
                            return;
                        }
                        add_ing = true;
                        var _this = this;
                        $.ajax({
                            type:'POST',
                            url:'/ajax/friends',
                            data:{
                                act:'req',
                                tuid:$(this).data('tuid')
                            },
                            success:function(data){
                                add_ing = false;
                                if(data.ret === 0){
                                    $(_this).html('已发送').removeAttr('data-tuid').removeData('tuid');
                                }
                            }
                        });
                    });
                }
            });
        }

    }());




}());



    Bazi.Common = {
        formatNum: function(num) {
            var html = '';
            if (num < 10) {
                html = '0' + num;
            } else {
                html += num;
            }
            return html;
        },

        formatDateData: function(year,month,day){
            return year + '-' + this.formatNum(month) + '-' + this.formatNum(day);
        },
        formatTimeData: function(hour,min,second){
            return this.formatNum(hour) + ':' + this.formatNum(min) + ':' + this.formatNum(second);
        },
        setLuck: function(aStartLuck){
            var html = '';
            html += "出生后 " + aStartLuck.y + " 年 " + aStartLuck.m + " 个月 " + aStartLuck.d + " 天 起运";
            return html;
        },
        getMingjuVal: function(id){
            for (var i = 0,len = Bazi.lang.mingju.length; i < len; i++) {
                if( Bazi.lang.mingju[i][0] === parseInt(id) ){
                    return Bazi.lang.mingju[i][1];
                }
            };
            throw new Error('没有这个id的命局！')
            
        },


        // 记录页移动分类
        addClassify: function(opts) {
            var settings = {
                recordsData: [],
                beforeOpenBtnClick: function() {
                    return true;
                },
                onaddclassify: function() {

                },
                onmoveclassify: function(cid) {

                },
                validateNew: function(val) {
                    addForm.validate({
                        rules: {
                            add_classify: {
                                required: true,
                                minlength: 2,
                                maxlength: 10
                            }
                        },
                        messages: {
                            add_classify: {
                                required: '请输入新分类名称',
                                minlength: '分类名称长度不能少于2位'
                            }
                        }
                    });
                }
            };

            $.extend(settings, opts);

            var oBox = settings.oBox;

            var dropdownEl = oBox.find('._dropdown');
            var oList = oBox.find('.dropdown-menu');
            var dropdownBtn = oBox.find('.dropdown-toggle');

            var addBtn = oBox.find('[data-type=add]');
            var addForm = oBox.find('form');
            var addInput = addBtn.find('input');
            var addTips = addBtn.find('p');

            dropdownBtn.click(function() {
                if (settings.beforeOpenBtnClick()) {
                    // dropdownEl.addClass('open');
                    oList.show();
                }
            });

            oList.delegate('li', 'click', function(event) {
                if ($(this).data('type') === 'add') {
                    $(this).find('p').hide().siblings().show();
                } else {
                    addInput.val('').parent('form').hide().siblings('p').html('+ 新的分类').show();
                    if ($(this).attr('showbtn') === undefined || $(this).attr('showbtn') === '0') {
                        oList.find('button').remove();
                        oList.find('[showbtn=1]').attr('showbtn', '0');
                        $(this).attr('showbtn', '1');

                        var confirmBtn = $('<button class="btn-xs btn btn-primary fn-right">确认</button>');
                        var txt = $(this).find('a').text();
                        var cid = $(this).data('id');
                        $(this).find('a').append(confirmBtn);

                        confirmBtn.click(function(e) {
                            oList.find('button').remove();
                            oList.hide();
                            settings.onmoveclassify(cid, txt);
                            e.stopPropagation();
                        });
                    }

                }

            });
            settings.validateNew();
            addInput.keydown(function(e) {
                if (e.keyCode === 13) {

                    addForm.valid();
                    if (addForm.validate().form()) {
                        settings.onaddclassify(addInput.val(), addBtn);
                        addInput.val('').parent('form').hide().siblings('p').html('+ 新的分类').show();
                    }

                }
            });

            $('body').click(function(e) {

                if (oList.is(":visible")) {

                    function has(obj1, obj2) {
                        if (obj1 === document.body) return false;
                        if (obj1 === obj2) {
                            return true;
                        } else {
                            obj1 = obj1.parentNode;
                            return has(obj1, obj2);
                        }
                    };
                    if (!has(e.target, oBox[0])) {
                        // dropdownEl.removeClass('open');
                        oList.hide();
                        addTips.show().siblings().hide();
                    }
                }

            });

            return {
                listEl: oList
            }
        }
    }




    //下拉刷新
    function Pull(o){
        this.flag = false;
        this.init(o);
    }
    Pull.prototype.init = function(o){

        o = $.extend({}, o);

        var _this = this;

        if (o.handle !== undefined) {
            _this.handle = o.handle;
        }

        if (!o.scrollElm || !o.contentElm) {
            var scrollElm = $(window),
                contentElm = $(document);
        } else {
            var scrollElm = $(o.scrollElm),
                contentElm = $(o.contentElm);
        }
        var bind_key = 'scroll.'+new Date()+Math.random.toString().slice(2);
        _this.loading = $('<div class="nomore-tips"><p></p></div>')[0];

        function appendLoadingTit(){//插入状态
            if (!o.selector) {
                $('body').append(_this.loading);
            } else {
                if (!o.method) {
                    $(o.selector).last().append(_this.loading);
                } else {
                    switch (o.method) {
                        case 'after':
                            $(o.selector).last().after(_this.loading);
                            break;
                        case 'before':
                            $(o.selector).last().before(_this.loading);
                            break;
                        case 'prepend':
                            $(o.selector).last().prepend(_this.loading);
                            break;
                        case 'append':
                            $(o.selector).last().append(_this.loading);
                            break;
                    }
                }
            }
        }


        scrollElm.on(bind_key,function(){
            if(_this.flag === true){
                return;
            }
            var condition = (scrollElm.scrollTop() >= contentElm.height() - scrollElm.height() - 5) && contentElm.height() - scrollElm.height() >= 5;

            if (condition) {
                _this.flag = true;
                var t = '加载中',
                    n = 1;
                appendLoadingTit();
                (function() {
                    clearTimeout(_this.timeout);
                    $(_this.loading).find('p').text(t + '...'.slice(0, n));
                    n = n === 3 ? 0 : n + 1;
                    _this.timeout = setTimeout(arguments.callee, 200);
                }());

                if (typeof _this.handle === 'function') {
                    _this.handle.call(_this);
                }
            }

        });

        if(o.trigger === true){//第一次自动初始化
            (function(){

                if(_this.flag === true){
                    return;
                }

                appendLoadingTit();
                _this.flag = true;
                var t = '加载中',
                    n = 1;
                (function() {
                    clearTimeout(_this.timeout);
                    $(_this.loading).find('p').text(t + '...'.slice(0, n));
                    n = n === 3 ? 0 : n + 1;
                    _this.timeout = setTimeout(arguments.callee, 200);
                }());
                _this.handle.call(_this);
            }());
        }


        this.destory = function(option){
            option = option || {};
            clearTimeout(this.timeout);
            if($(document).find(this.loading).length === 0){
                appendLoadingTit();
            }
            if(option.label){
                $(this.loading).html(option.label);
            }
            if(option.remove){
                $(this.loading).remove();
            }
            scrollElm.off(bind_key);
            return this;
        }
    };

    Pull.prototype.done = function(){
        if (this.loading !== undefined) {
            $(this.loading).remove();
        }
        clearTimeout(this.timeout);
        this.flag = false;
        return this;
    };


    //下拉刷新
    Bazi.Pull = Pull;




})();