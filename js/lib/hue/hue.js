define(['jquery', './bridge'], function($, Bridge) {
    
    var UPnPURL = "http://www.meethue.com/api/nupnp";
    
    function Hue(username) {
        this.username = username;
        this.bridges = [];
    }

    Hue.prototype.addBridge = function(ip) {
        this.bridges.push(new Bridge(ip, this.username));
    };
    
    Hue.prototype.queryBridges = function() {
        // TODO: API does not support JSONP
        $.getJSON(UPnPURL+"?callback=?", function(bridges) {
            console.log(bridges);
        });
    };

    return Hue;
    
});