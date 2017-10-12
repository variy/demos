<template>
    <ul class="task-list">
        <task v-for="(task, index) in taskList" :id="task.id" :date="task.date" :title="task.title" :done="task.done" :index="index"></task>
    </ul>
</template>
<script>
    var taskList = require('../../data/tasks.js');
    var taskComp = require('./task-item.vue');
    module.exports = {
        data: function(){
            return {
                taskList: taskList
            }
        },
        components: {
            task: taskComp
        }
    };
</script>