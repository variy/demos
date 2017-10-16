<template>
    <div>
                <!-- 
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
 -->
        <div class="task-collection-item" v-for="item in collection">
            <!--  v-show="collection.length > 1" -->
            <h3>{{ item.txt}}</h3>
            <div class="task-coll-content">
                <tasklist :list="item.list"></tasklist>
            </div>
        </div>
    </div>
</template>
<script>
    
    var taskList = require('./task-list');
    var category = require('../../models/categories');
    module.exports = {
        data: function(){
            return {
                collection: category.listData
            }
        },
        created: function(){
            var me = this;
            Global.eventHub.$on('filterToday', function(opt){
                category.toggleType('today')
                me.paramsChange();
                
            });


            Global.eventHub.$on('toggleDone', function(opt) {
                category.initData(opt.id, opt);
                me.paramsChange();
                // var index = -1;
                // for(var i=0; i< me.listData.length; i++){
                //     if(me.listData[i].id === opt.id){
                //         index = i;
                //         i = me.listData.length;
                //     }
                // }

                // if(index === -1)throw Error('not exit this id' + opt.id);
                // var newObj = _.extend(me.listData[index], {done: opt.done});

                // Vue.set(me.listData, index, newObj);
                // console.log(JSON.stringify(me.listData))
            });
            // 

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
            paramsChange: function() {
                this.collection = category.listData;
            }
        }
    }
</script>