// import Vue from 'vue'
var ElementUI = require('element-ui')
require('element-ui/lib/theme-chalk/index.css')

Vue.use(ElementUI);
var o = {
    parseSearch: function(){
        var obj = {};
        if(location.search){
            var arr = decodeURI(location.search).slice(1).split('&');
            for (var i = 0; i < arr.length; i++) {
                var n = arr[i].indexOf('=');
                obj[arr[i].slice(0, n)] = arr[i].slice(n+1);
            };
        }
        return obj;
    }
};
module.exports = o;