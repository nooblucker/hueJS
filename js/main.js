requirejs.config({
    baseUrl: '../js/lib'
});

requirejs(['jquery', 'hue/hue'], function($, Hue) {
    
    window.myHue = new Hue();
    
    $("#hue-ip").on('submit', function(event) {
        event.preventDefault();
        myHue.setBridge($("#hue-ip input").val());
    });
    
});