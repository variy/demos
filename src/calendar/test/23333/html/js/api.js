/**
 * @name jquery ajax 封装
 * @description
 * @param {String}   API接口参数
 * @param {Function} 成功回调
 * @param {Function} [失败回调]
 * @param {Object}   [扩展参数]
 * @returns {Object}
 */
var getApi = function(params, success, error, options){

        // 动态参数
        if (error && !_.isFunction(error)) {
            options = error;
            error = null;
        }

        // 默认值
        params = _.defaults(params || {}, {
            mkey: User.mkey || ''
        });

        options = _.defaults(options || {}, {
            url: Config.apiUrl,
            dataType: 'jsonp'
        });



        if(window.DF && options.apiType === 'app'){

            console.log('DF.getApi=>', params);
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
                if(d.ret === 0 || (typeof d.ret == 'undefined') ){
                    success(d);
                } else {
                    (error || function(d){
                        console.log('getApi Error ->', d);
                    })(d);
                }
            },
            error: error
        });

    };


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
                lang: Config.lang
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
        },
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
        get: function(d, cb){
            getApi(_.defaults(d, {
                mod:'ievents',
                act:'get'
            }), cb);
        },
        add: function(d, cb){
            getApi(_.defaults(d, {
                mod:'ievents',
                act:'add'
            }), cb);
        },
        del: function(d, cb){
            getApi(_.defaults(d, {
                mod:'ievents',
                act:'del'
            }), cb);
        },
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
        }

    }
};
