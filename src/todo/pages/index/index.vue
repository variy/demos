<template>
    <div>
        <div class="task-collection-item">
            <h3>以后</h3>
            <div class="task-coll-content">
                <tasklist :list="laterList"></tasklist>
            </div>
        </div>
        
        <div class="task-collection-item">
            <h3>无日期</h3>
            <div class="task-coll-content">
                <tasklist :list="noDateList"></tasklist>
            </div>
        </div>
        
        <div class="task-collection-item">
            <h3>已完成</h3>
            <div class="task-coll-content">
                <tasklist :list="doneList"></tasklist>
            </div>
        </div>
    </div>
</template>
<script>
var j = 0;
    var taskListData = require('../../data/tasks');
    var taskList = require('./task-list');

    module.exports = {
        data: function(){
            return {
                listData: taskListData,
                laterList: [],
                noDateList: [],
                doneList: []
            }
        },
        created: function(){
            var me = this;
            Global.eventHub.$on('toggleDone', function(opt) {
                var index = -1;
                for(var i=0; i< me.listData.length; i++){
                    if(me.listData[i].id === opt.id){
                        index = i;
                        i = me.listData.length;
                    }
                }

                if(index === -1)throw Error('not exit this id' + opt.id);
                var newObj = _.extend(me.listData[index], {done: opt.done});

                Vue.set(me.listData, index, newObj);
                console.warn(++j)
                console.log(JSON.stringify(me.listData))
            });
            this.paramsChange();

        },
        components: {
            tasklist: taskList
        },
        watch: {
            listData: function(){
                this.paramsChange();
            }
        },
        methods: {
            paramsChange: function(){
                this.doneList = this.listData.filter(function(item) {
                    return item.done
                });
                this.noDateList = this.listData.filter(function(item) {
                    return !item.date && !item.done;
                });

                this.laterList = this.listData.filter(function(item) {
                    return item.date && !item.done;
                });
            }
        }
    }
</script>