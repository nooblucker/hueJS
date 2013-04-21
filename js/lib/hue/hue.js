define(['backbone', './bridge'], function(Backbone, Bridge) {

    var Bridges = Backbone.Collection.extend({
        model: Bridge
    });

    return Backbone.Model.extend({
        
        UPnPURL: "http://www.meethue.com/api/nupnp",
        
        initialize: function() {
            this.bridges = new Bridges();
            this.addLocalBridges();
        },
        
        addBridge: function(ip) {
            this.bridges.add(new Bridge({
                ip: ip
            }));
            return this;
        },
        
        addLocalBridges: function() {
            // API does not support JSONP yet ! currently this always .fails
            var that = this;
        
            $.getJSON(this.UPnPURL+"?callback=?")
        
            .done(function(bridges) {
                _.each(bridges, function(bridge) {
                    that.addBridge(bridge.ip);
                });
            })
        
            .fail(function(response) {
                console.log("always failing cause no JSONP");
                _.each([ {ip: '192.168.2.109'} ], function(bridge) {
                    that.addBridge(bridge.ip);
                });
            });
        
            return this;
        }
        
    });
    
});