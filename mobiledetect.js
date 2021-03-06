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
    // Only continue if user hasn't forced full or mobile layout
    if(Drupal.mobile_detect.get_mobile_cookie() == 1) {
      if(document.referrer.indexOf(Drupal.settings.mobile_detect.mobile_redirect_url) > -1) {
        Drupal.mobile_detect.set_mobile_cookie(2);
      }
      else {
        location.href = Drupal.settings.mobile_detect.mobile_redirect_url;
      }
    }
    else if(Drupal.mobile_detect.get_mobile_cookie() == 0) {
      //detect mobile device
      $.post("/MobileDetect", function (data) {
        Drupal.mobile_detect.MobileDetectObj = $.parseJSON(data);
        if(Drupal.mobile_detect.MobileDetectObj.is_mobile) {
          // Mobile device, but not a tablet - ask
          var div = "<div id=\"mobile-detect-dialog\" title=\"" + Drupal.t("Go to the mobile site?") + "\"></div>";
          $('body').append(div);
          var dialog_yes = Drupal.t("Yes");
          var dialog_no = Drupal.t("No");
          // window width
          var ww = $(window).width();
          // window height
          var wh = $(window).height();
          var aspect_ratio = ww / wh;
     
          //scrolbar width
          var sw = Drupal.mobile_detect.scrollbar_width();
          $("#mobile-detect-dialog p").css("line-height", "200%");
          $("#mobile-detect-dialog").css("font-size", "200%");
          $("#mobile-detect-dialog i").css("display", "block");
          var dialog = $("#mobile-detect-dialog").dialog({
            resizable: false,
            height: 0,
            width: ww-20,
            modal: true,
            top: 5,
            buttons: [{
              text: dialog_yes,
              click: function() {
                $(this).dialog("close");
                //force mobile layout & go to mobile site
                Drupal.mobile_detect.set_mobile_cookie(1);
                location.href = Drupal.settings.mobile_detect.mobile_redirect_url;
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
          $("#mobile-detect-dialog").parent().css("top", "5px");
          dialog.parent().find(".ui-button-text").css("font-size", Math.floor(ww/8)+"px");
          //Dialog titlebar
          dialog.parent().find(".ui-dialog-titlebar").css("height", "auto");
          dialog.parent().find(".ui-dialog-titlebar").css("padding-top", "5%");
          dialog.parent().find(".ui-dialog-titlebar").css("padding-bottom", "5%");
          dialog.parent().find(".ui-dialog-titlebar").css("background-color", "#fff");
          dialog.parent().find(".ui-widget-header").css("background-image", "none");
          dialog.parent().find(".ui-widget-header").css("color", "#fff");
          dialog.parent().find(".ui-widget-header").css("background-color", "#222");
          dialog.parent().find(".ui-dialog-buttonpane").css("border", "0");
          
         dialog.parent().find("#ui-dialog-title-mobile-detect-dialog").css("background-color", "transparent!important");
          dialog.parent().find("#ui-dialog-title-mobile-detect-dialog").css("font-size", Math.floor(ww/20)+"px");
          dialog.parent().find("#ui-dialog-title-mobile-detect-dialog").css("display", "block");
          dialog.parent().find("#ui-dialog-title-mobile-detect-dialog").css("padding", "20px");
          dialog.parent().find("#ui-dialog-title-mobile-detect-dialog").css("clear", "both");
          
            var mobile_dialog_font_fix = jQuery('div[aria-describedby="mobile-detect-dialog"]').find('.ui-dialog-title');
            if(mobile_dialog_font_fix !== undefined)
            {
                mobile_dialog_font_fix.css('font-size','49px');
                mobile_dialog_font_fix.css('display','block');
                mobile_dialog_font_fix.css('padding','20px');
                mobile_dialog_font_fix.css('clear','both');
            }

          //Close icon size and position
          //Switches from jquery ui to font awesome
          var icon_size = 32;
          var $icon = dialog.parent().find(".ui-icon-closethick");
          var $a = dialog.parent().find(".ui-dialog-titlebar-close");

          $icon.attr("class", "");
          $icon.addClass("icon-remove");
          $icon.css("overflow", "hidden");
          $icon.css("color", "#fff");
          $icon.css("text-decoration", "none");
          $icon.html("");
          $icon.css("font-size",  + icon_size + "px");
          $icon.width(icon_size-2);
          $a.width(icon_size-4);
          $icon.height(icon_size-2);
          $a.height(icon_size-4);
          $icon.css("margin-top", "-2px");
          $a.css("margin-top", "-" + (icon_size/2) + "px");
          $icon.attr("title", Drupal.t("Close"));

          // Yes/no buttons position & size
          dialog.parent().find(".ui-dialog-buttonset button").css("float", "none");
          dialog.parent().find(".ui-dialog-buttonset").css("white-space", "nowrap");
          var bs = dialog.parent().find(".ui-dialog-buttonset").outerWidth();
          var offsetRight = Math.floor ((ww - bs - sw)/2) - 20;
          //alert("Width: " + ww + ", buttonset: " + bs + ", scrollbar width: " + sw + " calc: " + offsetRight);
          dialog.parent().find(".ui-dialog-buttonset").css("margin-right", offsetRight + "px");
          // titlebar height
          var uidt = dialog.parent().find(".ui-dialog-titlebar").outerHeight();
          // button pane height
          var bph = dialog.parent().find(".ui-dialog-buttonpane").outerHeight();
          // dialog height - title bar height
          var dlh = (wh / 2) - uidt;
          // uses padding to make even space top and bottom
          var mgh = Math.floor(dlh/2);
          $("#mobile-detect-dialog").height(0);
          $("#mobile-detect-dialog").css("padding","0");
          $("#mobile-detect-dialog").css("margin","0");
          dialog.parent().find(".ui-dialog-buttonpane").css("padding-bottom", mgh + "px");
          dialog.parent().find(".ui-dialog-buttonpane").css("padding-top", mgh + "px");
          console.log ("uidt: "+uidt +"\nDLH: "+dlh+"\nbph: "+bph+"\nmgh: "+mgh);
        }
      });
    }
  });

  Drupal.mobile_detect = {};

  /**
   * calculates scrollbar width
   * Makes a dummy box, calculates sccrollbar width, then removes the dummy
   */
  Drupal.mobile_detect.scrollbar_width = function () {
    var div = $('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div>');
    // Append our div, do our calculation and then remove it
    $('body').append(div);
    var w1 = $('div', div).innerWidth();
    div.css('overflow-y', 'scroll');
    var w2 = $('div', div).innerWidth();
    $(div).remove();
    return (w1 - w2);
  }

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
    var search = 'ShowMobile=';
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
