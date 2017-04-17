
var linePointMap = {
    '1': '3',
    '3': '1',
    '2': '4',
    '4': '2'
};

var PowerFn = {
    signTurn: function(sign, times){
        var lineSign = sign.slice(1);
        var lineLen = lineSign.length;
        var realTimes = times%lineLen;
        
        var  i = 0;
        while(i < realTimes){
            lineSign = lineSign.slice(-1) + lineSign.slice(0, -1);
            i++;
        }
        return sign[0] + lineSign;
    },
    getBatteryIndex: function(list){
        for (var i = 0, len=list.length; i < len; i++) {
            if( (list[i].sign)[0] === 'B'){
                return i;
            }
        };
        throw Error("can't find battery's index")
    },

    getLightIndexs: function(list){
        var arr = [];
        list.forEach(function(item, i){
            if(item.sign[0] === 'A'){
                arr.push(i);
            }
        });
        return arr;
    },
    getLightLen: function(list){
        var i = 0;
        list.forEach(function(item){
            if(item.sign[0] === 'A'){
                i++;
            }
        });
        return i;
    },
    getConnectedLines: function(map, col, batteryIndex){

        var gridCount = map.length;
        var successLineArr = [];
        var connectedLineArr = [];
        var digui=0;
        var fnArr = [];

        getNextGrid(batteryIndex, 0, [])
        function getNextGrid(pos, fromDir, prevSigns){
            digui++;
            var sign = map[pos].turnSign;
            var matchDir = '';

            if( fromDir !== 0){
                matchDir = linePointMap[fromDir];
                if( sign[matchDir] !== '1'){
                    connectedLineArr.push(prevSigns);
                    return false
                };
            }
            
            if( sign[0] === 'A'){
                prevSigns.push({pos: pos, line: matchDir});
                successLineArr.push(prevSigns);
            }

            for (var i = 1, len=sign.length; i < len; i++) {
                if (sign[i] === '1' && i !== Number(matchDir)) {
                    // if(connectPointCount === 1){
                    //  prevSigns.splice(prevSigns.length-1, 1);
                    // }
                    if (i === 1) {
                        var prevSigns1 = prevSigns.slice();

                        prevSigns1.push({
                            pos: pos,
                            line: matchDir + '' + i
                        });
                        if (pos >= col) {
                            fnArr.push(function(){
                                getNextGrid(pos - col, 1, prevSigns1);
                            })
                        }else{
                            connectedLineArr.push(prevSigns1);
                        }

                    } else if (i === 2) {
                        var prevSigns1 = prevSigns.slice();

                        prevSigns1.push({
                            pos: pos,
                            line: matchDir + '' + i
                        });
                        if ((pos + 1) % col !== 0 ) {
                            fnArr.push(function(){
                                getNextGrid(pos + 1, 2, prevSigns1);
                            })
                        }else{
                            connectedLineArr.push(prevSigns1);
                        }

                    } else if (i === 3) {
                        var prevSigns1 = prevSigns.slice();

                        prevSigns1.push({
                            pos: pos,
                            line: matchDir + '' + i
                        });
                        if (pos + col < gridCount) {
                            fnArr.push(function(){
                                getNextGrid(pos + col, 3, prevSigns1);
                            })
                            
                        }else{
                            connectedLineArr.push(prevSigns1);
                        }

                    } else if (i === 4) {
                        var prevSigns1 = prevSigns.slice();
                        // connectPointCount++;

                        prevSigns1.push({
                            pos: pos,
                            line: matchDir + '' + i
                        });
                        if(pos%col !== 0){
                            fnArr.push(function(){
                                getNextGrid(pos - 1, 4, prevSigns1);
                            })
                        }else{
                            connectedLineArr.push(prevSigns1);
                        }
                        // if () {
                        //     // console.log( 'pos>>>' + pos);

                            
                        // }

                    }
                }

            };

            return false;
        };

        while(fnArr.length >0 ){
            (fnArr.splice(0, 1)[0])();
        }
        if(digui > 20){
            console.warn('递归计算了'+digui+'次');

        }else{
            console.log('递归计算了'+digui+'次');

        }
        // 转化成连接起来的点
        var gridObj = {},
            gridArr = [];
        var getConnectedGrids = function(lines) {
            for(var i=0, len=lines.length; i< len; i++){
                for(var j=0, inLen=lines[i].length; j < inLen; j++){
                    var item = lines[i][j];
                    if( !(item.pos in gridObj)){
                        gridObj[item.pos] = '1';
                    }
                }
            }
        }
        getConnectedGrids(connectedLineArr);
        getConnectedGrids(successLineArr);

        for(var attr in gridObj){
            gridArr.push(Number(attr));
        }
        return {
            successLen: successLineArr.length,
            gridArr: gridArr
        };    
    }
}