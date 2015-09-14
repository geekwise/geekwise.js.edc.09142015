document.addEventListener('DOMContentLoaded',function(){
function detect_swipe_events(element_to_detect) {
        
    var createEvent = function (element, event_type) {
        var event_action = element_to_detect.createEvent("CustomEvent");
        event_action.initCustomEvent(event_type, true, true, element.target);
        element.target.dispatchEvent(event_action);
        event_action = null;
        return 1;
      };
    
    
    var mobile_browsers = [
        'iphone',
        'ipad',
        'ipod',
        'android'
    ];
    
    var mobile_browser_name = new RegExp(mobile_browsers.join('|'));


    browser_type_test = function(){
        if(mobile_browser_name.test(navigator.userAgent)){
            return 'touch';
           }
        else{
            return 'mouse';
            }
    };
    
    var browser_type = browser_type_test();

    
    var moved = false;
    var buttonDown = 0;
    var pressedMoveThreshold = 20;
    
    var startdt;
    var endt;
    var startx;
    var starty;
    var endx;
    var endy;
    var xdiff;
    var ydiff;

      calcEventType = function () {
        xdiff = Math.abs(endx - startx);
        ydiff = Math.abs(endy - starty);
        var event_type = Math.max(xdiff, ydiff) > pressedMoveThreshold ?
            (xdiff > ydiff ? (startx > endx ? 'swipe_left' : 'swipe_right') : (starty > endy ? 'swipe_up' : 'swipe_down')) : 'swipe_double_tap';
        return event_type;
      },
      f = {
        touch: {
          touchstart: function (e) {
            startx = e.touches[0].pageX;
            starty = e.touches[0].pageY;
            startdt = Date.now();
            return createEvent(e, 'swipe_tap');
          },
          touchmove: function (e) {
            moved = true;
            endx = e.touches[0].pageX;
            endy = e.touches[0].pageY;
            return 1;
          },
          touchend: function (e) {
            endt = Date.now();
            if (!moved) {
              return createEvent(e, 'swipe_double_tap');
            }
            moved = false;
            return createEvent(e, calcEventType());
          },
          touchcancel: function (e) {
            moved = false;
            return 1;
          }
        },
        mouse: {
          // e.button : left = 0, middle = 1, right = 2 - or left handed reversed.
          mousedown: function (e) {
            if (e.button) {
              return e.button;
            }
            buttonDown = 1; // only left is considered buttonDown
            startx = e.clientX;
            starty = e.clientY;
            startdt = Date.now();
            return createEvent(e, 'swipe_tap');
          },
          mousemove: function (e) {
            if (!buttonDown) {
              return !buttonDown;
            }
            moved = true;
            endx = e.clientX;
            endy = e.clientY;
            return 1;
          },
          mouseup: function (e) {
            endt = Date.now();
            //console.log('Total time: ' + (endt - startdt));
            if (e.button) {
              return e.button;
            }
            buttonDown = 0;
            if (!moved) {
              return createEvent(e, 'swipe_double_tap');
            }
            moved = false;
            return createEvent(e, calcEventType());
          }
        }
      };
  for (var event_name in f[browser_type]) {
    element_to_detect.addEventListener(event_name, f[browser_type][event_name], false);
  }
};

function addAllListeners(element_name) {
    
    
  function swipe_action_to_element(swipe_event) {
    element_to_detect_swipe.innerHTML = swipe_value[swipe_event.type];
  }

    
  var element_to_detect_swipe = document.getElementsByTagName(element_name)[0];
    
    var  swipe_event_type = [
          'swipe_tap',
          'swipe_double_tap',
          'swipe_left',
          'swipe_right',
          'swipe_up',
          'swipe_down'
        ];
  
      var swipe_types = swipe_event_type.length;
  
      var swipe_value = {
        swipe_tap: 'press', // superFastClick very bad name.
        swipe_double_tap: 'tap',
        swipe_left: 'left',
        swipe_right: 'right',
        swipe_up: 'up',
        swipe_down: 'down'
      };
    
  while(swipe_types --){
    element_to_detect_swipe.addEventListener(
        swipe_event_type[swipe_types],
        swipe_action_to_element,
        false)
  };
    
    
  element_to_detect_swipe.addEventListener('touchstart', function (event) {
    event.preventDefault();
  }, false);
}


    
    detect_swipe_events(document);
    addAllListeners('div');

    
});