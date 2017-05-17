var index = require('./index.vue');
Zepto(function(){
    new Vue({
        el: '#container',
        template: '<div id="1"><index></index></div>',
        components: {
            index: index
        }
    })
})