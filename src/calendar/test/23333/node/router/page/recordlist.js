var isLogin = require('../../isLogin');//判断是否登录
var api = require('../../api');//后端通信
var async = require('async'); //解决请求异步
var _ = require('underscore');
var formatdate = require('../../util/formatdate.js');
var lang = require('../../lang/zh_cn.js');
/**
 * 路径说明
 * 记录 /recordlist
**/
var Local = {};

var Map = function() {
    this.keys = new Array();
    this.data = new Object();

    this.add = function(key, value) {
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    this.get = function(key) {
        return this.data[key];
    };

    this.remove = function(key) {
        this.keys.remove(key);
        this.data[key] = null;
    };

    this.each = function(fn) {
        if (typeof fn != 'function') {
            return;
        }
        var len = this.keys.length;
        for (var i = 0; i < len; i++) {
            var k = this.keys[i];
            fn(k, this.data[k], i);
        }
    };

    this.toArray = function(){
        var arr = [];
        var len = this.keys.length;
        for(var i=0; i<len; i++){
            var v = this.keys[i];
            arr.push(this.data[v]);
        }
        return arr;
    };
};

var recordItemModel = function(opts){
    var obj = {};
    var defaults = {
        udid: 0,
        GanZhiYear: '',
        GanZhiMonth: '',
        GanZhiDay: '',
        GanZhiHour: '',
        name: '未命名',
        sex: '女',
        birthSolarDate: '1980-1-1',
        birthTime: '12:00:00',  
        favicon: '',
        province: '',
        city: '',
        did: '',
        mobile: '',
        profClass: '未分类',
        relClass: '未分类',
        done: false,
        comparable: false
    };

     _.extend(obj, defaults, opts);
    var dateArr = formatdate.parse.DateStrToArr(obj.birthSolarDate);
    var timeArr = formatdate.parse.TimeStrToArr(obj.birthTime);

    var dateInfo = formatdate.get.getDateDataFormSolar({year: dateArr[0], month: dateArr[1], day: dateArr[2], hour: timeArr[0], min: timeArr[1]});
    var solarDateStr = dateArr[0] + '年' + dateArr[1] + '月' + dateArr[2] + '日' + formatdate.parse.toDoubleString(timeArr[0]) + '时' + formatdate.parse.toDoubleString(timeArr[1]) + '分';
    var lunarDateStr = dateInfo.lunarYear + '年' + dateInfo.lunarMonthName + dateInfo.lunarDayName + '&nbsp;' + dateInfo.GanZhiHour.charAt(1) + '时';
    obj.solarDateStr = solarDateStr;
    obj.lunarDateStr = lunarDateStr;
    return obj;
};
module.exports = {
    get: function(req, res) {
        var me = this;
        if (isLogin(req, res) === false) {
            req.session.flash = '请登录';
            res.redirect(303, '/login?by=' + req.url);
            return;
        }
        // res.render('record_list');
        var User = isLogin(req, res)
        
        var Records = [];
        // 关系分类集合
        var RelClasses = Local.RelClasses = new Map;
        // 专业分类集合
        var ProfClasses = Local.ProfClasses = new Map;
        lang.mingju.forEach(function(item) {
            ProfClasses.add(item[0], {
                name: item[1],
                id: item[0],
                level: item[2]
            });
        });
        // 默认未分类
        RelClasses.add('1', {
            name:'未分类',
            id:'1',
            level: '0'
        });

        // 获取分类
        var fetchClasses = function(cb) {
            api({
                mod: 'irelations',
                act: 'get',
                mkey: User.mkey
            }).complete(function(data) {
                // console.log(JSON.stringify(data) )
                if (data.ret !== 0) {
                    res.writeHead(404);
                    res.end('找不到该文件');
                    return;
                }

                try{
                    data.list[0].forEach(function(item) {
                        RelClasses.add(item[0], {
                            name: item[1],
                            id: item[0],
                            level: item[2]
                        });
                    });

                    data.list[1].forEach(function(item, i) {
                        ProfClasses.add(item[0], {
                            name: item[1],
                            id: item[0],
                            level: item[2]
                        });
                    });
                    cb(null);

                }catch(err){
                    cb(err);
                }
                    
                
            });
        };
        // 获取记录
        var fetchRecords = function(cb){
            api({
                mod: 'iudatas',
                act: 'getRecords',
                page: 1,
                ps: 20,
                mkey: User.mkey
            }).complete(function(data){
                if (data.ret !== 0) return;
                try {
                    data.aRecords.forEach(function(item, idx) {
                        var GanZhiArr = [],
                            arr = item[1].split(',');
                        for (var i = 0, len = arr.length; i < len; i += 2) {
                            GanZhiArr.push(lang.tianGan[arr[i]] + lang.diZhi[arr[i + 1]]);
                        };
                        if( RelClasses.get(item[8]) === undefined){
                            console.log( item[8]+ '>>>>>'+JSON.stringify(item)+'分类>>>>>'+ JSON.stringify(RelClasses))
                        }
                        var obj = {
                            udid: item[0],
                            name: item[2],
                            sex: item[3] === "0" ? '男' : '女',
                            birthSolarDate: item[4],
                            birthTime: item[5],
                            favicon: item[6],
                            province: item[9],
                            city: item[10],
                            mobile: item[11],
                            profClass: ProfClasses.get(item[7]).name,
                            // 分类id对应不上，暂时先给个未分类
                            relClassId: item[8],
                            relClass: RelClasses.get(item[8])=== undefined? '未分类': RelClasses.get(item[8]).name,
                            GanZhiYear: GanZhiArr[0],
                            GanZhiMonth: GanZhiArr[1],
                            GanZhiDay: GanZhiArr[2],
                            GanZhiHour: GanZhiArr[3],
                            did: item[12]
                        };

                        var record = recordItemModel(obj);
                        Records.push(record);
                    });
                    cb(null)

                } catch (err) {
                    cb(err);
                }
                
            });

        };

        async.series([function(cb) {
            fetchClasses(cb);

        }, function(cb) {
            fetchRecords(cb)
        }], function(err,result) {
            if (err) {
                console.log(err);
                res.type('text/plain').status(500).send('服务器出错啦!');
                res.end();
                return;
            }

            res.render('recordlist', {
                RelClasses: RelClasses.toArray(),
                ProfClasses: ProfClasses.toArray(),
                recordlist: Records
            });

        })
    },

    post: function(req, res){
        if (isLogin(req, res) === false) {
            req.session.flash = '请登录';
            res.redirect(303, '/login?by=' + req.url);
            return;
        }
        // res.render('record_list');
        var User = isLogin(req, res);
        switch( req.body.act){
            case 'getRecords':
                // 下拉刷新和筛选
                var _data = _.extend({
                    mkey: User.mkey,
                    ps: 20
                }, req.body);
                // console.log(JSON.stringify(_data) );
                api(_data).complete(function(data) {
                    console.log(JSON.stringify(data) )
                    if (data.ret === 0) {
                        // console.log(JSON.stringify(data));
                        var noMore = data.more === 0;
                        // console.log('是否有更多'+noMore);
                        var Records = [];
                        data.aRecords.forEach(function(item, idx) {
                            var GanZhiArr = [],
                                arr = item[1].split(',');
                            for (var i = 0, len = arr.length; i < len; i += 2) {
                                GanZhiArr.push(lang.tianGan[arr[i]] + lang.diZhi[arr[i + 1]]);
                            };
                            if( Local.RelClasses.get(item[8]) === undefined){
                                console.log( item[8]+ '>>>>>'+JSON.stringify(item)+'分类>>>>>'+ JSON.stringify(Local.RelClasses))
                            }
                            var obj = {
                                udid: item[0],
                                name: item[2],
                                sex: item[3] === "0" ? '男' : '女',
                                birthSolarDate: item[4],
                                birthTime: item[5],
                                favicon: item[6],
                                province: item[9],
                                city: item[10],
                                mobile: item[11],
                                profClass: Local.ProfClasses.get(item[7]).name,
                                // 分类id对应不上，暂时先给个未分类
                                relClass: Local.RelClasses.get(item[8])=== undefined? '未分类': Local.RelClasses.get(item[8]).name,
                                GanZhiYear: GanZhiArr[0],
                                GanZhiMonth: GanZhiArr[1],
                                GanZhiDay: GanZhiArr[2],
                                GanZhiHour: GanZhiArr[3],
                                did: item[12]
                            };

                            var record = recordItemModel(obj);
                            Records.push(record);
                        });
                        // console.log(JSON.stringify(Records));
                        res.render('./partials/records', {
                            recordlist: Records,
                            noMore: noMore,
                            layout: null
                        });
                    }

                        
                });

                break;
            case 'add': 
                var _data = _.extend({
                    mod: 'irelations',
                    mkey: User.mkey
                }, req.body);
                // console.log(data);
                api(_data).complete(function(data) {
                    // console.log(JSON.stringify(data) )
                    if (data.ret === 0) {
                        var relItem = {
                            name: _data.relname ,
                            id: data.relation,
                            level: 1
                        }
                        Local.RelClasses.add(relItem);
                        res.json(relItem);
                    }
                });

                break;
            case 'moveRelation': 
                var _data = _.extend({
                    mkey: User.mkey
                }, req.body);
                api(_data).complete(function(data) {
                    if (data.ret === 0) {
                        var relItem = {
                            name: _data.relname ,
                            id: data.relation,
                            level: 1
                        }
                        Local.RelClasses.add(relItem);
                        res.json(relItem);
                    }
                });
                break;

            case 'delRelation':
                var _data = _.extend({
                    mkey: User.mkey
                }, req.body);
                
                api(_data).complete(function(data) {
                   
                    if (data.ret === 0) {
                        res.json(data);
                    }
                });
                break;

            case 'getBase':
                var _data = _.extend({
                    mkey: User.mkey
                }, req.body);

                api(_data).complete(function(data) {

                    res.json(data);
                    
                });
                break;

        }
    }
};