<template>
    <li class="task-item">
        <input type="checkbox" v-model="realDone">
        <p class="task-item-content" @click="editTask(id)">
            <span class="task-item-title">{{ title}}</span>
            <small class="task-item-date">{{ date}} {{ realDone}}</small>
        </p>
        <i class="toright-icon">&gt;</i>
    </li>
</template>
<script>
    module.exports = {
        props: {
            done: Boolean,
            id: String,
            title: String,
            date: String
        },
        data: function(){
            return {
                realDone: false
            }
        },
        created: function(){
            this.realDone = this.done;
        },
        methods: {
            editTask: function(id) {
                location.hash = '!taskedit/' + id;
            }
        }
    }
</script>