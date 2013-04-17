define(['jquery', './bridge'], function($, Bridge) {
    
    var UPnPURL = "http://www.meethue.com/api/nupnp";
    
    function Hue() {
        this.bridge = null;
        this.bridges = [];
        this.username = null;
        this.devicetype = 'hueJS';
    }
    
    Hue.prototype.setBridge = function(ip) {
        this.bridge = new Bridge(ip);
    }
    
    Hue.prototype.setBridges = function(bridges) {
        console.log(bridges);
        this.bridges = [];
        var that = this;
        $.each(bridges, function(index, bridge) {
            that.bridges.push(new Bridge(bridge.ip));
        });
        console.log(this);
    }
    
    Hue.prototype.getBridges = function() {
        // TODO: API does not support JSONP
        $.getJSON(UPnPURL+"?callback=?", this.setBridges);
    }

    return Hue;
    
});