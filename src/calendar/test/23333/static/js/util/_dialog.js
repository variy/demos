(function(win, BAZI){
    
    
    function O(opts){
        var settings = {
            beforeDialogShow: function(el){

            },
            afterDialogShow: function(el, fnClose){

            },
            beforeDialogClose: function(el){

            },
            afterDialogClose: function(el){

            },
            contentBodyPadding: '14px 20px'
        };

        $.extend(true, settings, opts);
        

        this.$el = $('<div class="dialog-box" style="position: absolute"></div>');
        this.template =  _.template(BAZI.tpls.dialog_tlp);
        this.init(settings);
    };

    O.prototype = {
        init:function(opts){
            this.options = opts;

            this.render(opts);
            this.cover(opts);
            this.handleMove();

            this.initEvent();

            this.showDialog(); 

            return this;
        },

        render: function(opts){
            if( opts.footer.show){
                for(var i=0,len = opts.footer.btns.length; i<len; i++){
                    var settings = {
                        type: 'button',
                        sty: 'default'
                    };
                    opts.footer.btns[i] = $.extend(settings, opts.footer.btns[i]);
                }
            }
            var html = this.template({opts: opts});
            this.$el.html(html);

            var izindex = BAZI.Global.zindex;
            this.$el.css('z-index', ++izindex);

            this.dialogEl = this.$el.find('.dialog');
            if( opts.size === 'auto' ){
                
            }else{
                this.dialogEl.addClass('dialog-' + opts.size);
            }
            
            this.dialogEl.find('.dialog-body').css('padding', this.options.contentBodyPadding);
            this.$el.appendTo($(document.body));
        },

        cover: function(opts){
            var iLeft, iRight, iTop, iBottom;

            if (opts.hasBackdrop === false) {

                this.$el.css({
                    'top':  $(window).scrollTop() + 40+'px',
                    'left': (opts.target.outerWidth() - this.dialogEl.outerWidth()) / 2 + 'px'
                });

            } else {
                if ( (opts.target)[0].nodeName.toLowerCase() === 'body') {
                    iLeft = iTop = 0;
                    this.$el.height(this.options.target[0].offsetHeight);
                    this.$el.width('100%');
                } else {
                    iLeft = opts.target.offset().left;
                    // iRight = $(window).width() - iLeft - opts.target.outerWidth();
                    iTop = opts.target.offset().top;
                    // iBottom = $(window).height() - iTop - opts.target.outerHeight();
                    this.$el.height(this.options.target[0].offsetHeight);
                    this.$el.width(this.options.target[0].scrollWidth);
                    
                }

                this.$el.css({
                    left: iLeft,
                    top: iTop
                });

                this.dialogEl.css({
                    top: this.options.target.scrollTop() + 40,
                    left: (opts.target.outerWidth() - this.dialogEl.outerWidth()) / 2
                });
            }  
        },

        handleMove: function(){
            if( !this.options.canmove)return;
            var me = this;
            var $oHeader = this.dialogEl.find('.dialog-header');

            $oHeader.mousedown(function(e) {
                var that = me.options.hasBackdrop ? me.dialogEl[0] : me.$el[0];

                $(that).css('z-index', ++BAZI.Global.zindex);
                var disX = e.pageX - that.offsetLeft;
                var disY = e.pageY - that.offsetTop;


                document.onmousemove = function(e) {
                    console.log(1111);
                    var e = e || window.event;
                    var L = e.pageX - disX;
                    var T = e.pageY - disY;
                    L = L < 0 ? 0 : L;
                    T = T < 0 ? 0 : T;
                    if (me.options.hasBackdrop) {
                        var iMaxL = me.$el[0].offsetWidth - me.dialogEl[0].offsetWidth;
                        var iMaxT = me.$el[0].offsetHeight - me.dialogEl[0].offsetHeight;
                    } else {
                        // debugger
                        var iMaxL = $(window).width() - that.offsetWidth;
                        var iMaxT = document.body.scrollHeight - that.offsetHeight;
                    }

                    L = L > iMaxL ? iMaxL : L;

                    T = T > iMaxT ? iMaxT : T;
                    that.style.left = L + 'px';
                    that.style.top = T + 'px';
                }

                document.onmouseup = function() {
                    document.onmousemove = document.onmouseup = null;
                }
            });

        },

        showDialog: function(){
            var me = this;
            var opts = this.options;
            var result = opts.beforeDialogShow(this.$el);
            if( result === false){
                return;
            }

            if (opts.hasBackdrop) {
                this.$el.find('.dialog-backdrop').animate({
                    opacity: 0.5
                }, 200, function() {
                    me.dialogEl.animate({
                        opacity: 1,
                        top: '+=12px'
                    }, 300, function() {
                        opts.afterDialogShow(me.$el, _.bind(me.removeDialog,me) );
                    });
                });
            } else {

                this.dialogEl.css('opacity', 1);
                this.dialogEl.css('opacity', 0).animate({
                    opacity: 1,
                    top: '+=12px'
                }, 300, function() {
                    opts.afterDialogShow(me.$el, _.bind( me.removeDialog) );
                });

            }
            return this;

        },

        removeDialog: function(){
            var me = this;
            if ('beforeDialogClose' in this.options) {
                var result = me.options.beforeDialogClose.call(null, this.$el);
                if (result === false) return;
            }
            this.dialogEl.css('opacity', 1).animate({
                opacity: 0,
                top: '-=12px'
            }, 200, function() {

                me.$el.find('.dialog-backdrop').fadeOut(150, function() {
                    me.$el.remove();
                    me.options.afterDialogClose && me.options.afterDialogClose.call(null, me.$el);
                });
            });
        },

        initEvent: function(){
            var me = this;
            this.$el.find('.dialog-close').on('click',function(e){
                e.stopPropagation();
                me.removeDialog();
            });

            if( this.options.footer.show ){
                this.options.footer.btns.forEach(function(btn, idx){
                    if( 'callback' in btn){
                        me.$el.find('[data-id=footer-btn-'+ idx+']').on('click',function(){
                            btn.callback.call(null,_.bind(me.removeDialog,me), me.$el);
                        });
                    }
                });
            }
        }
    };

    var Dialog = BAZI.Dialog = {};   
    Dialog.fadeDialog = function(opts){
        var settings = {};
        var baseSettings = {
            canmove: false,
            size: 'sm',
            hasBackdrop: false
        };

        var defaultSettings = {
            speed: 200,
            delay: 1000,
            header: {
                show: false
            },
            footer: {
                show: false
            },
            tip_txt: '这是一个提示',
            icon_info: 'ing',
            target: $('body'),
            afterDialogClose: function() {}
        };
        $.extend(settings, defaultSettings, opts, baseSettings);

        var Obj = new O(settings);

        var bodyHTML = '<p class="tipcont updata-'+ settings.icon_info+'"><span class="tip-icon"></span>&nbsp;&nbsp;&nbsp;<span class="tip-txt">' + settings.tip_txt + '</span></p>'
        Obj.dialogEl.find('.dialog-body').html(bodyHTML);

        Obj.showDialog().$el
                .delay(settings.delay).animate({
                    opacity: 0,
                    top: '-=7px'
                }, settings.speed, function() {
                    Obj.$el.remove();
                    settings.afterDialogClose.call(null);
                });
    };

    Dialog.tipModal = function(opts) {
        var settings = {};
        var defaultSettings = {
            target: $(document.body),
            hasBackdrop: true,
            canmove: true,
            header: {
                show: true,
                txt: "提示"
            },
            footer: {
                show: true,
                btns: [{
                    type: 'submit',
                    txt: "确定",
                    sty: 'primary',
                    callback: function() {}
                }, {
                    type: 'button',
                    txt: "取消",
                    sty: 'default',
                    callback: function(fnClose) {
                        fnClose();
                    }
                }]
            },
            tip_txt: '这是一个提示',
            icon_info: 'updata-ing',
            canmove: true,
            untransparent: true
        };

        $.extend(settings, defaultSettings, opts, {
            size: 'sm'
        });

        var obj = new O(settings);
                        
        var bodyHTML = '<p class="tipcont updata-' + settings.icon_info +'"><span class="tip-icon"></span>&nbsp;&nbsp;&nbsp;<span class="tip-txt">' + settings.tip_txt + '</span></p>';
        obj.dialogEl.find('.dialog-body').html(bodyHTML);

        // obj.showDialog();

        return obj;
    };

    Dialog.modal = function(opts){
        var settings = {};
        var defaultSettings = {
            size: 'lg',
            canmove: false,
            target: $(document.body),
            hasBackdrop: true,
            header: {
                show: true,
                txt: "提示"
            },
            footer: {
                show: true,
                btns: [{
                    type: 'submit',
                    txt: "确定",
                    sty: 'primary',
                    callback: function() {}
                }, {
                    type: 'button',
                    txt: "取消",
                    sty: 'default',
                    callback: function(fnClose) {
                        fnClose();
                    }
                }]
            },
            body: ''

        };
        
        $.extend(true, settings, defaultSettings, opts);

        var obj = new O(settings);
        // obj.showDialog();
        return obj;

    };

    Dialog.nonmodal = function(opts){
        var baseSettings = {
            hasBackdrop: false,
            target: $('body')
        };

        var defaultSettings = {
            size: 'lg',
            target: $('body'),
            header: {
                show: true,
                txt: "提示"
            },
            canmove: true,
            footer: {
                show: true,
                btns: [{
                    type: 'submit',
                    txt: "确定",
                    sty: 'primary',
                    callback: function() {}
                }, {
                    type: 'button',
                    txt: "取消",
                    sty: 'default',
                    callback: function(fnClose) {
                        fnClose();
                    }
                }]
            },
            body: ''
        };
        var settings = {};
        $.extend(true, settings, defaultSettings, opts, baseSettings);

        var obj = new O(settings);
        // obj.showDialog();
        return obj;

    }; 
})(window, BAZI);
