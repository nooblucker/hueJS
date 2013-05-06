requirejs.config({
    baseUrl: '../js/lib',
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

requirejs(['jquery', 'hue/hue'], function($, Hue) {
    
    window.myHue = new Hue();
    
    myHue.addBridge('192.168.2.103');
    
    myHue.on('connect', function(bridge) {
        alert('welcome ' + bridge.get('username') + "@" + bridge.get('ip'));
    });
    
    $("#hue-connect").on('submit', function(event) {
        event.preventDefault();
        myHue.addBridge($("#hue-connect input[name='ip']").val());
    });
    
    var setOn = function(bool) {
        window.myHue.get('bridges').at(0).setOn(bool);
    };
    var switchOn = function() {
        setOn(true);
    };
    var switchOff = function() {
        setOn(false);
    };
    
    $("#command-all-on").on('click', switchOn);
    $("#command-all-off").on('click', switchOff);
    
});