/*
* 页面跳转处理
*/

(function (doc, win) {

    var Router = Backbone.Router.extend({

        routes: {
            '!/index': 'index',
            '!/register': 'register',
            '!/login': 'login',
            '!/record': 'record',
            '!/paipan': 'paipan',
            '!/reg': 'loginReg',
            '!/pinfo': 'pinfo',
            '!/events': 'events',
            '': 'index'
        },

        initialize: function() {
            location.hash = '';
        },

        isLogin: function(page){
            if( !User.isLogin ){
                this.login(page);
            }
            return User.isLogin;
        },

        login: function(page, d){

            this.navigate("!/login");

            if(BAZI.Views.Login){
                $('#viewport > div').hide();
                BAZI.Views.Login.show();
                return;
            }
            BAZI.Views.Login = new UserView({
                loginSuccess:function(data){

                    if(!data.isComplete){
                        BAZI.router.navigate('#!/pinfo', true);
                    } else if(page){
                        if(page == "pinfo" && d){
                            BAZI.router.pinfo(d); return;
                        }
                        BAZI.router.navigate('#!/' + page, true);
                    } else {
                        BAZI.router.index();
                    }

                }
            });
        },
        // 默认首页
        index: function(){

            BAZI.fromEvents = false;

            $('#viewport > div').hide();

            if($('#index').length){
                $('#index').show();
            }else{
                BAZI.Views.Index = new Index();
            }
            BAZI.router.navigate('#!/index');
        },

        record: function(){

            if(!this.isLogin('record')){
                return;
            }

            BAZI.router.navigate('#!/record');

            $('#viewport > div').hide();
            if($('#record').length){

               BAZI.Views.Record.initData();

            }
            BAZI.Views.Record = new Record({model: RecordItem});
        },

        paipan: function(data){

            this.navigate("!/paipan");
            $('#viewport > div').hide();

            // console.log('paipan----------', data);
            if($('#paipan').length){
                $('#paipan').show();
                BAZI.Views.Paipan.init(data);
            }else{
                BAZI.Views.Paipan = new Paipan(data);
            }
        },
        loginReg: function(){

            if( !('Login' in BAZI.Views)){
                // BAZI.Views.Login = new UserView({
                //     loginSuccess:function(data){
                //         if(data.aUinfo.isComplete ===1){
                //             debugger;
                //         }
                //         // BAZI.router.navigate('#!/index', true);
                //     }
                // });
            }
            BAZI.Views.Login.showRegPage();
        },
        pinfo: function(data){
            this.navigate("!/pinfo");
            BAZI.Views.personInfo = new PersonInfo(data);
        },

        events: function(){
            this.navigate("!/events");
            $('#viewport > div').hide();

            if($('#events').length){
                $('#events').show();
                BAZI.Views.Events.init();
            }else{
                BAZI.Views.Events = new Events();
            }
        }


    });

    // 页面加载完再初始化
    window.onload = function(){
        BAZI.router = new Router();
        Backbone.history.start();
    };


})(document, window);

