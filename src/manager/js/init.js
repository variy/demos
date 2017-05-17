window.$ = Zepto;
require('../css/main.css');
var usersData = require('./users-data.js');
var IndicatorDefault = require('./indicator-data.js');
!('Indicator' in sessionStorage) && ( sessionStorage.Indicator = '{}');

var IndicatorData = JSON.parse(sessionStorage.Indicator);
usersData.forEach(function(item, index){
    if(!(index in IndicatorData)){
        IndicatorData[index] = $.extend(true, IndicatorDefault);
    }
});

sessionStorage.Indicator = JSON.stringify(IndicatorData)
module.exports = {
    searchObj: UtilFn.parseSearch()
}