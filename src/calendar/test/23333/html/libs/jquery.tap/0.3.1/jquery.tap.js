/*
 * https://github.com/wangyanxi/jquery.tap.js
 *
 * Copyright 2013 Yanxi Wang <wangyanxi@guu.me>
 * Released under the MIT license
 */

(function($){

    var supportTouch = 'ontouchstart' in document.documentElement;

    var end = function(e){
        // The target of this event must be the same Element that received the
        // touchstart event when this touch point was placed on the surface,
        // even if the touch point has since moved outside the interactive
        // area of the target element.

        var touch = e.originalEvent.changedTouches[0];
        var el = document.elementFromPoint(touch.clientX, touch.clientY);

        if(el === e.target){
            $(el).trigger('tap');
        }
    };

    // http://learn.jquery.com/events/event-extensions/
    $.event.special.tap = {
        setup: function(){
            $(this).on('touchend', end);
        },

        teardown: function(){
            $(this).off('touchend', end);
        }
    };

    if(!supportTouch){

        $.event.special.tap = {
            bindType: 'click',
            delegateType: 'click'
        };
    }

})(jQuery);


(function($){

    $.fn.tap = function(data, callback){

        if(arguments.length){
            this.on('tap', null, data, callback);
        }else{
            this.trigger('tap');
        }

        return this;
    };
})(jQuery);



