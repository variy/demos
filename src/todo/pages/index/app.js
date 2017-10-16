var tpl = require('./tpl.ejs');
var categories = require('./categories');
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
        el: '#left-side-box',
        template: '<categories></categories>',
        components: {
            categories: categories
        }
    })
});