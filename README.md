# hueJS: a JavaScript library for Philips hue

hueJS is a JavaScript library, based on requireJS, Backbone, Underscore and jQuery. 

## Install

All you need is to unzip the `js` folder of hueJS somewhere on your filesystem.
Let's say you have a HTML file `~/index.html` and you installed hueJS into the same directory. Then create a `main.js` file in the existing `~/js` directory. This is the file where you write your javascript code. You can then include `~/js/main.js` in your HTML file via requireJS. 

```
<script data-main="js/main.js" src="js/lib/require.js"></script>
```

A minimal HTML file could look like this:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>my first hue project</title>
    </head>
    <body>
        <!-- content goes here -->
        <script data-main="js/main.js" src="js/lib/require.js"></script>
    </body>
</html>
```

## Get started

```javascript
// ~/js/main.js

// require jquery and Hue class
requirejs(['lib/jquery', 'lib/hue/hue'], function($, Hue) {

    // create instance of Hue
    window.myHue = new Hue();

    // connect to bridge
    myHue.addBridge('192.168.2.109');
    // when the API supports JSONP, Hue will automatically look for bridges in the network

    // if a bridge authorizes the user, the 'connect' event is fired:
    myHue.on('connect', function(bridge) {
        // now we can do stuff with the bridge
        console.log(bridge.get('ip') + ' connected with username ' + bridge.get('username'));
        // for example, turn all lights that belong to the bridge, off!
        // ...
    });

});
```

## Dependencies
* [jQuery](http://jquery.com/)
* [requireJS](http://requirejs.org/)
* [BackboneJS](http://backbonejs.org/)
* [UnderscoreJS](http://underscorejs.org/)