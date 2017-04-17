
var Events = Backbone.View.extend({

    id: 'events',

    events: {
        'click #edittime-btn': 'editTime',
        'click #editlabel-btn': 'editLabel'
    },

    initialize: function(){
        this.render();
        this.init();

        this.eventsData = {};
        this.labelsArr = [];
    },

    init: function(){
        $('#events-label, #events-desc, #input-label').val('');
        $('#edit-content').height(clientHeight - 150*scale);
    },

    render: function(){
        var el = $.tmpl($('#events-templates').html());

        this.$el.append(el);
        $('#viewport').append(this.$el);
        $('#label-content').hide();

        // 填充界面内容
        var info = '<span>'+BAZI.userData.rName+ '</span><span>' +BAZI.lang.solarOrLunar[BAZI.userData.solarOrLunar] + BAZI.lang.gender[BAZI.userData.iGender]  + "</span><span>属" + BAZI.lang.shengXiao[BAZI.userData.shengXiao] + "</span><span>虚岁" + BAZI.userData.vage+'</span>';
        this.$el.find('.user-info').html(info);

        var date = new Date();
        this.dateData = {
            year: date.getFullYear(),
            month: date.getMonth()+1,
            day: date.getDate(),
            hour: date.getHours()
        };
        var dateHtml = this.dateData.year + "年" + this.dateData.month + "月" + this.dateData.day + "日" + this.dateData.hour + "时";
        $('#events-time').html(dateHtml);

        this.setTopbtn('编辑');
    },

    setTopbtn: function(type, cb){
        var me = this;
        var backFunc = function(){};
        var doneFunc = function(){};
        switch(type){
            case '编辑':
                backFunc = function(){
                    me.showPaipan();
                };
                doneFunc = function(){
                    me.submitEvents();
                }; break;
            case '标签':
                if(cb){
                    backFunc = doneFunc = cb;
                };
            default: break;
        };

        $('.a-back').unbind(supportEvent);
        $('.a-back').on(supportEvent, function(){
            backFunc();
        });
        $('.a-done').unbind(supportEvent);
        $('.a-done').on(supportEvent, function(){
            doneFunc();
        });
    },

    showPaipan: function(){
        BAZI.router.paipan(BAZI.userData);
    },

    showEdit: function(type){
        console.log('showEdit', type);
        var me = this;
        $('#edit-content').show();
        $('#label-content').hide();
        this.setTopbtn('编辑');

        $('#events-label').val(me.eventsData.labname);
    },

    editTime: function(){
        var me = this;
        BAZI.Common.showCalendarPop(me.dateData, function(data){
            if(data){
                var dateHtml = data.year + "年" + data.month + "月" + data.day + "日" + data.hour + "时";
                $('#events-time').html(dateHtml);
                me.dateData = {
                    year: data.year,
                    month: data.month,
                    day: data.day,
                    hour: data.hour
                }
                $.extend(me.eventsData, {
                    evdate: data.year + '-' + data.month + '-' + data.day,
                    evtime: data.hour
                });
            }
        });
    },

    editLabel: function(){
        var me = this;

        $('#edit-content').hide();
        $('#label-content').show();
        $('#label-content').height(clientHeight - 150*scale);
        me.setTopbtn('标签', function(){
            $.extend(me.eventsData, {
                labname: $('#input-label').val()
            });
            me.showEdit('done');
        });

        if(!this.labelsArr.length){
            this.labelsArr = BAZI.lang.evlabel;
            this.showCommonLabels();
        }
    },

    showCommonLabels: function(){
        console.log('showCommonLabels');
        var me = this;
        var html = "";
        $.each(me.labelsArr, function(i, obj){
            var li = '<li data-id="' + obj.labid + '">' + obj.labname + '</li>';
            html += li;
        });
        $('#common-label').html(html);

        $('#common-label').find('li').unbind(supportEvent);
        $('#common-label').find('li').on(supportEvent, function(){
            var id = $(this).data.id;
            var label = $(this).html();
            $.extend(me.eventsData, {
                labelid: id,
                labname: label
            });
            $('#input-label').val(label);
        });
    },

    submitEvents: function(){
        var me = this;
        var data = {
            udid: BAZI.userData.udid,
            info: $('#events-desc').val()
        }
        $.extend(me.eventsData, data);

        if(!me.eventsData.evdate || !me.eventsData.evtime){
            $.extend(me.eventsData, {
                evdate: me.dateData.year + '-' + me.dateData.month + '-' + me.dateData.day,
                evtime: me.dateData.hour
            });
        }

        if(!me.eventsData.labname && !me.eventsData.info){
            BAZI.Common.showTips('标签和描述，请至少描述一项~~~');
            return;
        }

        console.log('submitEvents', me.eventsData);
        BAZI.Api.ievents.add(me.eventsData, function(data){
            console.log('ievents----------add', data);
            me.showPaipan();
            if(data.ret === 0){
            }
        });

    }


});
