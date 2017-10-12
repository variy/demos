var $ = Zepto;
var comp = require('./vue.vue');

$(function(){
    new Vue({
        el: '#container',
        template: '<div id="1"><settings></settings></div>',
        components: {
            settings: comp
        }
    })
})
