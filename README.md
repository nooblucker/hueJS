# hueJS: a JavaScript library for Philips hue

## Install
Download [requireJS](http://requirejs.org/) and [jQuery](http://jquery.com/) and put the files into a directory `js/lib`.
Then put the hueJS library into `js/lib/hue`. So it should end up in a filestructure like:
```
js/
-lib/
--hue/
---hue.js
---bridge.js
---...
--jquery.js
--require.js
-main.js
index.html
```

## Get started

```javascript
// require jquery and Hue class
requirejs(['lib/jquery', 'lib/hue/hue'], function($, Hue) {

    // create instance of Hue
    window.myHue = new Hue(function(bridges) {
        if (bridges) {
            // hue found local bridges and we can do stuff with the bridges
        } else {
            // no bridges were found, add one manually
            this.addBridge('192.168.1.99');
        }
    });



    

});
```

## Dependencies
* jQuery
* requireJS