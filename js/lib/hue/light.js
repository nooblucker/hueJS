define(function() {
        
    function Light(bridge, id, state, type, name, modelid, swversion, pointsymbol) {
        this.bridge = bridge;
        this.id = id;
        this.state = state;
        this.type = type;
        this.modelid = modelid;
        this.swversion = swversion;
        this.pointsymbol = pointsymbol;
    }
    
    Light.prototype.setName = function(name) {
        var req = this.bridge.doRequest('/lights/'+this.id, 'PUT', { name: name });
        req.done(function(response) {
            console.log(response);
        });
        req.fail(function(response) {
            alert("FFFUUU!!!");
        });
    };

    return Light;
    
});