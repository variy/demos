var oneDayMs = 24*60*60*1000; 
module.exports = {
    judgeNearbyDate: function(date){
        var dis = new Date(date).getTime() - new Date().getTime();
        var disDays = dis/oneDayMs;
        if(dis < 0){
            return -1;
        }else if( disDays < 1){
            return 0;
        }else if( disDays < 2){
            return 1;
        }else{
            return 9;
        }
    }
}