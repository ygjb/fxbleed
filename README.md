Based off Jamie Hoyle's ChromeBleed extension
https://chrome.google.com/webstore/detail/chromebleed/eeoekjnjgppnaegdjbcafdggilajhpic

The extension uses Filippo Valsorda's API endpoint from
http://filippo.io/Heartbleed/

## FAQ

### How do I can I enable / disable the add-on?

The add-on is disabled by default and can be toggled by clicking the icon in the add-on bar. A red-dot signifies that scanning is disabled. The HeartBleed icon signifies that scanning is enabled.

### How does the add-on work?

When you visit a HTTPS site, the add-on will send a request to Filippo Valsorda's API endpoint. The hostname + port (if applicable) are sent. The result is then cached in a JS object. Future visits to the same hostname + port will result in the cached value being returned. Exiting Firefox clears this cache 

### What happens when I visit a vulnerable site?

A Firefox notification is generated and displayed on your desktop informing you of the vulnerable domain.

### What information does the add-on store?

The add-on contains a preference to track its enabled/disabled state. Nothing else is persisted to disk
