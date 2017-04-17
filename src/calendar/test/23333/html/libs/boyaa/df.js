(function(doc, win){
  // 判断是否在app里
  if(!/BoyaaBazi/.test(window.navigator.userAgent)){
     return;
  }

  if('df_interface' in win) {
    var DF = win.DF = win.df_interface;
  } else {

    var DF = win.DF = {};

  ;(function(DF) {
      if (win.WebViewJavascriptBridge) { return }
      var messagingIframe;
      var sendMessageQueue = [];

      var CUSTOM_PROTOCOL_SCHEME = 'action';
      var QUEUE_HAS_MESSAGE = 'Send2OC';

      function _createQueueReadyIframe(doc) {
        messagingIframe = doc.createElement('iframe');
        messagingIframe.style.display = 'none';
        doc.documentElement.appendChild(messagingIframe);
      }

      function init(messageHandler) {
        if (WebViewJavascriptBridge._fetchQueue) { throw new Error('WebViewJavascriptBridge.init called twice'); }
      }

      function getData(data) {
        sendMessageQueue.push({data:data});
        messagingIframe.src = CUSTOM_PROTOCOL_SCHEME + '://' + QUEUE_HAS_MESSAGE;
        // console.log('getData:' + JSON.stringify(data));
      }

      function _fetchQueue() {
        var messageQueueString = JSON.stringify(sendMessageQueue);
        sendMessageQueue = [];
        return messageQueueString;
      }

      win.WebViewJavascriptBridge = {
        init: init,
        getData: getData,
        _fetchQueue: _fetchQueue
      };

      _createQueueReadyIframe(doc);
      var readyEvent = doc.createEvent('Events');
      readyEvent.initEvent('WebViewJavascriptBridgeReady');
      readyEvent.bridge = WebViewJavascriptBridge;
      doc.dispatchEvent(readyEvent);

      // DF export
      DF.getData = getData;
    })(DF);
  }

  DF.queueIndex = 0;
  DF.addCallBack = function(options){
        var cb = ('jsonp' + DF.queueIndex++);
        // cb = 'jsonp1234';
        DF[cb] = function(d){
          console.log('DF.callback->', options.data.act + '->', JSON.parse(d.data));

           if(d && d.callback){
              var data = JSON.parse(d.data);
              options.success(data);
              delete DF[d.callback];
           }
        };
        // console.log(cb);
        return cb;
  };

  DF.ajax = function(options){
      var cb = DF.addCallBack(options);
      var postData = {
          data: options.data || {},
          callback: cb
      }
      // 安卓
      if(win.df_interface){
        DF.getData( JSON.stringify(postData) );
      } else {
        DF.getData(postData);
      }

  };

})(document, window);
