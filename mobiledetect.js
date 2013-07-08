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
          var div = "<div id=\"mobile-detect-dialog\" title=\"" + Drupal.t("Go to the mobile site?") + "\">" +
                     '<p>' +
                     Drupal.t("Do you wish a mobile tailored version of the site?") +
                     '</p>' +
                     '</div>';
          $('body').append(div);
          var dialog_yes = Drupal.t("Yes");
          var dialog_no = Drupal.t("No");
          // window width
          var ww = $(window).width();
          // window height
          var wh = $(window).height();
          if (wh > (ww / 2)) {
            wh = ww / 2;
          }
          // font size = window width / 25
          var fs = Math.floor(ww / 25);
          $("#mobile-detect-dialog p").css("line-height", "200%");
          $("#mobile-detect-dialog").css("font-size", fs + "px");
          $("#mobile-detect-dialog i").css("display", "block");
          $("#mobile-detect-dialog").dialog({
            resizable: false,
            height: wh-20,
            width: ww-20,
            modal: true,
            top: 5,
            buttons: [{
              text: dialog_yes,
              click: function() {
                $(this).dialog("close");
                //force mobile layout & go to mobile site
                Drupal.mobile_detect.set_mobile_cookie(1);
                location.href = "http://moc.fynbib.dk/";
              }
            },
            {
              text: dialog_no,
              click: function() {
                $(this).dialog("close");
                //force full layout
                Drupal.mobile_detect.set_mobile_cookie(2);
              }
            }]
          });
          $(".ui-button-text").css("font-size", fs*2 + "px");
          $("#mobile-detect-dialog").parent().css("top", "5px");
          $(".ui-dialog-buttonset").css("white-space", "nowrap");
          var offsetRight = Math.floor ((ww - $(".ui-dialog-buttonset").outerWidth())/2)
          $(".ui-dialog-buttonset").css("marginRight", offsetRight + "px");
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
