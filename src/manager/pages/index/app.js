var tpl = require('./tpl.ejs');
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
alert(tpl({name: 'world'}))
debugger;
Zepto('<div></div>').html(tpl({name: 'world'})).appendTo('body')
