module.exports = isLogin;

function isLogin(req,res){
    var obj;
    if(req.signedCookies && req.signedCookies.user){
        try{
            obj = JSON.parse(req.signedCookies.user);//将用户信息从cookie转为对象
        }catch(e){
            res.clearCookie('user');
            obj = false;
        }finally{
            return obj;
        }
    }else{
        return false;
    }
}