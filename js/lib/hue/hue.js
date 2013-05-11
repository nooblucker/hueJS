define(['backbone', './bridge'], function(Backbone, Bridge) {

    var Bridges = Backbone.Collection.extend({
        model: Bridge
    });

    return Backbone.Model.extend({
        
        UPnPURL: "http://www.meethue.com/api/nupnp",
        
        initialize: function() {
            var that = this;
            this.set('bridges', new Bridges());
            this.addLastUsedBridge();
            //this.addLocalBridges();
            this.get('bridges').on('add', function(bridge) {
                bridge.on('connect', function() {
                    localStorage.setItem('bridgeIp', bridge.get('ip'));
                    that.trigger('connect', bridge);
                });
            });
            this.get('bridges').on('remove', function(bridge) {
                bridge.off('connect');
            });
        },
        
        addLastUsedBridge: function() {
            var lastIp = localStorage.getItem('bridgeIp');
            if (lastIp) {
                this.addBridge(lastIp);
            }
        },
        
        addBridge: function(ip) {
            var that = this;
            var bridge = new Bridge({
                ip: ip
            });
            this.get('bridges').add(bridge);
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

            return this;
        }
        
    });
    
});