;(function(){

// 业务 Api 请求
    BAZI.Api = {

        system: {

            // 系统初始化
            ini: function(cb){
                getApi({
                    mod:'system',
                    act:'ini'
                }, cb);
            }
        },

        lang: {
            // 加载语言包
            get: function(cb){
                getApi({
                    mod:'lang',
                    act:'get',
                    lang: BAZI.Config.lang
                }, cb);
            }
        },

        iuaccount: {

            // 注册
            reg: function(d, cb, err){
                getApi(_.defaults(d, {
                    mod:'iuaccount',
                    act:'reg'
                }), cb, err);
            },

            // 登录
            login: function(d, cb, err){
                getApi(_.defaults(d, {
                    mod:'iuaccount',
                    act:'login'
                }), cb, err);
            },

            // 激活
            activation: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'iuaccount',
                    act:'activation'
                }), cb);
            },

            // 发送验证码
            sendSafetyCode: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'iuaccount',
                    act:'sendSafetyCode'
                }), cb);
            },
            // 重置密码
            resetPwd: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'iuaccount',
                    act:'resetPwd'
                }), cb);
            }
        },

        iudatas: {

            // 添加用户信息
            add: function(d, cb, err){
                getApi(_.defaults(d, {
                    mod:'iudatas',
                    act:'add'
                }), cb, err);
            },

            // 编辑用户资料
            edit: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'iudatas',
                    act:'edit'
                }), cb);
            },

            // 获取排盘记录
            getRecords: function(cb){
                getApi({
                    mod:'iudatas',
                    act:'getRecords'
                }, cb);
            }
        },

        paipan: {
            getBase: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'paipan',
                    act:'getBase'
                }), cb, { apiType: 'app' });
            },
            getLiuYear: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'paipan',
                    act:'getLiuYear'
                }), cb, { apiType: 'app' });
            },
            getJie: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'paipan',
                    act:'getJie'
                }), cb, { apiType: 'app' });
            },
            getLiuDays: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'paipan',
                    act:'getLiuDays'
                }), cb, { apiType: 'app' });
            },
            getLiuHours: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'paipan',
                    act:'getLiuHours'
                }), cb, { apiType: 'app' });
            }
        },

        ievents: {
            //得到事件
            get: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'ievents',
                    act:'get'
                }), cb);
            },
            //增加事件
            add: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'ievents',
                    act:'add'
                }), cb);
            },
            //删除事件
            del: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'ievents',
                    act:'del'
                }), cb);
            },
            //匹配标签id
            getLabelId:function(d,cb){
                getApi(_.defaults(d,{
                    mod:'ievents',
                    act:'matchLabel'
                }),cb)
            }
        },

        record: {
            getListTitle: function(d, cb){
                getApi(_.defaults(d||{},{
                    mod: 'irelations',
                    act: 'get'
                }), cb);
            },
            getItem: function(d, cb){
                getApi(_.defaults(d, {
                    mod:'iudatas',
                    act:'getRecords'
                }), cb);
            },
            moveRelation: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'iudatas',
                    act: 'moveRelation'
                }), cb);
            },
            delRelation: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'iudatas',
                    act: 'delRelation'
                }), cb);
            },
            addRelation: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'irelations',
                    act: 'add'
                }), cb);
            },
            addSpecialty: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'irelations',
                    act: 'add'
                }), cb);
            },
            editRecord: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'iudatas',
                    act: 'edit'
                }), cb);
            }
        },

        friend:{
            myfri:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'myfrilist'
                }),cb);
            },
            myfriact:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'myfriactlist'
                }),cb);
            },
            myfribirlist:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'myfribirlist'
                }),cb);
            } ,
            search:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'search'
                }),cb)
            },
            req:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'req'
                }),cb)
            },
            acc:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'acc'
                }),cb)
            },
            del:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'reqdel'
                }),cb)
            },
            rej:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'rej'
                }),cb)
            },
            sendreqlist:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'sendreqlist'
                }),cb)
            },
            reqlist:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'reqlist'
                }) ,cb)
            },
            reqcnt:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'reqcnt'
                }) ,cb)
            },
            fridel:function(d,cb,errcb){
                getApi(_.defaults(d,{
                    mod:'ifriends',
                    act:'fridel'
                }) ,cb)
            }
        },

        discuss: {
            add: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idynamics',
                    act: 'add'
                }), cb);
            },
            getone: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idynamics',
                    act: 'getone'
                }), cb);
            },
            editOne: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idynamics',
                    act: 'modifyone'
                }), cb);
            },
            del: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idynamics',
                    act: 'del'
                }), cb);
            },
            getList: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idynamics',
                    act: 'get'
                }), cb);
            }
        },

        comment: {
            add: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'icomments',
                    act: 'add'
                }), cb);
            },
            getList: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'icomments',
                    act: 'get'
                }), cb);
            },
            del: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'icomments',
                    act: 'del'
                }), cb);
            }
        },

        praise: {
            add: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idianzan',
                    act: 'add'
                }), cb);
            },
            revert: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idianzan',
                    act: 'revert'
                }), cb);
            },
            getList: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'idianzan',
                    act: 'get'
                }), cb);
            }
        },

        liuqin: {
            get: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'iliuqin',
                    act: 'get'
                }), cb);
            },
            add: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'iudatas',
                    act: 'add'
                }), cb);
            },
            del: function(d, cb){
                getApi(_.defaults(d, {
                    mod: 'iliuqin',
                    act: 'del'
                }), cb);
            }
        }
    };


    /**
     * @name jquery ajax 封装
     * @description
     * @param {String}   API接口参数
     * @param {Function} 成功回调
     * @param {Function} [失败回调]
     * @param {Object}   [扩展参数]
     * @returns {Object}
     */
    function getApi(params, success, error, options){

        // 动态参数
        if (error && !_.isFunction(error)) {
            options = error;
            error = null;
        }

        // 默认值
        params = _.defaults(params || {}, {
            mkey: BAZI.User.mkey || ''
        });

        options = _.defaults(options || {}, {
            url: BAZI.Config.apiUrl,
            dataType: 'jsonp'
        });



        if(window.DF && options.apiType === 'app'){
            DF.ajax({
                data: params,
                success: success || function(){}
            });
            return;
        }

        $.ajax({
            type: 'post',
            url: options.url,
            data: params,
            dataType: options.dataType,
            success: function(d){
                // console.log('PC.ApiCallback=>', JSON.stringify(d));
                // - -; 兼容木有 ret 返回值的情况，需与 @奎爷 确认是否统一
                // console.log('getApi data ->', d, success, error);
                if(d.ret === 0 || (typeof d.ret == 'undefined')||d.ret=="0"||d.ret==107 ){
                    success(d);
                } else {
                    (error || function(d){
                    })(d);
                }
            },
            error: error
        });

    };

 //   api = getApi;



}());


