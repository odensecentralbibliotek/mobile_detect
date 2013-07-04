(function ($) {
  /**
   * Mobile detection
   **/
  $(document).ready(function () {
    /*
    if(Drupal.mobile_detect.isMobile()) {
      alert("Your device is mobile and cookie is set to: " + Drupal.mobile_detect.get_mobile_cookie());
      if(Drupal.mobile_detect.get_mobile_cookie() != 2) {
        alert("Redirecting to mobile site");
        Drupal.mobile_detect.set_mobile_cookie(1);
        location.href = "https://www.odensebib.dk";
      }
    }*/
    Drupal.mobile_detect = {};
    $.post("/MobileDetect", function (data) {
      alert("JSON loaded");
      Drupal.mobile_detect.MobileDetectObj = $.parseJSON(data);

      if(Drupal.mobile_detect.MobileDetectObj.is_mobile && !Drupal.mobile_detect.MobileDetectObj.is_tablet) {
        alert("Is mobile, but not tablet\nCookie is set to: " + Drupal.mobile_detect.get_mobile_cookie());
        if(Drupal.mobile_detect.get_mobile_cookie() !=2) {
          alert("Redirecting");
          location.href = "https://moc.fynbib.dk/";
        }
      }
    });

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
  });
})(jQuery);
