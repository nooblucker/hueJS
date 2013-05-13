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

requirejs(['jquery', 'hue/hue', 'underscore', 'backbone', 'hue-color-converter'], function($, Hue, _, Backbone, ColorConverter) {

    var hue = new Hue();

    window.hue = hue;

    var BridgeView = Backbone.View.extend({
        tagName: "li",
        template: _.template($('#bridge-template').html()),
        events: {
            "click .all-on": "allOn",
            "click .all-off": "allOff",
            "click .toggleOnOff": "toggleOnOff",
            "change .color": "setHSV",
            "click .disconnect": "disconnect",
            "change .hue": "setHueBriSat",
            "change .bri": "setHueBriSat",
            "change .sat": "setHueBriSat"
        },
        disconnect: function() {
            hue.get('bridges').remove(this.model);
            this.remove();
        },
        allOn: function() {
            this.model.setGroupState(0, {on: true});
        },
        allOff: function() {
            this.model.setGroupState(0, {on: false});
        },
        toggleOnOff: function(e) {
            var lightId = $(e.target).parents('.light').attr('data-id');
            this.model.setLightState(lightId, {on: !this.model.get('data').lights[lightId].state.on});
        },
        hexToColorState: function(hexString, modelId) {
            var xyb = ColorConverter.hexStringToXyBri(hexString);
            var color = ColorConverter.xyBriForModel(xyb, modelId);
            return {bri: Math.round(255 * color.bri), xy: [color.x, color.y]}
        },
        setHSV: function(e) {
            var lightId = $(e.target).parents('.light').attr('data-id');
            var hexString = $(e.target).val().replace('#', '');
            var modelId = this.model.get('data').lights[lightId].modelid;
            this.model.setLightState(lightId, this.hexToColorState(hexString, modelId));
        },
        setHueBriSat: function(e) {
            var $light = $(e.target).parents('.light');
            var lightId = $light.attr('data-id');
            var hue = $light.find('.hue').val();
            var bri = $light.find('.bri').val();
            var sat = $light.find('.sat').val();
            this.model.setLightState(lightId, { 
                "hue" : parseInt(hue, 10),
                "bri" : parseInt(bri, 10),
                "sat" : parseInt(sat, 10)
            });
        },
        initialize: function() {
            this.listenTo(this.model, 'requestlinkbutton', this.requestLinkbutton);
            this.listenTo(this.model, 'connect', this.render);
            this.listenTo(this.model, 'change:data', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },
        requestLinkbutton: function() {
            alert('Please press linkbutton');
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });


    var AppView = Backbone.View.extend({
        el: $("#app"),
        initialize: function() {
            this.listenTo(hue.get('bridges'), 'connect', this.addOne);
            this.listenTo(hue.get('bridges'), 'requestlinkbutton', this.requestlinkbutton);
            this.listenTo(hue.get('bridges'), 'all', this.render);
            this.bridges = $("#bridges");
        },
        render: function() {
            if (hue.get('bridges').length) {
                $("#bridgelist").removeClass("no-bridges-connected");
            } else {
                $("#bridgelist").addClass("no-bridges-connected");
            }
        },
        requestlinkbutton: function() {
            alert('please press the linkbutton on your bridge to authorize this device');
        },
        addOne: function(bridge) {
            var view = new BridgeView({model: bridge});
            this.bridges.append(view.render().el);
        }
    });

    var app = new AppView();

    $("#hue-connect").on("submit", function(e) {
        hue.addBridge($(this).find("input").val());
        e.preventDefault();
    });

});