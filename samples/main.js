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
    
    $("#hue-connect").on('submit', function(event) {
        event.preventDefault();
        myHue.addBridge($("#hue-connect input[name='ip']").val());
    });
    
});