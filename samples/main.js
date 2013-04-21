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
    
    myHue.addBridge('192.168.2.109');
    
    myHue.on('connect', function(bridge) {
        console.log(bridge.get('ip') + ' connected with username ' + bridge.get('username'));
    });
    
    $("#hue-connect").on('submit', function(event) {
        event.preventDefault();
        myHue.addBridge($("#hue-connect input[name='ip']").val());
    });
    
});