<template>
    <div id="left-side">
        <div class="static-menu-list">
            <ul>
                <li v-for="item in list" @click="toggleType(item.type), active_tab = item.type" :class="active_tab=== item.type ? 'active': ''">{{ item.txt}}</li>
            </ul> 
        </div>
        <div id="customization-menu-list">
            
        </div>
        <div id="fn-men-list">
            <ul>
                <li>已完成</li>
                <li>垃圾桶</li>
            </ul>
        </div>
        <button type="button" id="left-side-hide-btn">收起</button>
    </div>
</template>
<script>
    var oneDayMs = 24*60*60*1000; 
    module.exports = {
        data: function(){
            return {
                list: [
                    { type: 'all', txt: '所有'},
                    { type: 'today', txt: '今天'},
                    { type: 'tomorrow', txt: '明天'},
                    { type: 'lastDays7', txt: '最近7天'}
                ],
                active_tab: 'all'
            }
        },
        methods: {
            toggleType: function(type){
                Global.eventHub.$emit('toggleType', type || 'all');
            }
        }
    }
</script>