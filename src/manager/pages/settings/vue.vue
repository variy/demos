<template>
    <div>
        <h2>
            <p>{{ userName }}</p>
            <img src="" alt="">
            <span>总分：{{total}}</span>
        </h2>
        <ul class="clearfix mar-2">
            <li class="indicator-item" v-for="item in list">
                <label class="indicator-label" :for="item.name">{{ item.txt }}</label>
                <input  v-model="item.value" type="range" name="indicator" :id="item.name" max='10' min='0' step='1'  :value="item.value" @input="change">
                <span>{{ item.value }}</span>
            </li>
        </ul>
    </div>
</template>
<script>
var userList = require('../../js/users-data');
var id = Global.searchObj.id;
var userD = userList[id];

var totalData = JSON.parse(sessionStorage.Indicator);
var useData = totalData[id];
module.exports = {
    data: function() {
        return {
            userName: userD.name,
            list: useData
        }
    },
    created: function() {
        this.change();
    },
    methods: {
        change: function() {
            var total = 0;
            this.list.forEach(function(item) {
                total += Number(item.value);
            });
            this.total = total;

            totalData[id] = this.list;
            sessionStorage.Indicator = JSON.stringify(totalData);
        }
    }
}
</script>