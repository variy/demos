window.$ = Zepto;
var index = require('./pages/index/index.vue');
var contentEl = Zepto('#main-content-container');
var el = Zepto('<div id="main-content-wrapper"></div>');
Routie({
    '': function(){
        el.appendTo(contentEl.empty());
        new Vue({
            el: '#main-content-wrapper',
            template: '<index></index>',
            components: {
                index: index
            }
        });
    },
    '!taskedit/:id': function(id){
        el.appendTo(contentEl.empty());
        var comp = require('./pages/index/taskedit');
        new Vue({
            el: '#main-content-wrapper',
            template: '<edit></edit>',
            components: {
                edit: comp
            }
        });
    }
})