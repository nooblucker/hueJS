define(function() {
        
    function Light(id, name, bridge) {
        this.id = id;
        this.name = name;
        this.bridge = bridge;
    }
    
    Light.prototype.setLightState = function(state) {
        $.ajax({
            url: this.bridge.getApiUrl()+'/lights/'+this.id+'/state',
            type: 'PUT',
            data: state,
            complete: function(response) { console.log(response); }
        });
    }
    
    return Light;
    
});