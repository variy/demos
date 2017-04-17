(function (doc, win) {
    // 全局命名空间
    win.BAZI = {
        //html字符串模板
        tpls:{},
        // 功能view
        FN_Views: {},
        //Views构造器
        Views : {},

        //view实例
        views :{},

        //Collection实例
        Collections :{},

        //Models集合
        Models: {},

        // model实例
        models: {},

        //路由控制
        Routers:{},

        //配置信息
        Config:{},

        //用户信息
        User:{},

        //公共方法
        Common:{},

        //dialog提示
        Dialog:{},

        //日历控件
        Calendar:{},

        //api请求
        api:{},

        //数据缓存
        Data:{}
    };

    BAZI.User = {
        isLogin: false,
        isComplete: false
    };

    var PageStatusModel = Backbone.Model.extend({
        defaults: {
            isLogin: false,//默认null，根据BAZI.User.isLogin设定true或false，以触发header view的监听
            isComplete: false
        }
    });
    BAZI.models.pageStatus = new PageStatusModel;



    //用户信息
    if(sessionStorage.User){
        BAZI.User = JSON.parse(sessionStorage.User);
    }


    //设置 pageStatus 状态
    if( BAZI.User.isLogin ){
        BAZI.models.pageStatus.set({isLogin: true});
    }

    //配置信息
    BAZI.Config = _.defaults(BAZI.Config || {}, {
        lang: "zh_cn",
        debug: 0
    });

    //数据缓存
    BAZI.Data = {
        provinceData: ["北京", "上海", "天津", "重庆", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "广西", "海南", "四川", "贵州", "云南", "西藏", "陕西", "甘肃", "宁夏", "青海", "新疆", "香港", "澳门", "台湾", "其它"],
        cityData: [
            "东城|西城|崇文|宣武|朝阳|丰台|石景山|海淀|门头沟|房山|通州|顺义|昌平|大兴|平谷|怀柔|密云|延庆",
            "黄浦|卢湾|徐汇|长宁|静安|普陀|闸北|虹口|杨浦|闵行|宝山|嘉定|浦东|金山|松江|青浦|南汇|奉贤|崇明",
            "和平|东丽|河东|西青|河西|津南|南开|北辰|河北|武清|红挢|塘沽|汉沽|大港|宁河|静海|宝坻|蓟县",
            "万州|涪陵|渝中|大渡口|江北|沙坪坝|九龙坡|南岸|北碚|万盛|双挢|渝北|巴南|黔江|长寿|綦江|潼南|铜梁|大足|荣昌|壁山|梁平|城口|丰都|垫江|武隆|忠县|开县|云阳|奉节|巫山|巫溪|石柱|秀山|酉阳|彭水|江津|合川|永川|南川",
            "石家庄|邯郸|邢台|保定|张家口|承德|廊坊|唐山|秦皇岛|沧州|衡水",
            "太原|大同|阳泉|长治|晋城|朔州|吕梁|忻州|晋中|临汾|运城",
            "呼和浩特|包头|乌海|赤峰|呼伦贝尔盟|阿拉善盟|哲里木盟|兴安盟|乌兰察布盟|锡林郭勒盟|巴彦淖尔盟|伊克昭盟",
            "沈阳|大连|鞍山|抚顺|本溪|丹东|锦州|营口|阜新|辽阳|盘锦|铁岭|朝阳|葫芦岛",
            "长春|吉林|四平|辽源|通化|白山|松原|白城|延边",
            "哈尔滨|齐齐哈尔|牡丹江|佳木斯|大庆|绥化|鹤岗|鸡西|黑河|双鸭山|伊春|七台河|大兴安岭",
            "南京|镇江|苏州|南通|扬州|盐城|徐州|连云港|常州|无锡|宿迁|泰州|淮安",
            "杭州|宁波|温州|嘉兴|湖州|绍兴|金华|衢州|舟山|台州|丽水",
            "合肥|芜湖|蚌埠|马鞍山|淮北|铜陵|安庆|黄山|滁州|宿州|池州|淮南|巢湖|阜阳|六安|宣城|亳州",
            "福州|厦门|莆田|三明|泉州|漳州|南平|龙岩|宁德",
            "南昌市|景德镇|九江|鹰潭|萍乡|新馀|赣州|吉安|宜春|抚州|上饶",
            "济南|青岛|淄博|枣庄|东营|烟台|潍坊|济宁|泰安|威海|日照|莱芜|临沂|德州|聊城|滨州|菏泽",
            "郑州|开封|洛阳|平顶山|安阳|鹤壁|新乡|焦作|濮阳|许昌|漯河|三门峡|南阳|商丘|信阳|周口|驻马店|济源",
            "武汉|宜昌|荆州|襄樊|黄石|荆门|黄冈|十堰|恩施|潜江|天门|仙桃|随州|咸宁|孝感|鄂州",
            "长沙|常德|株洲|湘潭|衡阳|岳阳|邵阳|益阳|娄底|怀化|郴州|永州|湘西|张家界",
            "广州|深圳|珠海|汕头|东莞|中山|佛山|韶关|江门|湛江|茂名|肇庆|惠州|梅州|汕尾|河源|阳江|清远|潮州|揭阳|云浮",
            "南宁|柳州|桂林|梧州|北海|防城港|钦州|贵港|玉林|南宁地区|柳州地区|贺州|百色|河池",
            "海口|三亚",
            "成都|绵阳|德阳|自贡|攀枝花|广元|内江|乐山|南充|宜宾|广安|达川|雅安|眉山|甘孜|凉山|泸州",
            "贵阳|六盘水|遵义|安顺|铜仁|黔西南|毕节|黔东南|黔南",
            "昆明|大理|曲靖|玉溪|昭通|楚雄|红河|文山|思茅|西双版纳|保山|德宏|丽江|怒江|迪庆|临沧",
            "拉萨|日喀则|山南|林芝|昌都|阿里|那曲",
            "西安|宝鸡|咸阳|铜川|渭南|延安|榆林|汉中|安康|商洛",
            "兰州|嘉峪关|金昌|白银|天水|酒泉|张掖|武威|定西|陇南|平凉|庆阳|临夏|甘南",
            "银川|石嘴山|吴忠|固原",
            "西宁|海东|海南|海北|黄南|玉树|果洛|海西",
            "乌鲁木齐|石河子|克拉玛依|伊犁|巴音郭勒|昌吉|克孜勒苏柯尔克孜|博尔塔拉|吐鲁番|哈密|喀什|和田|阿克苏",
            "",
            "",
            "台北|高雄|台中|台南|屏东|南投|云林|新竹|彰化|苗栗|嘉义|花莲|桃园|宜兰|基隆|台东|金门|马祖|澎湖",
            "北美洲|南美洲|亚洲|非洲|欧洲|大洋洲"
        ]
    };
    
    BAZI.Global = {};
    BAZI.Global.zindex = 99;
        // 公用方法
    BAZI.Common = {

        isObjectValueEqual: function(a, b){
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);

            if (aProps.length != bProps.length) {
                return false;
            }

            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        },

        formatStoN: function(str){
            if(!str){ return; }
            var arrData = str.split('');
            var html = "";
            $.each(arrData, function(i, num){
                if(num > 0){
                    html += num;
                }
            });
            return html;
        },

        setLunarYearName: function(year){
            var lunarNum = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
            var arr = (year+'').split(''),
                str = '';

            arr.forEach(function(num){
                str += lunarNum[parseInt(num)];
            });

            return str;
        },

        setBirthday: function(aBirthday, type){
            var html = '';
            if( aBirthday === undefined){
                var aBirthday = {y:1980,m:1,d:1,h:12,min:0}
            }
            if(type == "solar"){
                html += aBirthday.y+'年'+  aBirthday.m+'月' + aBirthday.d+'日'+ aBirthday.h+'时'+ aBirthday.min+'分';
            }else if(type == "lunar"){
                var zhiHour = BAZI.utilities.zhiHour[parseInt(aBirthday.h)];
                var lunarInfo =  LunarCalendar.calendar(aBirthday.y, aBirthday.m,false).monthData[aBirthday.d-1];
                html += BAZI.Common.setLunarYearName(lunarInfo.lunarYear)+'年'+  lunarInfo.lunarMonthName + lunarInfo.lunarDayName +'&nbsp;'+ zhiHour +'时';
            }

            return html;
        },

        getMingjuVal: function(id){
            for (var i = 0,len = BAZI.lang.mingju.length; i < len; i++) {
                if( BAZI.lang.mingju[i][0] === parseInt(id) ){
                    return BAZI.lang.mingju[i][1];
                }
            };
            throw new Error('没有这个id的命局！')
            
        },
        getBirthdayStr: function(dateArr, isLunar){
            var html = '';
            if( isLunar === undefined){
                isLunar = true;
            }
            if(isLunar){
                html += dateArr[0] +'年'+  dateArr[1] +'月' + dateArr[2] +'日'+ dateArr[3] +'时'+ dateArr[4] +'分';
            }else{
                var zhiHour = BAZI.utilities.zhiHour[parseInt(dateArr[3])];
                var lunarInfo =  LunarCalendar.calendar(dateArr[0], dateArr[1],false).monthData[dateArr[2]-1];
                html = BAZI.Common.setLunarYearName(lunarInfo.lunarYear)+'年'+  lunarInfo.lunarMonthName + lunarInfo.lunarDayName +'&nbsp;'+ zhiHour +'时';
            }

            return html;
        },
        transUnixTimeToDateStr: function(unix){
            var date = new Date( parseInt(unix)*1000 );
            return (date.getMonth()+1) +'月'+ date.getDate() + '日 '+ this.fotmatNum( date.getHours() )+':'+ this.fotmatNum( date.getMinutes() );
        },
        setLuck: function(aStartLuck){
            var html = '';
            html += "出生后 " + aStartLuck.y + " 年 " + aStartLuck.m + " 个月 " + aStartLuck.d + " 天 起运";
            return html;
        },
        getCurTimeStr: function(){
            var date = new Date;
            return (date.getMonth()+1) +'月'+ date.getDate() + '日 '+ this.fotmatNum( date.getHours() )+':'+ this.fotmatNum( date.getMinutes() );
        },    
        showMyInfo: function(){
            var data = {
                sDate: BAZI.User.birthsolar,
                sTime: BAZI.User.birthtime,
                iGender: BAZI.User.igender,
                rName: BAZI.User.rname,
                fromRecord: false
            };
            $.extend(BAZI.userData, BAZI.User);
            new BAZI.Views.Paipan(data);
        },

        showUserInfo: function(){

        },

        formatDate: function(data,type){

            var fotmatNum =  function(num){
                var html = '';
                if(num < 10){
                    html = '0' + num;
                }else{
                    html += num;
                }
                return html;
            };

            var html = '';
            switch (type){
                case 'date':
                    html = data.year + '-' + fotmatNum(data.month) + '-' + fotmatNum(data.day);
                    break;
                case 'time':
                    html = fotmatNum(data.hour) + ':' +fotmatNum(data.min) + ':' + fotmatNum(data.second);
                    break;
                default: break;
            }
            return html;
        },

        fotmatNum: function(num) {
            var html = '';
            if (num < 10) {
                html = '0' + num;
            } else {
                html += num;
            }
            return html;
        },

        formatDateData: function(year,month,day){
            return year + '-' + this.fotmatNum(month) + '-' + this.fotmatNum(day);
        },
        formatTimeData: function(hour,min,second){
            return this.fotmatNum(hour) + ':' + this.fotmatNum(min) + ':' + this.fotmatNum(second);
        },
        addClassify: function(opts) {
            var settings = {
                recordsData: [],
                beforeOpenBtnClick: function(){
                    return true;
                },
                onaddclassify: function(){

                },
                onmoveclassify: function(cid){

                },
                validateNew: function(val) {
                    addForm.validate({
                        rules: {
                            add_classify: {
                                required: true,
                                minlength: 2,
                                maxlength: 10
                            }
                        },
                        messages: {
                            add_classify: {
                                required: '请输入新分类名称',
                                minlength: '分类名称长度不能少于2位'
                            }
                        }
                    });
                }
            };

            $.extend(settings, opts);

            var oBox = settings.oBox;
            var html = _.template(BAZI.tpls.tpls_plugins_handle_classify)({
                recordList: settings.recordsData
            });
            oBox.html(html);

            var dropdownEl = oBox.find('.dropdown');
            var oList = oBox.find('.dropdown-menu');
            var dropdownBtn = oBox.find('.dropdown-toggle');

            var addBtn = oBox.find('[data-type=add]');
            var addForm = oBox.find('form');
            var addInput = addBtn.find('input');
            var addTips = addBtn.find('p');

            dropdownBtn.click(function() {
                if( settings.beforeOpenBtnClick() ){
                    dropdownEl.addClass('open');
                }   
            });

            oList.delegate('li', 'click', function(event) {
                if ($(this).data('type') === 'add') {
                    $(this).find('p').hide().siblings().show();
                }else{
                    addInput.val('').parent('form').hide().siblings('p').html('+ 新的分类').show();
                    if(  $(this).attr('showbtn') === undefined ||  $(this).attr('showbtn') === '0' ){
                        oList.find('button').remove();
                        oList.find('[showbtn=1]').attr('showbtn', '0');
                        $(this).attr('showbtn', '1' );

                        var confirmBtn = $('<button class="btn-xs btn btn-primary fn-right">确认</button>');
                        var txt = $(this).find('a').text();
                        var cid = $(this).data('id');
                        $(this).find('a').append(confirmBtn);

                        confirmBtn.click(function(e){
                            dropdownEl.removeClass('open');
                            settings.onmoveclassify(cid, txt);
                            e.stopPropagation();
                        });
                    }
                        
                }

            });
            settings.validateNew();
            addInput.keydown(function(e) {
                if (e.keyCode === 13) {
                    
                    addForm.valid();
                    if( addForm.validate().form()){
                        settings.onaddclassify(addInput.val(), addBtn);
                        addInput.val('').parent('form').hide().siblings('p').html('+ 新的分类').show();
                    }
                        
                }
            });

            $('body').click(function(e) {

                if (oList.is(":visible")) {

                    function has(obj1, obj2 ){
                        if( obj1 === document.body)return false;
                        if( obj1 === obj2) {
                            return true;
                        }else{
                            obj1 = obj1.parentNode;
                            return has(obj1, obj2);
                        } 
                    };
                    if ( !has( e.target, oBox[0]) ) {
                        dropdownEl.removeClass('open');
                        addTips.show().siblings().hide();
                    }
                }

            });

            return {
                listEl: oList
            }
        }
    };

    // 模板快捷方式，（顺便兼容新版 undescore模板）
    $.tmpl = function(html, data){
        if(data){
            return _.template(html)(data);
        } else {
            return _.template(html);
        }
    };

    // 添加一些验证方法
    $.validator.addMethod("mobile", function(value) {
        var regMobile = /^0?(13[0-9]|15[0-9]|18[0-9]|14[57])[0-9]{8}$/;
        return regMobile.test(value);
    }, '手机号码格式不正确');
    $.validator.setDefaults({
        errorPlacement: function(error, element) {
            if (element[0]['type'] == 'checkbox' || element[0]['type'] == 'radio') {
                // error.appendTo($(element).parent().siblings('.error-tip'));
            } else {
                error.addClass('error-tips').insertBefore( $(element) );
            }
        },
        success: function(label, element) {
           $(label).remove(); 
        }

    });


})(document, window);
