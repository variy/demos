var tpl = require('./tpl.ejs');
var taskList = require('./task-list.vue');
var $ = Zepto
Zepto(function(){
    $('#container').html(tpl());
    var leftSideEl = $('#left-side');
    var leftWidth = leftSideEl.width();
    $('#left-side-hide-btn').click(function(){
        leftSideEl.css('width', 0);
    });

    $('#total-menu-btn').click(function(){
        leftSideEl.css('width', leftWidth+'px');
    });

    new Vue({
        el: '#later-task-list',
        template: '<index></index>',
        components: {
            index: taskList
        }
    })
})
// alert(tpl({name: 'world'}))
// debugger;
// Zepto('<div></div>').html(tpl({name: 'world'})).appendTo('body')
