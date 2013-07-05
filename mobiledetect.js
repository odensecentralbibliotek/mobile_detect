(function ($) {
  /**
   * Mobile detection
   *
   * Cookie values:
   * 0 = Undecided
   * 1 = Mobile layout (Force mobile optimized site)
   * 2 = Full layout (Force desktop optimized site)
   * 3 = Auto
   **/
  $(document).ready(function () {
    // Only continue if user hasn't forced full layout
    if(Drupal.mobile_detect.get_mobile_cookie() != 2) {
      //detect mobile device
      $.post("/MobileDetect", function (data) {
        Drupal.mobile_detect.MobileDetectObj = $.parseJSON(data);
        if(Drupal.mobile_detect.MobileDetectObj.is_mobile && !Drupal.mobile_detect.MobileDetectObj.is_tablet) {
          // Mobile device, but not a tablet - ask
          if(confirm("Non tablet mobile device detected\nDo you want to continue to the mobile optimized site?")) {
            //force mobile layout & go to mobile site
            Drupal.mobile_detect.set_mobile_cookie(1);
            location.href = "http://moc.fynbib.dk/";
          } else {
            //force full layout
            Drupal.mobile_detect.set_mobile_cookie(2);
          }
        }
      });
    }
  });

  Drupal.mobile_detect = {};

  /**
   * 0 = undecided
   * 1 = mobile layout
   * 2 = full layout
   * 3 = auto
   */
  Drupal.mobile_detect.set_mobile_cookie = function (simpleView) {
    document.cookie = "ShowMobile=" + parseInt(simpleView) + ";";
  }

  Drupal.mobile_detect.get_mobile_cookie = function () {
    var search = 'showMobile=';
    var offset = document.cookie.indexOf(search);
    if (offset < 0) {
      return 0;
    }
    offset += search.length;
    var end = document.cookie.indexOf(';', offset);
    if (end == -1) {
      end = document.cookie.length;
    }
    var value = document.cookie.substring(offset, end);
    return parseInt(value);
  }
})(jQuery);
