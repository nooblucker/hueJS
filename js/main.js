requirejs.config({
    baseUrl: '../js/lib'
});

requirejs(['jquery', 'hue/hue'], function($, Hue) {
    
    window.myHue = new Hue();
    
    $("#hue-connect").on('submit', function(event) {
        event.preventDefault();
        myHue.setBridge($("#hue-connect input[name='ip']").val());
        myHue.setUsername($("#hue-connect input[name='username']").val());
    });
    
});