
// 登陆页面
var UserView = Backbone.View.extend({

    id:'user-login-container',

    initialize: function(options){

        this.render();
        this.initEvent();
        this.options = options;

    },

    render:function(){
        var html = $.tmpl( $('#login-templates').html() );
        this.$el.append(html);
        $('#viewport').children().remove().end().html(this.$el);;
        this.initEl();
    },

    initEl:function(){

        this.statusEl = $('#user-status');
        this.tipEl = $('.error-tips');
        this.loginBtn = $('#Login_SubmitStatic');
        this.userInput = $('#login-username');
        this.loginPage = $('#user-login');


        this.activaBox = $('#activation');

         // 注册页面的元素
        this.regPage = $('#register');
        this.regUserInput = $('#reg-name');
        this.regTelInput = $('#reg-username');
        this.regPwdInput = $('#reg-pwd');
        this.regBtn = $('#register_SubmitStatic');

        // 激活页面
        this.activationPage = $('#activation');
        this.actBtn = $('#activation_SubmitStatic');
        this.resendBtn = $('#act-resend');

        this.backBtn = $('.a-back');

    },

    initEvent: function(){
        var me = this;

        this.loginBtn.on(supportEvent, function(){
            me.vaildate('login', me.login);
        });

        this.userInput.on('blur', function(){
            me.vaildate('mobile', $(this).val());
        });

        // 注册页面
        this.regUserInput.on('blur', function(){
            me.vaildate('name', $(this).val());
        });

        this.regTelInput.on('blur', function(){
            me.vaildate('mobile', $(this).val());
        });

        this.regPwdInput.on('blur', function(){
            me.vaildate('pwd', $(this).val());
        });

        this.regBtn.on(supportEvent, function(){
            me.vaildate('reg', me.reg);
        });

        this.actBtn.on(supportEvent, function(){
            me.vaildate('activate', function(pwd){
                me.activate.call(me,pwd);
            });
        });

        var me = this;

        // 返回按钮，临时加的- -
        this.backBtn.on(supportEvent, function(){
            location.hash = '';
            BAZI.router.index();
        });

    },

    show: function(){
        this.$el.show();
        this.showLoginPage();
    },

    vaildate: function(type,cb){
        var regex = {
            mobile: /^0?(13[0-9]|15[0-9]|18[0-9]|14[57])[0-9]{8}$/,
            notEmpty: /\S+/,
            fivedigit: /^\d{5}$/
        }

        var curEl = $('.mamber-wrap:visible');


        var  mobile = curEl.find('.tel-input').val();
        var pwd = curEl.find('.pwd-input').val();
        var data = {
            mobile: mobile,
            pwd: pwd
        }
        if( curEl.find('.name-input') ){
            var name = curEl.find('.name-input').val();
            data.rName = name;
        }

        var me = this;

        var testMobile = function(cb){
            if( regex.mobile.test(mobile) ){
                cb && cb();
            }else{
                BAZI.Common.showTips('手机格式不正确');
                return;
            }
        }

        var testVercode = function(cb){
            if( regex.fivedigit.test(pwd) ){
                cb && cb(pwd);
            }else{
                BAZI.Common.showTips('请输入五位数数字验证码');
                return;
            }
        }

        var testPwd = function(cb){
            if(regex.notEmpty.test(pwd)){
                cb && cb.call(me,data);
            }else{

                BAZI.Common.showTips('密码格式不正确');
            }
        }

        var testName = function(cb){
            if( regex.notEmpty.test(name) ){
                cb && cb();
            }else{
                BAZI.Common.showTips('昵称格式不正确');
            }
        }

        switch(type){
            case 'mobile':
                testMobile();
            break;
            case 'login':
                testMobile(function(){
                    testPwd(cb);
                });
            break;

            case 'name':
                testName();
            break;

            case 'reg':
                testName(
                    function(){
                        testMobile(function(){
                            testPwd(cb)
                        })
                    }
                );
            break;

            case 'activate':
                testVercode(cb);
            break;
        }

    },

    // 用户登录
    login: function(uInfo, cb){

        // sessionStorage 缓存用户登录态
        if(sessionStorage.User){
            User = JSON.parse(sessionStorage.User);
            this.options.loginSuccess(User);
            return;
        }

        var me = this;
        BAZI.Api.iuaccount.login({
                mobile: uInfo.mobile,
                pwd: uInfo.pwd
            },
            function(d){
                _.extend(User, d.aUinfo);

                User.mkey = d.mkey;
                User.isLogin = true;
                User.isComplete = d.isComplete;

                sessionStorage.User = JSON.stringify(User);

                console.log('User->', User);
                me.options.loginSuccess(d); //登陆成功执行的函数
            },
            function(d){
                BAZI.Common.showTips(d.msg);
            }
        );

    },
    reg: function(data){
        var me = this;
        this.userTel = data.mobile;

        BAZI.Api.iuaccount.reg(data,
            function(d){
                BAZI.Common.showTips('注册成功');
                me.showActivationPage();
            },
            function(d){
                if(d.ret == 103){
                    BAZI.Common.showTips('该账户已存在');
                }else if(d.ret == 102){
                    BAZI.Common.showTips('尚未激活');
                    me.showActivationPage();
                }
            }
        );
    },
    activate: function(vercode){
        var me = this;

        BAZI.Api.iuaccount.activation(
            {
                mobile: this.userTel,
                code: vercode
            },
            function(d){
                BAZI.Common.showTips('激活成功！请登录...', function(){
                    BAZI.router.navigate('!/login', true);
                });
            },
            function(d){
                if(d.ret == 105){
                    BAZI.Common.showTips('验证码错误！');
                }
            }
        );

    },
    showLoginPage: function(){
        this.loginPage.show().siblings().hide();
        // location.hash = "#login";
        this.statusEl.html('登陆');
        this.userInput.val(this.userTel);
    },
    showRegPage: function(){
        this.regPage.show().siblings().hide();
        this.statusEl.html('注册');
    },
    showActivationPage: function(){
        this.activationPage.find('.num').html(this.userTel);
        this.activationPage.show().siblings().hide();
        this.statusEl.html('激活');
        // location.hash = "#act";
    }
});
