/**
 * 路径说明：
 * 变量测试 /
**/
var num = 0;
var Local ={

};
Local.num = null;

function format(req){

}

module.exports = {
    get:function(req,res){//谭常文
        var num = 1;
        Local.num = 1;
        res.json({values:Local.num});
    },
    post:function(req,res){//黄
        //isLogin(req)

        res.json({values:Local.num});
    }
};