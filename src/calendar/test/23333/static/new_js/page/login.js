var loginTopPage = !Bazi.pop.get('login');
if(loginTopPage === true){//loginTopPage为true代表不是弹窗，是登录页
    var logins = {
        frame : window,
        setTitle : function(){}
    }
}else{
    logins = Bazi.pop.get('login');
}


function fadeIn(dataType,title,cb){
    $('.login-box .mamber-wrap[data-type='+dataType+']').fadeIn(200,
        function(){
            logins.setTitle(title);
            cb && cb();
        }
    ).siblings().hide();
};



//注册帐号
;(function(){
    var birth = {};
    if(loginTopPage){
        new Bazi.calCtrlBar({
            oBoxEl: $('.m-Register').find('#calendar1'),
            activeClass: 'cur',
            updateDate: function(data) {
                birth.dateInfo = [data.year, data.month, data.day];
                birth.timeInfo = [data.hour, data.min, data.second];
                birth.dateInfo = birth.dateInfo.map(function(elm){
                    return elm<10?'0'+elm:elm.toString()
                }).join('-');
                birth.timeInfo = birth.timeInfo.map(function(elm){
                    return elm<10?'0'+elm:elm.toString()
                }).join(':');
            }
        });
        regBind($('.m-Register')[0]);
        $('#event_bind_regsiter').click(function(){
            fadeIn('reg','注　册',function(){
                $('#reg-username').trigger('focus');
            });
        });

    }else{
        $('#event_bind_regsiter').click(function(){
            Bazi.pop.show({
                width:650,
                title:'注 册',
                html:Bazi.tpls.tpls_register,
                before:function(cur){
                    var _this = this;
                    try{//ie7在此会报错
                        new Bazi.calCtrlBar({
                            oBoxEl: $(cur).find('#calendar1'),
                            activeClass: 'cur',
                            updateDate: function(data) {
                                birth.dateInfo = [data.year, data.month, data.day];
                                birth.timeInfo = [data.hour, data.min, data.second];
                                birth.dateInfo = birth.dateInfo.map(function(elm){
                                    return elm<10?'0'+elm:elm.toString()
                                }).join('-');
                                birth.timeInfo = birth.timeInfo.map(function(elm){
                                    return elm<10?'0'+elm:elm.toString()
                                }).join(':');
                            }
                        });
                    }catch(e){

                    }
                },
                load:function(cur,obj){
                    regBind(cur);
                },
                after_hide:function(){
                    location.hash = 'login';
                }
            });



        });
    }


    //注册帐号事件绑定
    function regBind(cur){
        $(cur).find('#reg-username').trigger('focus');

        var _this = this;
        var formRegister = $(cur).find('#form-register');
        if(!loginTopPage){
            var reg = Bazi.pop.cur();
        }

        $(cur).find('#toggle-login').click(function(){
            if(!loginTopPage){
                reg.hide();
                reg.after_hide = function(){
                    location.hash = 'login';
                };
            }else{
                location.hash = 'login';
            }
        });



        //选择性别
        $(cur).find('.sex-label').click(function(){
            $(this).addClass('on').siblings().removeClass('on');
            $(cur).find('#regsex').val($(this).index());
        });

        formRegister.validate({
            rules: {
                telephone: {
                    required: true,
                    mobile: true
                },
                reg_username: {
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
                reg_username: {
                    required: '请输入姓名',
                    minlength: '姓名长度不能少于2位'
                },
                pwd: {
                    required: '请输入密码',
                    minlength: '密码长度不能小于5位'
                }
            }
        });

        $(cur).find('#register_SubmitStatic').click(function(){

            var flag = formRegister.valid();

            if(!flag){
                return;
            }
            var data = {
                mobile: $(cur).find('input[name=telephone]').val(),
                pwd: $(cur).find('input[name=pwd]').val(),
                rName: $(cur).find('input[name=reg_username]').val(),
                birthsolar: birth.dateInfo,
                birthtime: birth.timeInfo,
                igender: $(cur).find('#regsex').val(),
                act : 'reg'
            };

            var mobile_txt = $(cur).find('input[name=telephone]').val();

            $.ajax({
                type:'POST',
                url:'/pop/login',
                data:data,
                success:function(data){
                    switch(data.ret){
                        case 0:Bazi.pop.show({
                            prompt:'注册成功，点击确定激活账户',
                            title:'提示',
                            btn:[
                                {
                                    label:'确定'
                                }
                            ],
                            after_hide:function(){
                                logins.frame.$('#ver-pwd').trigger('focus');
                            }
                        });
                            if(!loginTopPage){
                                reg.after_hide = null;
                                reg.hide();
                            }
                            logins.frame.fadeIn('act','激活账户',function(){
                                yzm_send({
                                    send:false,
                                    text:mobile_txt
                                });
                            });
                            break;
                        case 102:Bazi.pop.show({
                            prompt:'该手机号已注册，尚未激活',
                            title:'提示',
                            btn:[
                                {
                                    label:'确定'
                                }
                            ],
                            after_hide:function(){
                                logins.frame.$('#ver-pwd').trigger('focus');
                            }
                        });

                            if(!loginTopPage){
                                reg.after_hide = null;
                                reg.hide();
                            }else{
                                location.hash = 'login';
                            }
                            logins.frame.fadeIn('act','激活账户',function(){
                                yzm_send({
                                    send:false,
                                    text:mobile_txt
                                });
                            });
                            break;
                        case 103:Bazi.pop.show({
                            prompt:'该手机号已注册',
                            title:'提示',
                            btn:[
                                {
                                    label:'确定'
                                }
                            ]
                        });
                            break;
                        default : Bazi.pop.show({
                            prompt:data.msg,
                            title:'提示',
                            btn:[
                                {
                                    label:'确定'
                                }
                            ]
                        });
                    }
                }
            });

        });
    }
}());



//忘记密码

$('#event_bind_forget').click(function(){
    fadeIn('forget','忘记密码',function(){
        logins.frame.$('#forget-tel').trigger('focus');
    });
});
;(function(){
    var form = $('#form-Forget');
    var form_valiDate = form.validate({
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


    //重置密码按钮
    var resIng = false;
    $('#Forget_Submit').click(function(){
        var flag = form.valid();


        if(!flag){
            return;
        }

        if(resIng){
            return;
        }
        resIng = true;

        var data = {
            act:'resetPwd',
            mobile:form.find('input[name=mobile]').val(),
            code:form.find('input[name=verify-code]').val(),
            pwd:form.find('input[name=pwd]').val()
        };


        $.ajax({
            type:'POST',
            url:'/pop/login',
            data:data,
            complete:function(){
                resIng = false;
            },
            success:function(data){
                if(data.ret !== 0){
                    Bazi.pop.show({
                        prompt:'重置密码失败',
                        title:'提示',
                        after_hide:function(){
                            logins.frame.$('#forget-tel').trigger('focus');
                        }
                    });
                }else{//重置密码成功
                    Bazi.pop.show({
                        prompt:'重置密码成功',
                        title:'提示',
                        after_hide:function(){
                            location.hash = 'login';
                        },
                        timeout:600
                    });
                }
            }
        });


    });

    //获取验证码
    //重新发送验证码
    var cz_active = false;
    var cz_time = 60;
    var hqyzm_click_ing = false;
    $('#Forget_Send').click(function(){
        var mobileInput = $('#forget-tel');
        var result = form_valiDate.element(mobileInput);

        if(!result){
            mobileInput.trigger('focus');
            return;
        }

        if(hqyzm_click_ing === true){
            return;
        }
        hqyzm_click_ing = true;




        $.ajax({
            type:'POST',
            url:'/pop/login',
            data:{
                act:'sendSafetyCode',
                mobile:mobileInput.val()
            },
            complete:function(){hqyzm_click_ing = false},
            success:function(data){
                if(data.ret === 0){


                    if(cz_active === true){
                        return;
                    }

                    cz_active = true;


                    var count = $('#forget-resend-ticker span');
                    (function(){
                        count.text(cz_time).parent().show().prev().hide();
                        setTimeout(function(){
                            var ar = arguments;
                            if(cz_time>=1){
                                cz_time = cz_time-1;
                                count.show().text(cz_time);
                                setTimeout(function(){
                                    ar.callee();
                                },1000);
                            }else{
                                count.text('').parent().hide().prev().show();
                                cz_active = false;
                                cz_time = 60;
                            }
                        },1000)
                    }());

                    Bazi.pop.show({
                        title:'提示',
                        prompt:'发送成功',
                        btn:[
                            {
                                label:'确定'
                            }
                        ],
                        after_hide:function(){
                            logins.frame.$('#login-code').trigger('focus');
                        },
                        timeout:600
                    });
                }else{
                    Bazi.pop.show({
                        title:'提示',
                        prompt:'发送失败',
                        btn:[
                            {
                                label:'确定'
                            }
                        ],
                        after_hide:function(){
                            mobileInput.trigger('focus');
                        },
                        timeout:600
                    });
                }
            }
        });


    })
}());




//登录submit
$('#event_bind_login').click(function(){
    logins.frame.fadeIn('login','登 录',function(){
        logins.frame.$('#login-username').trigger('focus');
    });
});
;(function(){
    var form = $('#form-login');
    form.validate({
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


    $('#login-username,#login-pwd').bind({
        focus:function(event){
            $(this).off('keyup').on('keyup',function(event){
                if(event.keyCode === 13){
                    $('#Login_SubmitStatic').trigger('click');
                }
            });
        },
        blur:function(event){
            $(this).off('keyup');
        }
    });


    var clickIng = false;
    $('#Login_SubmitStatic').click(function(){
        var flag = form.valid();

        if(!flag){
            return;
        }

        if(clickIng === false){
            clickIng = true;
        }

        $.ajax({
            type:'POST',
            url:'/pop/login',
            data:{
                act:'login',
                mobile:form.find('input[name=mobile]').val(),
                pwd:form.find('input[name=pwd]').val()
            },
            complete:function(){
                clickIng = false;
            },
            success:function(data){
                if(data.msg !== '成功'){
                    Bazi.pop.show({
                        prompt:data.msg,
                        title:'提示',
                        after_hide:function(){
                            if(data.msg === '尚未激活'){
                                logins.frame.fadeIn('act','激活账户',function(){
                                    logins.frame.yzm_send({
                                        isShowMsg:false,
                                        text:logins.frame.$('#login-username').val()
                                    });
                                    logins.frame.$('#ver-pwd').trigger('focus');
                                });
                            }else{
                                form.find('input[name=mobile]').trigger('focus');
                            }
                        },
                        timeout:600
                    });
                }else{//登录成功
                    var flag1 = false,flag2 = false,str = '';
                    function writeState(){//仅执行一次，在获得登录成功信息时及时ajax获取用户信息，但需要在登录弹窗关闭后展现
                        if(flag1 === false || flag2 === false){
                            return;
                        }
                        Bazi.getTopWindow().$('#login-state').html(str);
                    }
                    $.ajax({
                        url:'/ajax/loginstate',
                        type:'POST',
                        success:function(data){
                            flag1 = true;
                            str = data;
                            writeState();
                        }
                    });

                    Bazi.pop.show({
                        prompt:'登录成功',
                        title:'提示',
                        after_hide:function(){
                            Bazi.pop.hide();
                            flag2 = true;
                            writeState();
                            if(loginTopPage){
                                location.href = '/';
                            }
                        },
                        timeout:600
                    });
                }
            }
        });
    });
}());



//重新发送验证码
var yzm_active = false;
var yzm_time = 60;

//重新发送验证码
$('#act-resend').click(function(){
    if(yzm_active === true){
        Bazi.pop.show({
            title:'提示',
            prompt:yzm_time+'秒后可重新发送',
            btn:[
                {
                    label:'确定'
                }
            ],
            timeout:600
        });
    }else{
        yzm_send({text:$('.mamber-wrap .mamber-item.act-tips .num').text()});
    }
});


//发送验证码
function yzm_send(option){
    if(yzm_active === true){
        return;
    }

    yzm_active = true;
    $('.mamber-wrap .mamber-item.act-tips .num').text(option.text);
    var count = $('#reserve-time-counter');
    count.parent().show().next().hide();
    (function(){
        count.text(yzm_time).parent().show();
        setTimeout(function(){
            var ar = arguments;
            if(yzm_time>=1){
                yzm_time = yzm_time-1;
                count.show().text(yzm_time);
                setTimeout(function(){
                    ar.callee();
                },1000);
            }else{
                count.parent().hide().next().show();
                yzm_active = false;
                yzm_time = 60;
            }
        },1000)
    }());

    if(option.send === false){
        return;
    }
    $.ajax({
        type:'POST',
        url:'/pop/login',
        data:{
            act:'sendSafetyCode',
            mobile:$('.mamber-wrap .mamber-item.act-tips .num').text()
        },
        success:function(data){
            if(option.isShowMsg === false){
                return;
            }
            if(data.ret === 0){
                Bazi.pop.show({
                    title:'提示',
                    prompt:'发送成功',
                    btn:[
                        {
                            label:'确定'
                        }
                    ],
                    time:600
                });
            }else{
                Bazi.pop.show({
                    title:'提示',
                    prompt:'发送失败',
                    btn:[
                        {
                            label:'确定'
                        }
                    ],
                    time:600
                });
            }
        }
    });
}

//激活帐号
;(function(){
    var form = $('#form-activation');
    form.validate({
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
    $('#activation_SubmitStatic').click(function() {
        var flag = form.valid();

        if (!flag) {
            return;
        }

        $.ajax({
            type: 'POST',
            url: '/pop/login',
            data: {
                act: 'activation',
                mobile: form.find('span.num').text(),
                code: form.find('input[name=ver_pwd]').val()
            },
            success: function (data) {
                if(data.ret === 0){
                    Bazi.pop.show({
                        prompt:'激活成功',
                        btn:[
                            {
                                label:'确定'
                            }
                        ],
                        title:'提示',
                        after_hide:function(){
                            $('#login-username').trigger('focus');
                        },
                        timeout:600
                    });
                    location.hash = 'login';
                    $(window).trigger('hashchange');
                }else if(data.ret === 105){
                    Bazi.pop.show({
                        prompt:'验证码错误',
                        btn:[
                            {
                                label:'确定'
                            }
                        ],
                        title:'提示'
                    })
                }
            }
        })
    })

}());



function hashBind(hash){
    hash = hash || location.hash;
    if(hash.charAt(0) === '#'){
        hash = hash.slice(1);
    }
    switch(hash){
        case 'register':
            $('#event_bind_regsiter').trigger('click');
            break;
        case 'login':
            $('#event_bind_login').trigger('click');
            break;
        case 'forget':
            $('#event_bind_forget').trigger('click');
    }
}



if(window.onhashchange === undefined){//ie7
    (function(){
        var tempHash,curHash;
        function gethash(){
            var hash = location.hash;
            if(hash.length>=1){
                hash = hash.slice(1);
            }
            return hash;
        }
        (function(){
            var ar = arguments;
            curHash = gethash();
            if(curHash === tempHash){
            }else{
                tempHash = curHash;
                hashBind(curHash);
            }
            setTimeout(ar.callee,100);
        }());
    }());
}else{
    $(window).on('hashchange',function(){
        hashBind();
    }).trigger('hashchange');

}
