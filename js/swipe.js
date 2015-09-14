document.addEventListener('DOMContentLoaded',function(){
function detect_swipe_events(element_to_detect) {
        
    var swipe_event = function (element, event_type) {
        var event_action = element_to_detect.createEvent("CustomEvent");
        event_action.initCustomEvent(event_type, true, true, element.target);
        element.target.dispatchEvent(event_action);
        event_action = null;
        return true;
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

    
    var swipe_active = false;
    var mouse_button_down = 0;
    var swipe_move_threshold = 20;
    
    var swipe_start_tap;
    var swipe_tap_end;
    var swipe_start_x;
    var swipe_start_y;
    var swipe_end_x;
    var swipe_end_y;
    var swipe_x_difference;
    var swipe_y_difference;

      swipe_event_type = function () {
        swipe_x_difference = Math.abs(swipe_end_x - swipe_start_x);
        swipe_y_difference = Math.abs(swipe_end_y - swipe_start_y);
        var event_type = Math.max(swipe_x_difference, swipe_y_difference) > swipe_move_threshold ?
            (swipe_x_difference > swipe_y_difference ? (swipe_start_x > swipe_end_x ? 'swipe_left' : 'swipe_right') : (swipe_start_y > swipe_end_y ? 'swipe_up' : 'swipe_down')) : 'swipe_double_tap';
        return event_type;
      };
    
    
    var swipe_object = new Object();
    
    swipe_object = {
        touch: {
          touch_start: function (event) {
            swipe_start_x = event.touches[0].pageX;
            swipe_start_y = event.touches[0].pageY;
            swipe_start_tap = Date.now();
            return swipe_event(event, 'swipe_tap');
          },
          touch_move: function (event) {
            swipe_active = true;
            swipe_end_x = event.touches[0].pageX;
            swipe_end_y = event.touches[0].pageY;
            return 1;
          },
          touchend: function (event) {
            swipe_tap_end = Date.now();
            if (!swipe_active) {
              return swipe_event(e, 'swipe_double_tap');
            }
            swipe_active = false;
            return swipe_event(e, swipe_event_type());
          },
          touchcancel: function (event) {
            swipe_active = false;
            return 1;
          }
        },
        mouse: {
          // event.button : left = 0, middle = 1, right = 2 - or left handed reversed.
          mousedown: function (event) {
            if (event.button) {
              return event.button;
            }
            mouse_button_down = 1; // only left is considered mouse_button_down
            swipe_start_x = event.clientX;
            swipe_start_y = event.clientY;
            swipe_start_tap = Date.now();
            return swipe_event(event, 'swipe_tap');
          },
          mousemove: function (event) {
            if (!mouse_button_down) {
              return !mouse_button_down;
            }
            swipe_active = true;
            swipe_end_x = event.clientX;
            swipe_end_y = event.clientY;
            return 1;
          },
          mouseup: function (event) {
            swipe_tap_end = Date.now();
            //console.log('Total time: ' + (swipe_tap_end - swipe_start_tap));
            if (event.button) {
              return event.button;
            }
            mouse_button_down = 0;
            if (!swipe_active) {
              return swipe_event(event, 'swipe_double_tap');
            }
            swipe_active = false;
            return swipe_event(event, swipe_event_type());
          }
        }
      };
  for (var event_name in swipe_object[browser_type]) {
    element_to_detect.addEventListener(event_name, swipe_object[browser_type][event_name], false);
  }
};

function add_mobile_event_listners(element_name) {
    
    
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
    
    
  element_to_detect_swipe.addEventListener('touch_start', function (event) {
    event.preventDefault();
  }, false);
}


    
    detect_swipe_events(document);
    add_mobile_event_listners('div');

    
});