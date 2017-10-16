var $ = window.$ = Zepto;
require('../css/main.css');
setTimeout(function(){
    require('../router.js');

}, 3000);
module.exports = {
    searchObj: UtilFn.parseSearch(),
    eventHub: new Vue
}