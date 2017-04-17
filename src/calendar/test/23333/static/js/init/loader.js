// 预加载的文件
(function(win, BAZI){
    BAZI.loader = {
        init: function(cb){

            this.loadLang(cb);
        },
        loadLang: function(cb){
            var b = {
                init: function(){
                    

                    this.checkVer();
                },
                checkVer: function(){
                    var me = this;
                    BAZI.Api.system.ini(function(data) {
                        //检测当前版本号是否和本地一样
                        if ( ('langVer' in localStorage ) && localStorage.langVer === data.ver.lang ) {
                            var langPage = JSON.parse(localStorage.langPage);
                            BAZI.lang = BAZI.langPage.langData;
                            cb && cb();
                        } else {
                            //加载语言包
                            me.loadLangData(function(){
                                localStorage.langVer = data.ver.lang;
                                cb && cb();
                            });
                            
                        }
                    });
                },
                loadLangData: function(innerCB){
                    BAZI.Api.lang.get(function(data) {
                        BAZI.lang = data.langData;
                        localStorage.langPage = data;
                        innerCB && innerCB();
                    });
                }
            };

            b.init();
        }
    }
})(window, BAZI);
