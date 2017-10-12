var $ = window.$ = Zepto;
require('../css/main.css');
var usersData = require('./users-data.js');
var IndicatorDefault = require('./indicator-data.js');
!('Indicator' in localStorage) && ( localStorage.Indicator = '{}');

var IndicatorData = JSON.parse(localStorage.Indicator);
usersData.forEach(function(item, index){
    if(!(index in IndicatorData)){
        IndicatorData[index] = $.extend(true, IndicatorDefault);
    }
});

localStorage.Indicator = JSON.stringify(IndicatorData)
module.exports = {
    searchObj: UtilFn.parseSearch()
}