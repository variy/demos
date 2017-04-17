
    // 登陆页面
(function(win, BAZI){


    BAZI.Views.UserView = Backbone.View.extend({

        id:'userview',

        events: {
            'click .sex-label': 'switchSex'
        },

        initialize: function(type, loginSuccess){
            this.render();
            this.initEl();
            this.init(type, loginSuccess);
            this.initEvent();
           
        },

        init: function(type, loginSuccess){
            this.loginSuccessCB = loginSuccess;
            this.resTime = this.oriResTime =  60;
            this.$el.show();
            if(type === "register"){
                this.showRegPage();
            }else{
                this.showLoginPage();
            }
        },

        render:function(){
            var me = this;
            this.dialogObj = BAZI.Dialog.modal({
                header: {
                    show: 'true',
                    txt: ''
                },
                size: 'auto',
                footer: {
                    show: false
                },
                body: BAZI.tpls.tpls_members,
                afterDialogClose: function(){
                    me.remove();
                },
                afterDialogShow:function(){
                    me.$('input[type=text]:visible:first').trigger('focus');
                }
            });
            this.$el = this.dialogObj.$el;
            this.titleEl = this.$el.find('.dialog-title');
            this.$el.find('.m-Login').html($.tmpl(BAZI.tpls.tpls_login));
            this.$el.find('.m-Register').html($.tmpl(BAZI.tpls.tpls_register));
            this.$el.find('.m-Act').html($.tmpl(BAZI.tpls.tpls_act));
            this.$el.find('.m-Forget').html($.tmpl(BAZI.tpls.tpls_forget));
        },

        initEl:function(){
            this.dialog = this.$el.find('.dialog-body');

            this.loginBtn = $('#Login_SubmitStatic');
            this.userInput = $('#login-username');
            this.loginPwdInput = $('#login-pwd');
            this.loginPage = $('#user-login');
            this.loginForm = $('#form-login');

            this.activaBox = $('#activation');

             // 注册页面的元素
            this.regPage = $('#register');
            this.regForm = $('#form-register');
            this.regUserInput = $('#reg-name');
            this.regTelInput = $('#reg-username');
            this.regPwdInput = $('#reg-pwd');
            this.regBtn = $('#register_SubmitStatic');

            // 激活页面
            this.activationPage = $('#activation');
            this.actForm = $('#form-activation');
            this.actBtn = $('#activation_SubmitStatic');
            this.resendBtn = $('#act-resend');

            // 忘记密码页面
            this.forgetForm = $('#form-Forget');
            this.forgetSend = $('#Forget_Send');
            this.forgetSub = $('#Forget_Submit');
        },

        initEvent: function(){
            this.validate();
            var me = this;
            this.loginBtn.on('click', function(){
                me.validateBefore('login', me.login);
            });

            // 注册页面
            this.regBtn.on('click', function(){
                me.validateBefore('reg', me.reg);
            });

            // 激活页面
            this.actBtn.on('click', function(){
                me.validateBefore('activate', function(pwd){
                    me.activate.call(me, pwd);
                });
            });

            this.resendBtn.on('click', function(){
                me.resendSafeCode();
            });

            // this.dialog.find('.close-dialog').on('click', function(){
            //     me.$el.hide();
            // });

            $('#forget-pwd').on('click', function(){
                me.showForgetPwdPage();
            });
            $('#toggle-register, #to-register').on('click', function(){
                me.showRegPage();
            });
            $('#toggle-login').on('click', function(){
                me.showLoginPage();
            });

            this.forgetSend.on('click', function(){
                me.sendSafetyCodeFromForget();
            });
            this.forgetSub.on('click', function(){
                me.resetPwd();
            });
        },

        showLoginPage: function(){
            var me = this;
            this.titleEl.html('登录');
            this.dialog.find('.mamber-wrap').hide();
            this.$el.find('.m-Login').show();
            this.userInput.val(this.userTel);
        },

        showRegPage: function(){
            var me = this;
            this.titleEl.html('注册');
            this.dialog.find('.mamber-wrap').hide();
            this.$el.find('.m-Register').show();
            $('.m-Register').find('input[value=0]').attr('checked', 'checked');

            if ($("#calendar1").html() !== '') {
                return;
                alert($(".control-wrap").length());
            }else{
                new BAZI.calCtrlBar({
                    oBoxEl: $('#calendar1'),
                    hasGanZhi: false,
                    updateDate: function(data){
                        var format = function(num){
                            if(num < 10){ 
                                return '0' + num;
                            }
                            return ''+num;
                        };
                        me.birthsolar = data.year+'-'+ format(data.month)+'-'+ format(data.day);
                        me.birthtime = format(data.hour)+':'+ format(data.min)+':'+ format(data.second);
                    }
                });
            }
        },

        showActivationPage: function(){
            var me = this;
            this.titleEl.html('激活');
            this.dialog.find('.mamber-wrap').hide();
            this.$el.find('.m-Act').show();

            this.actForm.find('.num').html(me.userTel);

            var timeEl =  $('#reserve-time-counter');
            this.FnResendTicker({
                tickerBefore: function(time){
                    me.resendBtn.removeClass('color_red');
                    timeEl.html(time);
                },
                tickEnd: function(){
                    me.resendBtn.addClass('color_red');
                },
                ticking: function(time){
                    timeEl.html(time);
                }

            });
        },

        showForgetPwdPage: function(){
            var me = this;
            this.titleEl.html('忘记密码');
            this.dialog.find('.mamber-wrap').hide();
            this.$el.find('.m-Forget').show();
        },
        validate:function(){
            var showType = this.$el.find('.mamber-wrap:visible').data('type');
            var me = this;
            switch( showType){
                case 'reg':
                    
                    this.regForm.validate({
                        // onkeyup: function(el,e){
                        //     var result = this.element(el);
                        //     if( result)return false;
                        // },
                        rules: {
                            telephone: {
                                required: true,
                                mobile: true
                            },
                            username: {
                                required: true,
                                minlength: 2
                            },
                            pwd: {
                                required: true,
                                minlength: 5
                            }
                        },
                        messages: {
                            telephone: {
                                required: '请输入手机'
                            },
                            username: {
                                required: '请输入姓名',
                                minlength: '姓名长度不能少于2位'
                            },
                            pwd: {
                                required: '请输入密码',
                                minlength: '密码长度不能小于5位'
                            }
                        }
                    });
                break;

                case 'login':
                    
                    this.loginValidator = this.loginForm.validate({
                        rules:{
                            mobile: {
                                required: true,
                                mobile: true
                            },
                            pwd: {
                                required: true,
                                minlength: 5
                            }
                        },
                        messages: {
                            mobile: {
                                required: '请输入手机'
                            },
                            pwd: {
                                required: '请输入密码',
                                minlength: '密码长度不能小于5位'
                            }
                        }
                    });
                break;

                case 'act':
                    
                    this.actForm.validate({
                        rules: {
                            ver_pwd: {
                                required: true,
                                minlength: 5
                            }
                        },
                        messages: {
                            ver_pwd:{
                                required: '请输入验证码',
                                minlength: '验证码长度为5位'
                            }
                        }
                    });
                break;

                case 'forget':
                    this.forgetValidator = this.forgetForm.validate({
                        rules: {
                            mobile: {
                                mobile: true,
                                required: true
                            },
                            'verify-code': {
                                required: true,
                                minlength: 5
                            },
                            pwd: {
                                required: true,
                                minlength: 5
                            }
                        },
                        messages: {
                            mobile:{
                                required: '请输入注册手机号'
                            },
                            'verify-code': {
                                required: '请输入手机接收的验证码',
                                minlength: '验证码长度为5位数'
                            },
                            pwd: {
                                required:'请输入新密码',
                                minlength: '新密码长度至少为5位'
                            }
                        }

                    });
                break;


            }
                

                

                
        },

        switchSex: function(e){
            var label = e.target;
            if(label.tagName === 'input'){
                label = label.parentNode;
            }
            $(label).addClass('on').siblings().removeClass('on');
            $('#regsex').val($(label).val());
        },

        validateBefore: function(type, cb, tipbox){
            this.validate();
            var regForm = this.regForm;
            var loginForm = this.loginForm;
            var actForm = this.actForm;
            var me = this;
            switch(type){
                case 'reg':
                    
                     regForm.valid();
                     if( regForm.validate().form() ){
                        var mobile = regForm.find('.tel-input').val();
                        var pwd = regForm.find('.pwd-input').val();
                        var name = regForm.find('.name-input').val();
                        var igender = regForm.find('#regsex').val();
                        var data = {
                            mobile: mobile,
                            pwd: pwd,
                            rName: name,
                            birthsolar: me.birthsolar,
                            birthtime: me.birthtime,
                            igender: igender
                        }

                        cb && cb.call(me,data);
                     }
                break;

                case 'login':
                    loginForm.valid();
                    if( loginForm.validate().form() ){
                        var mobile = loginForm.find('.tel-input').val();
                        var pwd = loginForm.find('.pwd-input').val();
                        var data = {
                            mobile: mobile,
                            pwd: pwd
                        };
                        cb && cb.call(me,data);
                    }
                break;

                case 'activate':
                    actForm.valid();
                    if( actForm.validate().form() ){
                        var pwd =  actForm.find('.pwd-input').val();
                        cb && cb(pwd);
                    }
                break;

                case 'forget':
                    this.forgetForm.valid();
                    if( this.forgetForm.validate().form() ){
                        cb && cb.call(me);
                    }
                break;

            }
      

        },

        // 用户登录
        login: function(uInfo, cb){

            // sessionStorage 缓存用户登录态
            if(sessionStorage.User){
                BAZI.User = JSON.parse(sessionStorage.User);
                this.loginSuccessCB && this.loginSuccessCB(BAZI.User);
                return;
            }

            var me = this;
            BAZI.Api.iuaccount.login({
                    mobile: uInfo.mobile,
                    pwd: uInfo.pwd
                },
                function(d){
                    _.extend(BAZI.User, d.aUinfo);

                    BAZI.User.mkey = d.mkey;
                    BAZI.User.isLogin = true;
                    BAZI.User.isComplete = d.isComplete;

                    sessionStorage.User = JSON.stringify(BAZI.User);

                    BAZI.Dialog.fadeDialog({tip_txt: '登陆成功',icon_info: 'success' });
                    BAZI.models.pageStatus.set('isLogin', true);
                    // debugger;
                    me.dialogObj.removeDialog();
                    me.loginSuccessCB && me.loginSuccessCB(d); //登陆成功执行的函数
                },
                function(d){
                    BAZI.Dialog.fadeDialog({tip_txt: d.msg,icon_info: 'error' })
                }
            );

        },

        reg: function(data){
            var me = this;
            this.userTel = data.mobile;
            var curDialog = $('.bazi-dialog');
            BAZI.Api.iuaccount.reg(data,
                function(d){
                    BAZI.Dialog.fadeDialog({tip_txt: '注册成功',icon_info: 'success'});
                    me.showActivationPage();
                },
                function(d){
                    if(d.ret == 103){
                        BAZI.Dialog.fadeDialog({tip_txt: '该账户已存在',icon_info: 'error'});
                    }else if(d.ret == 102){
                         BAZI.Dialog.fadeDialog({tip_txt: '尚未激活',icon_info: 'warning'});
                        me.showActivationPage();
                    }
                }
            );
        },

        activate: function(vercode){
            var me = this;

            BAZI.Api.iuaccount.activation(
                {
                    mobile: me.userTel,
                    code: vercode
                },
                function(d){
                    BAZI.Dialog.fadeDialog({ tip_txt: '激活成功！请登录...', icon_info: 'success'});
                    
                    BAZI.router.navigate('login', true);
                    
                },
                function(d){
                    if(d.ret == 105){
                        BAZI.Dialog.fadeDialog({ tip_txt: '验证码错误！', icon_info: 'error'});
                    }
                }
            );

        },

        FnResendTicker: function(opts){
            var me = this;
            this.resTime = this.oriResTime;
            opts.tickerBefore && opts.tickerBefore( this.resTime);
            
            if('resendTicker' in this ){
                clearInterval(me.resendTicker);
            }

            this.resendTicker = setInterval(function(){
                if( me.resTime > 0){
                    me.resTime--;
                    opts.ticking && opts.ticking(me.resTime);
                    if(me.resTime===0){
                        clearInterval(me.resendTicker);
                        opts.tickEnd && opts.tickEnd();
                    } 
                }                
            },1000);
        },
        sendSafetyCodeFromForget: function(){
            var me = this;
            this.validate();
            var mobileInput = $('#forget-tel');
            var result = this.forgetValidator.element(mobileInput);
            if(!result)return;
            // 发送验证码
            var me = this;
            BAZI.Api.iuaccount.sendSafetyCode({mobile: mobileInput.val()}, function(d) {
                me.resendBtn.removeClass('color_red');
                
                BAZI.Dialog.fadeDialog({
                    tip_txt: '验证码已发送',
                    icon_info: 'success'
                });
                $('#reserve-time-counter').html(me.oriResTime);
            });
            setTimeout(function(){
                var timeEl = $('#forget-resend-ticker');
                me.FnResendTicker({
                    tickerBefore: function(time){
                        me.forgetSend.hide();
                        timeEl.css('display','inline-block').find('span').html(time);
                    },
                    tickEnd: function(){
                        timeEl.css('display','none');
                        me.forgetSend.show();
                    },
                    ticking: function(time){
                        timeEl.find('span').html(time);
                    }
                });   
            },2000);  
        },

        resendSafeCode: function(){
            var me = this;
            if( this.resTime === 0 ){
                var tel = this.userTel ? this.userTel : $('#forget-tel').val();
                var data = {
                    mobile: tel
                };
                BAZI.Api.iuaccount.sendSafetyCode(data, function(d) {
                    me.resendBtn.removeClass('color_red');
                    
                    BAZI.Dialog.fadeDialog({
                        tip_txt: '验证码已发送',
                        icon_info: 'success'
                    });
                    $('#reserve-time-counter').html(me.oriResTime);

                    setTimeout(function(){
                        me.resTime = me.oriResTime;
                    },3000);
                });
            }
        },

        resetPwd: function(){
            var me = this;
            this.validateBefore('forget',function(){
                var data = {
                    mobile: $('#forget-tel').val(),
                    code: $('#login-code').val(),
                    pwd: $('#login-pwd-new').val()
                };
                BAZI.Api.iuaccount.resetPwd(data, function(d){
                    if(d.ret === 0){
                        BAZI.Dialog.fadeDialog({
                            tip_txt: '密码修改成功，请重新登录',
                            icon_info: 'success'
                        });
                        me.showLoginPage();
                        me.loginValidator.resetForm();
                    }
                });
            });        
        }

    });

})(window, BAZI);
