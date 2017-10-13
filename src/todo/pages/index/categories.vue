<template>
    <div id="left-side">
        <div class="static-menu-list">
            <ul>
                <li><i class="all-icon"></i>所有</li>
                <li @click="filterToday"><i class="all-icon"></i>{{ today.txt}}</li>
                <li><i class="all-icon"></i>{{ lastDays7.txt}}</li>
                <li><i class="all-icon"></i>收集箱</li>
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
                'today': {
                    txt: '今天',
                    filter: function(list){
                        list.filter(function(item){
                            return PowerFn.judgeNearbyDate(item.data) === 0;
                        })
                        
                    }
                },
                'lastDays7': {
                    txt: '过去7天',
                    filter: function(list){
                        list.filter(function(item){
                            return PowerFn.judgeNearbyDate(item.data) === 0;
                        })
                        
                    }
                },
            }
        },
        methods: {
            filterToday: function(){
                Global.eventHub.$emit('filterToday', this.today)
            }
        }
    }
</script>