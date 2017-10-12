<template>
    <ul class="clearfix pad-12">
        <template v-for="(item, index) in list">
            <li class="person-item"  @click="jump(index)">
                <a href="javascript:;">
                    <span> {{ item.name }} </span>
                    <p> {{ item.total}} </p>
                    <img :src="item.img" alt="">
                </a>
            </li>
        </template>
    </ul>
</template>
<script>
    var userData = require('../../js/users-data');
    var IndicatorData = JSON.parse(localStorage.Indicator);

    module.exports = {
        data: function() {
            var list = userData.map(function(item, index){
                var indicatorItem = IndicatorData[index];
                var total = 0;
                for(var i=0, len = indicatorItem.length; i< len; i++){
                    total += Number(indicatorItem[i].value)
                }
                item.total = total;
                return item;
            });
            // list.sort(function(a, b){
            //     return a.total < b.total;
            // })
            return {
                list: list
            }
        },
        methods: {
            jump: function(id){
                location.href = './settings.html?id=' + id;
            }
        }
    }
</script>