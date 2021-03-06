var system = require("sdk/system");
var Request = require("sdk/request").Request;
var URL = require("sdk/url").URL;
var Notifications = require("sdk/notifications");
var self = require("sdk/self");
var icon = self.data.url("heartbleed-64.png");
var prefs = require("sdk/simple-prefs");
require("sdk/tabs").on("ready", checkBleed);

// Australis changes addon-sdk UI API
// See https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/ui
// https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/widget
var isAustralis = require("sdk/system/xul-app")
                    .versionInRange(system.version, "29.0");


var ui = isAustralis ? require("./australis.js") : require("./ui.js");
var isActive = prefs.prefs.enabled;

prefs.on("enabled", function(prefName) {
  isActive = prefs.prefs[prefName];
});

var server = "http://bleed-1161785939.us-east-1.elb.amazonaws.com/bleed/";
var vulnerable = {};

function notify(domain) {
    Notifications.notify({
      title: 'This site is vulnerable!',
      text: 'The domain ' + domain + ' is vulnerable to the Heartbleed SSL bug.',
      iconURL: icon,
    });
}

function checkBleed(tab) {
  if (!isActive) {
    return;
  }

  try {
    var url = URL(tab.url);
    var domain = url.host;
    
    // only check https tabs
    if (url.scheme !== "https") {
      return;
    }

    if (vulnerable[domain] === true) {
      notify(domain);
    } else if (vulnerable[domain] === undefined) {
      Request({
        url: server + domain,
        overrideMimeType: "application/json",
        onComplete: function(response) {
         switch (response.json.code) {
           // vulnerable
           case 0:
             vulnerable[domain] = true; 
             notify(domain); 
             break;
           // not vulnerable
           case 1:
             vulnerable[domain] = false; 
             break;
           // error, ignore
           default:
             break;
         }
        }
      }).get();
    }
  } catch (e) {
    console.log(e);
  }
}
