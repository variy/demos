<?php
define('IN_WEB', true);
include( dirname(__FILE__) . '/../comm.php');

// 调试开关
$debug  = SERVER_TYPE;

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
    <meta name="viewport" content="width=device-width,user-scalable=no,target-densitydpi=device-dpi">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta name="description" content="scale" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="stylesheet" href="css/swiper.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css?<?php echo $cssVer; ?>">
    <script>
    (function (doc, win) {
        // 分辨率Resolution适配
        var docEl = doc.documentElement,
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                var clientHeight = window.innerHeight;
                if (!clientWidth) return;
                docEl.style.fontSize = 100 * (clientWidth /640) + 'px';
                doc.getElementById('viewport').style.height = clientHeight + 'px';
            };
        doc.addEventListener('DOMContentLoaded', recalc, false);

        // 根据devicePixelRatio来修改meta标签的scale
        (function(){
            var scale =1;
            var devicePixelRatio = win.devicePixelRatio;

            scale = 1 / devicePixelRatio;
            var metaEl = "";
            metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            } else {
                var wrap = doc.createElement('div');
                wrap.appendChild(metaEl);
                doc.write(wrap.innerHTML);
            }
        })();
    })(document, window);
</script>

</head>
<body>
    <div class="grid-640 viewport" id="viewport"></div>
    <?php
        require_once "template.html";

        if(!$debug){
    ?>
    <script src="libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="libs/jquery.tap/0.3.1/jquery.tap.js"></script>
    <script src="libs/underscore/1.8.3/underscore.min.js"></script>
    <script src="libs/backbone/1.1.2/backbone.min.js"></script>
    <script src="libs/backbone.touch/0.4.0/backbone.touch.min.js"></script>
    <script src="libs/calendar/0.1.4/LunarCalendar.min.js"></script>
    <script src="libs/swiper/swiper.min.js"></script>
    <script src="libs/iscroll/5.1.3/iscroll.js"></script>
    <script src="libs/iscroll/5.1.3/iscroll-probe.js"></script>
    <script src="libs/boyaa/df.js"></script>

    <?php
        } else {
    ?>
    <script src="libs/jquery/2.1.3/jquery.js"></script>
    <script src="libs/jquery.tap/0.3.1/jquery.tap.js"></script>
    <script src="libs/underscore/1.8.3/underscore.js"></script>
    <script src="libs/backbone/1.1.2/backbone.js"></script>
    <script src="libs/backbone.touch/0.4.0/backbone.touch.js"></script>
    <script src="libs/calendar/0.1.4/LunarCalendar.js"></script>
    <script src="libs/swiper/swiper.min.js"></script>
    <script src="libs/iscroll/5.1.3/iscroll.js"></script>
    <script src="libs/iscroll/5.1.3/iscroll-probe.js"></script>
    <script src="libs/boyaa/df.js"></script>
    <?php
            if(strpos($_SERVER['HTTP_USER_AGENT'], 'BoyaaBazi') !== false ){
    ?>
            <script src="http://jsconsole.com/remote.js?10086"></script>
    <?php
            }
        }
    ?>

    <!-- main js files start -->
    <?php
        if($debug){
            $jsConf = json_encode($conf);
            echo "<script>var Config = $jsConf; </script>";
        }
    ?>
    <script src="js/init.js?<?php echo $jsVer; ?>"></script>
    <script src="js/api.js?<?php echo $jsVer; ?>"></script>
    <script src="js/calendar.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/events.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/index.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/paipan.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/personinfo.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/record.js?<?php echo $jsVer; ?>"></script>
    <script src="js/views/userview.js?<?php echo $jsVer; ?>"></script>
    <script src="js/router.js?<?php echo $jsVer; ?>"></script>

    <!-- main js files end -->
</body>
</html>




