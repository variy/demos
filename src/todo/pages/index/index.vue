<template>
    <div>
        <div id="add-task-area">
            <input type="text" placeholder="添加任务">
            <button type="button">确认</button>
        </div>
        <div class="tasks-area" id="tasks-area">
            <div class="task-collection-item" v-for="item in collection">
                <!--  v-show="collection.length > 1" -->
                <h3>{{ item.txt}}</h3>
                <div class="task-coll-content">
                    <tasklist :list="item.list"></tasklist>
                </div>
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
            Global.eventHub.$on('toggleType', function(type){
                category.toggleType(type)
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