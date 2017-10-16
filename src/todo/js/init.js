var $ = window.$ = Zepto;
require('../css/main.css');
setTimeout(function(){
    require('../router.js');

},0);
module.exports = {
    searchObj: UtilFn.parseSearch(),
    eventHub: new Vue
}