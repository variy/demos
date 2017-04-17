module.exports = function(express,app){
    var router =   express.Router();


    //首页
    router.get('/',require('./page/home').get);

    //朋友
    router.route('/friends').get(require('./page/friends').get).post(require('./page/friends').post);

    //记录
    router.get('/recordlist',require('./page/recordlist').get);

    router.post('/recordlist',require('./page/recordlist').post);

    //登录页面
    router.get('/login',require('./page/login').get);

    //处理登录
    router.post('/login',require('./page/login').post);

    //退出登录
    router.get('/loginout',require('./page/loginout').get);

    //返回头部个人信息
    router.post('/ajax/loginstate',require('./ajax/loginstate').post);

    //登陆弹窗
    router.route('/pop/login').get(require('./pop/login').get).post(require('./pop/login').post);

    //排盘弹窗
    router.route('/pop/paipan').get(require('./pop/paipan').get).post(require('./pop/paipan').post);

    // 保存、修改记录
    router.route('/pop/record').get(require('./pop/record').get).post(require('./pop/record').post);

    //好友操作
    router.post('/ajax/friends',require('./ajax/friends').post);

    //搜索好友列表
    router.route('/s/:key').get(require('./page/search').get).post(require('./page/search').post);

    //待回应的好友请求列表
    router.get('/response/',require('./page/response').get);

    //已发送的好友请求列表
    router.get('/request/',require('./page/request').get);


    //bug测试
    router.get('/test/',function(req,res){
        res.render('test',{layout:'pop'});
    });


    router.route('/num/').get(require('./num').get).post(require('./num').post);




    //挂载
    app.use('/',router);
};

