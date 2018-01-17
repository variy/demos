// @box: 包住轮播图的块级元素的$对象，必填！
// @imgData:对象数组，每个对象是图片的点击链接和路径，必填！
// @afterSlide: 每次切换完成后的回调函数
// @onImgTap: 点触图片的回调函数

// @isAutoPlay: 是否自动切换，默认true
// @speed: 运动速度(多久完成一次切换)，默认400ms
// @delay:  自动播放的间隔时间,默认3000ms
// @canSwipeSlide: 能否滑动来切换，默认true
// @hasSlideBtn： 是否有左右滑动按钮，默认false
(function(){
    function Slider(opts){
        this.settings = {
            afterSlide:function(){},
            onImgTap: function(){},
            isAutoPlay: true,
            delay: 3000,
            speed:250,
            canSwipeSlide: true,
            hasSlideBtn: false,
            izindex:9
        };

        for( var attr in opts){
            this.settings[attr] = opts[attr];
        }
        
        this.box = this.settings.box;

        this.boxW =this.settings.box[0].clientWidth;
        this.oriItemCount = this.settings.imgData.length;
        this.index = 0; //当前显示图片的索引
        this.ctrlIndex = 0; //有slide-clone-item的时候
        this.renderDOM();
        
        if( this.oriItemCount <2 ){
            return;
        }

        this.bindEvent();
        this.settings.isAutoPlay && this.autoPlay();
    };

    Slider.prototype.renderDOM = function(){
        var self = this;
        this.wrapper = $('<ul class="slide-list"></ul>');
        this.indicator = $('<div class="indicator"></div>');

        for (var i = 0; i < this.oriItemCount; i++) {
            var li = $('<li class="slide-item"></li>');
            li.css({'width':this.boxW,'left':-this.boxW*i});

            if( i != this.index ){
                li[0].style.webkitTransform = 'translate3d('+(-this.boxW)+'px,0,0)';            
            }else{
                li[0].style.webkitTransform = 'translate3d(0,0,0)';            
            }

            var item = this.settings.imgData[i];

            li.html('<a href="'+ item['href'] +'"><img src="'+ item['src'] +'" /></a>');
            li.appendTo(this.wrapper);

            var iSpan = $('<span></span>');
            if( i == this.index )iSpan.addClass('cur');
            iSpan.appendTo(this.indicator);
        };

        if( this.oriItemCount == 2){
            this.cloneItemCount = 2;
            for (var i = 2; i < 4; i++) {
                this.wrapper.children().eq(i-2).clone().attr('class','slide-clone-item clone-'+(i-2))
                    .css({'width':this.boxW,'left':-this.boxW*i,'webkitTransform':'translate3d('+(-this.boxW)+'px,0,0)'})
                    .appendTo(self.wrapper);

                // this.wrapper.children().eq(i)[0].style.webkitTransform = 'translate3d('+(-this.boxW)+'px,0,0)';                      
            };
            
            this.itemCount = this.cloneItemCount + this.oriItemCount;
        }else{
            this.itemCount = this.oriItemCount;
        }
        this.wrapper.width(this.itemCount*this.boxW);

        this.wrapper.appendTo(this.box);
        this.indicator.appendTo( this.box.parent() );

        this.aItem = this.wrapper.children();

        if( this.settings.hasSlideBtn ){
            this.prevBtn = $('<a href="javascript:;" class="btn prev"><span></span></a>');
            this.prevBtn.appendTo(this.box.parent());

            this.nextBtn = $('<a href="javascript:;" class="btn next"><span></span></a>');
            this.nextBtn.appendTo(this.box.parent());

            var itop = ( this.box[0].clientHeight - this.prevBtn.height() )/2 ;
            this.prevBtn.css('top',itop);
            this.nextBtn.css('top',itop);
        }

        this.oriItemCount > 1 && this.beforeMove();
    };

    Slider.prototype.beforeMove = function(){
        var len = this.itemCount;  
        this.iPrev = this.ctrlIndex<=0? len-1: this.ctrlIndex-1;
        this.iNext = this.ctrlIndex>=len-1?0: this.ctrlIndex+1;

        this.aItem.get(this.iNext).style.webkitTransition
         = this.aItem.get(this.iPrev).style.webkitTransition
         =this.aItem.get(this.ctrlIndex).style.webkitTransition
         ='-webkit-transform 0s ease-in-out';

        this.aItem.get(this.iPrev).style.webkitTransform = 'translate3d('+(-this.boxW)+'px,0,0)';
        this.aItem.get(this.iNext).style.webkitTransform = 'translate3d('+this.boxW+'px,0,0)';
    };

    Slider.prototype.goIndex = function(n,callback,isFullSlide){
        if(isFullSlide===undefined){
            isFullSlide = true;
        }
        if( isFullSlide){
            this.beforeMove();
        }
               
        var i,
        len = this.itemCount,
        self = this;
        
        if( typeof(n) == 'string'){
            i = this.ctrlIndex + n*1;
        }
        i = i<0?len-1:i;
        i = i>len-1?0:i;
        this.ctrlIndex = i;        
        this.iPrev = this.ctrlIndex<=0? len-1: this.ctrlIndex-1;
        this.iNext = this.ctrlIndex>=len-1?0: this.ctrlIndex+1;
        self.aItem.get(self.ctrlIndex).style.zIndex = ++self.settings.izindex;
        // setTimeout(function(){
            self.aItem.get(self.iPrev).style.webkitTransition = '-webkit-transform '+self.settings.speed+'ms ease-out';
            self.aItem.get(self.ctrlIndex).style.webkitTransition = '-webkit-transform '+self.settings.speed+'ms ease-out';
            self.aItem.get(self.iNext).style.webkitTransition = '-webkit-transform '+self.settings.speed+'ms ease-out';

            self.aItem.get(i).style.webkitTransform = 'translate3d(0,0,0)';
            self.aItem.get(self.iPrev).style.webkitTransform = 'translate3d(-'+self.boxW+'px,0,0)';
            self.aItem.get(self.iNext).style.webkitTransform = 'translate3d('+self.boxW+'px,0,0)';
            self.indiChange();
        // },0);
            

        this.aItem.get(i).addEventListener('webkitTransitionEnd',end,false);
        function end(){
            self.aItem.get(i).removeEventListener('webkitTransitionEnd',end,false);                
            callback && callback.call(self);
            self.settings.afterSlide.call(self);
        }

    };

    Slider.prototype.autoPlay = function(){
        
        var self = this;

        this.timer = setInterval(function(){
            if( self.settings.isAutoPlay){
                self.goIndex('+1');
            }    
        },self.settings.delay);
        _fixPageHide();
        // 页面失去焦点后，浏览器会把定时器的DOM操作变慢，以节省性能。页面再次获得焦点，浏览器会把累计的操作一次加载完。
        function _fixPageHide(){
            var hidden = "hidden";
            if (hidden in document){
                document.addEventListener("visibilitychange", onchange);
            }else if( (hidden = "webkitHidden") in document){
                document.addEventListener("webkitvisibilitychange", onchange);
            }else if ("onfocusin" in document){
                document.onfocusin = document.onfocusout = onchange;
            }else{
                window.addEventListener("pageshow", onchange);
                window.addEventListener("pagehide", onchange);
                window.addEventListener("focus", onchange);
                window.addEventListener("blur", onchange);
            }

            function onchange (evt) {
                var v = "visible", h = "hidden",
                    evtMap = {
                        focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
                    };

                evt = evt || window.event;

                if (evt.type in evtMap){                    
                    self.settings.isAutoPlay = evtMap[evt.type] == v? true:false;
                }else{
                    self.settings.isAutoPlay = this[hidden] ? false:true;
                }
            }   
        }
    };

    Slider.prototype.bindEvent = function(){
        var self = this;
        if( this.settings.hasSlideBtn ){
            this.prevBtn.tap(function(){
                self.settings.isAutoPlay = false;
                 
                self.goIndex('-1',function(){
                    clearTimeout(self.delayPlayTimer);                   
                    self.delayPlayTimer = setTimeout(function(){
                        self.settings.isAutoPlay = true;
                    },self.settings.delay);
                });
            });

            this.nextBtn.tap(function(){
                self.settings.isAutoPlay = false;

                self.goIndex('+1',function(){
                    clearTimeout(self.delayPlayTimer);                    
                    self.delayPlayTimer = setTimeout(function(){
                        self.settings.isAutoPlay = true;
                    },self.settings.delay);
                });
            });
        }

        this.wrapper.tap(function(){
            self.settings.onImgTap.call(self);        
        });

        if( this.settings.canSwipeSlide ){
            var startHandle = function(e){
                self.settings.isAutoPlay = false;
                self.beforeMove();
                self.startTime = new Date()*1;
                self.startX = e.touches[0].pageX;
                
                self.offsetX = 0;
            };

            var moveHandler = function(e){
                e.preventDefault();
                self.settings.isAutoPlay = false;
                self.offsetX = e.touches[0].pageX - self.startX;
                

                self.aItem.get(self.iPrev).style.webkitTransform = 'translate3d('+(-self.boxW+self.offsetX)+'px,0,0)';
                self.aItem.get(self.ctrlIndex).style.webkitTransform = 'translate3d('+ self.offsetX +'px,0,0)';
                self.aItem.get(self.iNext).style.webkitTransform = 'translate3d('+ (self.boxW+self.offsetX) +'px,0,0)';

            };

            var endHandle = function(e){
                var boundary = self.boxW/6;

                var endTime = new Date()*1;
                clearTimeout(self.delayPlayTimer);
                self.delayPlayTimer = setTimeout(function(){
                    self.settings.isAutoPlay = true;
                },self.settings.delay);
                
                // 当手指移动时间超过300ms的时候，就按位移计算
                if( endTime - self.startTime > 300){
                    if( self.offsetX >= boundary ){
                        self.goIndex('-1',function(){},false);
                    }else if( self.offsetX < -boundary){
                        self.goIndex('+1',function(){},false);
                    }else{
                        self.goIndex('0',function(){},false);
                    }
                }else{

                    if( self.offsetX > 50){
                        self.goIndex('-1');
                    }else if( self.offsetX < -50){
                        self.goIndex('+1');
                    }else{
                        self.goIndex('0');
                    }
                }
            };

            this.wrapper.on('touchstart',startHandle);
            this.wrapper.on('touchmove',moveHandler);
            this.wrapper.on('touchend',endHandle);
        }
            
    };
            
    Slider.prototype.indiChange = function(){
        var oLen = this.oriItemCount;
        this.indicator.find('.cur').removeClass('cur');

        this.index = this.ctrlIndex%oLen;        
        
        this.indicator.children().eq(this.index).addClass('cur');    
    };

    Slider.prototype.destroy = function(){
        this.box.siblings().remove()
            .end().children().remove();
    }
    
    window.Slider = Slider;

})();