requirejs.config({
    baseUrl: '../js/lib'
});

requirejs(['jquery', 'hue/hue'], function($, Hue) {
    
    window.myHue = new Hue();
    
    $("#hue-connect").on('submit', function(event) {
        event.preventDefault();
        myHue.addBridge($("#hue-connect input[name='ip']").val());
    });
    
});