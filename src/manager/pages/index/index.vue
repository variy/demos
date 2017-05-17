<template>
    <ul class="clearfix pad-12">
        <template v-for="(item, index) in list">
            <li class="person-item"  @click="jump(index)">
                <a href="javascript:;">
                    <span> {{ item.name }}</span>
                    <img :src="item.img" alt="">
                </a>
            </li>
        </template>
        
    </ul>
</template>
<script>
    var userData = require('../../js/users-data');
    module.exports = {
        data: function() {
            return {
                list: userData
            }
        },
        methods: {
            jump: function(id){
                location.href = './settings.html?id=' + id;
            }
        }
    }
</script>