
var Index = Backbone.View.extend({

    id: 'index',

    events: {
        'click .sex-tab li': 'switchSex',
        'click #qipan-btn': 'qipan',
        'click a.Record': 'showRecord',
        'click .Me': 'showMe',
        'click .Class, .Test': 'showTips'
    },


    initialize: function() {
        this.render();
        this.init();
    },

    init: function(){

        this.checkVer();
        BAZI.userData = {};
    },


    showRecord: function(){
        BAZI.router.record();
    },

    showMe: function(){

        if(!BAZI.router.isLogin()){
            return;
        }
        if(!User.isComplete){
            BAZI.router.navigate('#!/pinfo', true);
            return;
        }

        BAZI.Common.showMyInfo();
    },

    showTips: function(){
        BAZI.Common.showTips('敬请期待~');
    },

    // 判断语言包版本号
    checkVer: function(cb) {
        var me = this;

        BAZI.Api.system.ini(function(data){

            var langVer = localStorage.langVer;

            if( langVer != data.ver.lang ){
                me.loadData();
                localStorage.langVer = data.ver.lang;
            } else {
                me.initLang();
            }
        });

    },

    // 初始化语言包
    initLang: function(){
        if(localStorage.langPage){

            BAZI.langPage = JSON.parse(localStorage.langPage);
            BAZI.lang = BAZI.langPage.langData;

            console.log("语言包:", BAZI.lang);

        } else {
            this.loadData();
        }
    },

    // 异步加载语言包
    loadData: function(ver) {

        var me = this;

        // 首次加载并缓存
        BAZI.Api.lang.get(function(data){

            localStorage.langPage = JSON.stringify(data);
            me.initLang();

        });

    },

    switchSex: function(e){
        var el = $(e.target);
        el.addClass('on').siblings().removeClass('on');
        $('#sex').val(el.attr('data'));
    },

    render: function(){

        var el = $.tmpl($('#index-templates').html());

        this.$el.append(el);
        $('#viewport').append(this.$el);

        BAZI.Common.showCalendar($('#calender'));
    },

    qipan: function(){
            var year = BAZI.Common.time.year;
            var mouth = BAZI.Common.time.month;
            var day = BAZI.Common.time.day;
            var hour =BAZI.Common.time.hour;
            var min = BAZI.Common.time.min;
            var second = BAZI.Common.time.second;

            var format = function(num){
                if(num < 10){ 
                    return '0' + num;
                }
                return ''+num;
            };

            var data = {
                sDate: year+'-'+ format(mouth)+'-'+ format(day),
                sTime: format(hour)+':'+ format(min)+':'+ format(second),
                iGender: $('#sex').val(),
                rName: $('#name').val(),
            };
            BAZI.router.paipan(data);
    }

});
