<?php
define('IN_WEB', true);
include( dirname(__FILE__) . '/../comm.php');

// 调试开关
$debug  = in_array(SERVER_TYPE, array('vm','demo','test')) ? 1 : 0;//开发 测试环境打开

$jsVer  = oo::$config['jsVer'];
$cssVer = oo::$config['cssVer'];

// 输出配置
$conf = Array(
        'apiUrl' => oo::$config['apiUrl'], //本地需修改 可参加 config/ini.php
        'debug' => $debug
);


?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>博雅八字</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="renderer" content="webkit">
    <!--[if lt IE 9]>
      <script src="//cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link rel="stylesheet" type="text/css" href="css/common.css?<?php echo $jsVer; ?>">
    <link rel="stylesheet" type="text/css" href="css/page.css?<?php echo $jsVer; ?>">
</head>
<body>
    <script>
        //全局变量检测
        var oldGlobal = {};
        var myGlobal = [];
        for(var i in window){
            oldGlobal[i] = true;
        }
    </script>
    <div class="viewport" id="viewport"></div>
    <?php
        if(!$debug){
    ?>
    <script src="libs/jquery/1.9.0/jquery.min.js"></script>
    <script src="libs/underscore/1.8.3/underscore.min.js"></script>
    <script src="libs/backbone/1.1.2/backbone.min.js"></script>
    <script src="libs/calendar/0.1.4/LunarCalendar.min.js"></script>
    <script src="libs/validate/1.13.1/jquery.validate.min.js"></script>
    <!--[if lt IE 8]>
        <script src="libs/json2.js"></script>
    <![endif]-->


    <?php
        } else {
    ?>
    <script src="libs/jquery/1.9.0/jquery.js"></script>
    <script src="libs/underscore/1.8.3/underscore.js"></script>
    <script src="libs/backbone/1.1.2/backbone.js"></script>
    <script src="libs/calendar/0.1.4/LunarCalendar.js"></script>
    <script src="libs/validate/1.13.1/jquery.validate.js"></script>
    <!--[if lt IE 8]>
        <script src="libs/json2.js?<?php echo $jsVer; ?>"></script>
    <![endif]-->
    <?php
        }
    ?>


    
    <!--[if lt IE 8]>
        <script src="js/init/html5-methods.js?<?php echo $jsVer; ?>"></script>
    <![endif]-->
    
    <script src="js/init/init.js?<?php echo $jsVer; ?>"></script>
    <?php
    if($debug){
        $jsConf = json_encode($conf);
        echo "<script>BAZI.Config = $jsConf; </script>";
    }
    ?>

    
    <script src="js/init/loader.js?<?php echo $jsVer; ?>"></script>
    <script src="js/tpls.js?<?php echo $jsVer; ?>"></script>
    <script src="js/init/api.js?<?php echo $jsVer; ?>"></script>
    <script src="js/util/dialog.js?<?php echo $jsVer; ?>"></script>
    <script src="js/util/utilities.js?<?php echo $jsVer; ?>"></script>
    <script src="js/util/calendar.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/header.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/right-side-nav.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/right-side-recommend.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/user-bazi.js?<?php echo $jsVer; ?>"></script>
    
    <script src="js/views/discussion.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/index.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/paipan.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/record.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/comparison.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/recordList.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/friends.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/search.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/request.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/userview.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/toprequest.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/account.js?<?php echo $jsVer; ?>"></script>
    <script src="js/router.js?<?php echo $jsVer; ?>"></script>
    <script src="js/app.js?<?php echo $jsVer; ?>"></script>
    <!-- main js files end -->
    <script>
        //全局变量检测
        for(var i in window){
            if(oldGlobal[i] || ['_','Backbone','$','jQuery','LunarCalendar'].indexOf(i) !== -1){
                continue;
            }
            myGlobal.push(i);
        }
        myGlobal.sort();
        if(window.console){
            console.log('除去类库的全局变量');
            console.log(myGlobal);
            console.log('共'+myGlobal.length+'个');
        }
    </script>
</body>
</html>




