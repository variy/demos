~(function(){
    window.Bazi = window.Bazi || {};

    var pop = {};

    pop.zIndex = 1000;

    //实例储存，不对外暴露
    var live = [];

    //出发
    pop.show = function(o){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.show(o);
        }

        var pop = this;

        o = o || {};

        var defaults = {
            title : '',//标题
            timeout : false,//自动关闭时间
            width : 400,//默认宽度
            before_hide : null,//关前回调
            after_hide : null,//关后回调
            ESC:true,//是否可ESC关闭
            animation:true,//打开和关闭是否启用动画
            black:1//背景颜色 0 ~ 1
        };
        o = $.extend(defaults,o);

        if(typeof o.width === "string") {//宽度设置百分比
            if(o.width === ""){
                o.width = "0";
            }
            if(o.width === 'auto' && !o.src && o.html ){
                //auto只对html生效
            }else if(o.width.indexOf("%") !== -1){//有百分号
                o.width = $(window).width() * (parseInt(o.width.split("%")[0]) / 100);
            }else{//没有百分号按数字设置
                o.width = parseInt(o.width);
            }
        }

        if (!o.id) {//若不设置name标示，系统分配一个随即字符串
            o.id = 'p_'+new Date().getTime()+Math.random().toString().slice(2);
        }

        //检测是否存在同样id
        var error_tit = '';
        var hasId = !live.every(function(elm){
            if(elm.id === o.id){
                return false;
            }else{
                error_tit = '页面已存在相同的pop id。';
                return true;
            }
        });

        if(hasId !== true){
            if(document.getElementById(o.id) !== null){
                hasId = true;
                error_tit = '页面已存在id为：'+ o.id+'的HTML元素。';
            }else if(o.id in window){
                hasId = true;
                error_tit = '页面已存在全局变量：'+ o.id+'。';
            }
        }

        //如果存在则退出
        if(hasId === true){
            if (window.console) console.error(error_tit);
            else alert(error_tit);
            return false;
        }

        var pop_box = $('<div class="g-pop"></div>');


        var pop_title,pop_close;
        /*创建title*/
        if(o.title){
            mk_title();
        }





        /*创建pop-body*/
        var pop_body = $('<div class="g-pop-body"></div>');
        var pop_loading = $('<img class="g-pop-loading" src="/static/images/loading.gif" />');


        var cur = null;

        var prompt_mode = o.prompt && !o.src && !o.html;//字符串输出
        if(prompt_mode){//字符串输出不接受宽度设定
            o.width = 370;
            o.html = '<div class="g-pop-promt">'+ o.prompt +'</div>';//已html模式执行
        }


        var pop_body_defaultH = 210;
        if(o.src){
            pop_body.append(pop_loading);//只在iframe显示loading
            pop_body.css({minHeight:pop_body_defaultH});//设定在iframe没有载入时的高度
            /*创建iframe start（如果设置了o.src）*/
            var iframe = document.createElement("iframe");
            iframe.frameBorder = 0;
            iframe.name = o.id;
            iframe.id = o.id;//兼容IE7、IE6
            iframe.width = '100%';
            $(iframe).css({visibility:'hidden'});
            ;(function(){//src地址添加时间戳以清除缓存，并以get方式传递data
                var hashSplit = o.src.split("#"),//首先提出hash
                    timeStamp = "timeStamp=" + (new Date()).getTime();

                var href = hashSplit[0],//非hash部分
                    hash = '';//hash
                if(hashSplit.length>1){
                    hash = (function(){//假设有多个#
                        var hashs = [];
                        for(var i= 1,len=hashSplit.length;i<len;i++){
                            hashs.push(hashSplit[i]);
                        }
                        return '#'+hashs.join('#');
                    }());
                }

                href = href.split('?');//分割?

                var query = (function(){//查询参数组，弹窗要插入的query
                    var q = [];
                    if(o.data){
                        for(var i in o.data){
                            if(!o.data.hasOwnProperty(i)){
                                continue;
                            }
                            q.push(i+'='+ o.data[i]);
                        }
                    }
                    q.push(timeStamp);
                    return q;
                }());


                //插入query
                if (href.length == 1) {//如果原链接没有get请求
                    o.src = href[0] + "?" + query.join('&') + hash;
                }else {//有 ?
                    var oldQuery = href[href.length - 1].split("&");//get参数以&分割
                    query = oldQuery.concat(query);//合并要插入的query
                    href[href.length - 1] = query.join("&");//生成新的插入后的query字符串
                    o.src = href.join("?") + hash;//组合
                }
            }());

            iframe.src = o.src;
            pop_body.append(iframe);
            /*创建iframe end*/
        }else if(o.html){
            pop_body.append(o.html);
        }

        /*创建pop-btn-box*/
        var pop_btn_box = null;
        if(o.btn && o.btn.length>=1){
            pop_btn_box = $('<div class="g-pop-btn-box"></div>');
            o.btn.forEach(function(obj){
                var btn = $('<a href="javascript:;" class="g-pop-btn"></a>');
                obj.label = obj.label || '';
                btn.text(obj.label.toString());
                btn.on('click.pop_'+ o.id,function(event){
                    var ret;
                    if(typeof obj.handle === 'function'){
                        ret = obj.handle(cur,rt,event);
                    }
                    //绑定关闭
                    if(ret !== false){
                        pop_hide();
                    }
                });
                pop_btn_box.append(btn);
            });

            if(o.src){
                pop_btn_box.css({visibility:'hidden'});//与iframe动画统一
            }
            if(prompt_mode){//prompt模式默认有上下padding
                pop_btn_box.css({paddingTop:0});
            }

            pop_body.append(pop_btn_box);
        }


        pop_box.append(pop_body);


        //动画出场效果
        pop_box.css({
            opacity: 0,
            zIndex: pop.zIndex
        });

        if(o.animation){
            pop_box.css({
                transform: "scale(0.6)",
                webkitTransform: "scale(0.6)",
                mozTransform: "scale(0.6)",
                oTransform: "scale(0.6)",
                msTransform: "scale(0.6)"
            }).css({
                transition: "transform 0.2s",
                webkitTransition: "-webkit-transform 0.2s",
                mozTransition: "-moz-transform 0.2s",
                oTransition: "-o-transform 0.2s",
                msTransition: "-ms-transform 0.2s"
            });
        }


        /*创建bg start*/
        var bg = $('<div style="position:fixed;width:100%;height:100%;top:0;left:0;background:#000;"></div>'),
            isIE6 = !-[1,] && !window.XMLHttpRequest;

        bg.css({
            opacity: 0,
            zIndex: pop.zIndex
        });
        if (isIE6){
            bg.css({
                position: "absolute",
                height: $(document).outerHeight(),
                width: $(document).outerWidth()
            });
        }
        /*创建bg end*/



        $("body").append(bg);
        $("body").append(pop_box);

        var after_see_ed = false;//pop未进行出场动画

        if(o.src){
            //处理load回调
            var iframe_loaded = false;//修复IE关闭后重复触发load事件bug，因为关闭时（iframe.src = ""）

            if (iframe.attachEvent) {//IE
                iframe.attachEvent("onload", function () {
                    iframe_loaded = true;
                    try{//可能有同源限制
                        after_see();
                    }catch(err){
                        $(iframe).css({visibility:'visible'});
                        pop_loading.remove();
                    }
                });
            }else {//非IE
                iframe.onload = function () {
                    iframe_loaded = true;
                    try{//可能有同源限制
                        after_see();
                    }catch(err){
                        $(iframe).css({visibility:'visible'});
                        pop_loading.remove();
                    }
                };
            }
        }else{
            var iframe_loaded = true;//没有iframe，iframe_loaded默认true
        }


        //设置cur
        if (o.src) {
            cur = window.frames[o.id];
        }else{
            cur = pop_body[0];
        }


        //返回对象
        var rt = {
            id: o.id,
            frame : cur,
            hide: pop_hide,
            resize:resize,
            before_hide: o.before_hide,
            after_hide: o.after_hide,
            prev:function(){
                var index = live.indexOf(rt);
                if(live[index-1]){
                    return live[index-1];
                }else{
                    return false;
                }
            },
            next:function(){
                var index = live.indexOf(rt);
                if(live[index+1]){
                    return live[index+1];
                }else{
                    return false;
                }
            },
            setTitle:function(title){
                title = title || '';

                if(o.title){
                    if(title){
                        pop_title.find('em').text(title.toString());
                        o.title = title;
                    }else{
                        o.title = title;
                        pop_title.remove();
                        pop_title = undefined;
                        size();
                    }
                }else if(title){
                    o.title = title;
                    mk_title();
                    size();
                }
                return rt;
            },
            offset:function(){
                return pop_body.offset();
            }
        };

        //在动画开始前的操作，只能在非iframe时用
        if(typeof o.before === 'function' && !o.src){
            o.before(cur,rt);
        }

        //设置宽高
        size();


        //动画进入
        $(bg).animate({opacity: 0.4* o.black}, o.animation?100:0, function () {
            pop_box.animate({opacity: 1}, o.animation?200:0, function () {
                if (o.timeout !== false){
                    setTimeout(function () {
                        return pop_hide();
                    }, parseInt(o.timeout,10));
                }
                after_see_ed = true;
                after_see();
            }).css({
                transform: "scale(1)",
                webkitTransform: "scale(1)",
                mozTransform: "scale(1)",
                oTransform: "scale(1)",
                msTransform: "scale(1)"
            });
        });

        live.push(rt);

        return rt;

        //创建标题
        function mk_title(){
            pop_title = $('<div class="g-pop-tit"><em></em></div>');
            pop_close = $('<div class="g-pop-close"><span></span></div>');
            pop_close.click(function(){
                return pop_hide();
            });
            pop_title.find('em').text(o.title.toString());
            pop_title.append(pop_close);
            pop_box.prepend(pop_title);

            //没有设置不成功的状态，返回rt以便链式调用
            return rt;
        }


        //重设宽高
        function resize(option){
            option = option || {};
            o.width = option.width == undefined ? o.width : option.width;//改变o.width

            if(typeof o.width === "string") {//宽度设置百分比
                if(o.width === ""){
                    o.width = "0";
                }
                if(o.width === 'auto' && !o.src && o.html ){
                    //auto只对html生效
                }else if(o.width.indexOf("%") !== -1){//有百分号
                    o.width = $(window).width() * (parseInt(o.width.split("%")[0]) / 100);
                }
                else{//没有百分号按数字设置
                    o.width = parseInt(o.width);
                }
            }

            if(prompt_mode){//字符串输出不接受宽度设定
                o.width = 370;
            }
            size(option);
            //没有设置不成功的状态，返回rt以便链式调用
            return rt;
        }

        //弹出动画完成后的回调，兼容iframe
        function after_see(){
            if(after_see_ed !== true || iframe_loaded !== true){
                return;
            }


            if(typeof o.load === 'function') {
                o.load(cur, rt);
            }

            //为弹窗元素绑定事件
            if(o.bind && o.bind.length>=1){
                var c;
                if(o.src){
                    c = cur.$(cur.document);
                }else{
                    c = $(cur);
                }
                o.bind.forEach(function(obj){
                    var type = obj.type || 'click',
                        ret;
                    //事件统一dialog_handle类，待关闭时取消事件绑定
                    c.find(obj.select).each(function(i,e){
                        $(this).on(type+'.pop_'+ o.id,function(event){
                            if(typeof obj.handle === 'function'){
                                ret = obj.handle.call(this,cur,rt,event);
                            }

                            //绑定关闭
                            if(obj.close === true && ret !== false){
                                pop_hide();
                            }

                            if(ret === false){//阻止默认事件
                                return false;
                            }

                        });
                    });
                });
            }

            size({iframe_first: o.src?true:false});
            pop_loading.remove();
        }


        //设置宽高方法
        function size(option){
            option = $.extend({position:true},option);
            var W = $(window).width(),
                H = $(window).height(),
                W_left = $(window).scrollLeft(),
                W_top = $(window).scrollTop();


            //重设初始pop_body,pop_box start
            pop_body.css({height: pop_body_defaultH});
            //pop_box设置auto，计为pop_box最小值（因为pop_body设置为pop_body_defaultH）
            pop_box.css({height: 'auto'});


            if(o.src){//如果是iframe，重设iframe
                iframe.height = pop_body_defaultH;
            }

            //储存最小值状态的pop_box
            var temp_h = pop_box.outerHeight();


            var width = o.width === 'auto'?pop_box.css({width:'auto'}).outerWidth(): o.width;
            //设置最小值状态坐标
            pop_box.css(
                $.extend(
                    {width:width,zIndex : pop.zIndex},
                    (function(){
                        if(option.position === true){
                            return{left : (W - width)<0?W_left:W_left+(W - width)/2,top : H - temp_h<0?W_top:W_top+(H - temp_h)*0.4}
                        }
                        return {}
                    }())
                ));


            //为pop_body设置真实值 start
            if(o.src){
                //在第一次size方法调用时，iframe还未成功加载，cur为空，默认设置pop_body_defaultH
                try{
                    var h = cur.$('.g-pop-iframe').outerHeight();
                }catch(e){
                    var h = pop_body_defaultH;
                }
                $(iframe).height(h);

                if(pop_btn_box){
                    h += pop_btn_box.outerHeight();
                    pop_btn_box.css({marginTop:-6});
                }
                pop_body.height(h);
            }else{
                //如果非iframe
                pop_body.css({height:'auto'});
            }
            //为pop_body设置真实值 end


            //储存pop_box真实高度
            var now_h = pop_box.outerHeight();

            if(option.iframe_first === true){//iframe页面载入完成，第一次动画真实高度
                pop_box.css({height:temp_h}).animate({
                    height:now_h,
                    top:H-now_h<0?W_top:W_top+(H-now_h) *0.4
                },o.animation?100:0,function(){
                    if(pop_btn_box){
                        pop_btn_box.css({visibility:'visible',opacity:0}).animate({opacity:1},o.animation?100:0);
                    }
                    $(iframe).css({visibility:'visible',opacity:0}).animate({opacity:1},o.animation?100:0);
                })
            }else{
                pop_box.css(
                    $.extend(
                        {height:now_h},
                        (function(){
                            if(option.position === true){
                                return {top:H-now_h<0?W_top:W_top+(H-now_h) *0.4}
                            }
                            return {}
                        }())
                    ));
            }
        }

        //关闭方法
        function pop_hide(option){
            option = option || {};
            if(option.ESC === true && o.ESC === false){
                return false;
            }
            var b_h;
            if (typeof rt.before_hide == "function") {
                b_h = rt.before_hide(cur,rt);
                if (b_h === false){//仅当返回false时阻止关闭
                    return false;
                }
            }

            //进入删除
            var index = live.indexOf(rt);
            live.splice(index,1);

            if(o.animation) {
                pop_box.css({
                    transform: "scale(.6)",
                    webkitTransform: "scale(.6)",
                    mozTransform: "scale(.6)",
                    oTransform: "scale(.6)",
                    msTransform: "scale(.6)"
                });
            }
            pop_box.stop().animate({opacity:0},o.animation?200:0,function(){
                bg.animate({opacity:0},o.animation?100:0,function(){
                    if(o.src){//修复IE BUG
                        iframe.src = "";
                        iframe.parentNode.removeChild(iframe);
                        window.CollectGarbage && window.CollectGarbage();
                    }
                    bg.remove();
                    pop_box.remove();
                    if (typeof rt.after_hide == "function"){
                        rt.after_hide(b_h);
                    }
                });
            });
            //返回rt以便链式调用
            return rt;
        }

    };

    //通过id查找弹窗
    pop.get = function(id){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.get(id);
        }
        var obj = live.filter(function(obj){
            if(obj.id === id.toString()){
                return true;
            }
        });
        return obj.length === 1?obj[0]:false;
    };

    //得到当前
    pop.cur = function(){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.cur();
        }
        if(live.length>=1){
            return live[live.length-1];
        }else{
            return false;
        }
    };

    //关闭当前
    pop.hide = function(option){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.hide(option);
        }
        if(pop.cur()){
            return pop.cur().hide(option);
        }else{
            return pop;
        }
    };

    //对当前弹窗重设宽度，重定位
    pop.resize = function(option){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.resize(option);
        }
        if(pop.cur()){
            return pop.cur().resize(option);
        }else{
            return pop;
        }
    };

    //对当前弹窗设置标题
    pop.setTitle = function(option){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.setTitle(option);
        }
        if(pop.cur()){
            return pop.cur().setTitle(option);
        }else{
            return pop;
        }
    };

    //返回弹窗的文档距离（不算标题）
    pop.offset = function(){
        if(Bazi.getTopWindow() != window){//这里不能用 !==，IE7、IE8判断不正确
            return Bazi.getTopWindow().Bazi.pop.offset();
        }
        if(pop.cur()){
            return pop.cur().offset();
        }else{
            return pop;
        }
    };


    //返回「同源」顶级window
    Bazi.getTopWindow = function(){
        var cur = window;
        var pa_win = cur.parent;
        while(true){
            try{
                pa_win.document;//尝试检测访问
                //若上行没有报错，未进入catch，表示访问成功，pa_win为同源

                cur = pa_win;//将pa_win赋值给cur

                pa_win = cur.parent;//为上层父窗口检测做准备

                if(pa_win == cur){//cur已是最顶层，并且iframe链没有跨域window，这里判断不能用 '==='，IE8及以下不兼容
                    break;
                }
            }catch(e){
                //访问到pa_win报同源错误，退出循环
                break;
            }
        }
        return cur;
    };

    //挂载
    Bazi.pop = pop;

    $(document).on('keyup',function(event){//使用ESC键关闭
       if(event.keyCode === 27 && Bazi.pop.cur()){
           return Bazi.pop.hide({ESC:true});
       }
    });

}());