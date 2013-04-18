define(['hue/light'], function(Light) {
        
    function Bridge(ip, username) {
        this.ip = ip;
        this.username = null;
        this.devicetype = 'hueJS';
        this.lights = [];
        
        this.authorize(username);
    }
    
    Bridge.prototype.authorize = function(username) {
        var that = this;
        $.ajax({
            url: this.getBaseApiUrl(),
            type: 'POST',
            data: {
                'devicetype': this.devicetype,
                'username': username
            },
            success: function(response) {
                if (response.length > 0) {
                    if (response[0].error) {
                        // TODO: repeat a few times, so user has time to push button
                        console.log("PUSH THE BUTTON!");
                    }
                    else if (response[0].success) {
                        that.username = response[0].success.username;
                        that.queryLights();
                    }
                }
            },
            complete: function(r) {console.log(r);}
        });
    };
    
    Bridge.prototype.getBaseApiUrl = function() {
        return 'http://'+this.ip+'/api';
    };
    
    Bridge.prototype.getApiUrl = function() {
        return this.getBaseApiUrl()+this.username;
    };
    
    Bridge.prototype.queryLights = function() {
        var that = this;
        $.ajax({
            url: this.getApiUrl()+'/lights',
            type: 'GET',
            success: function(lights) {
                that.lights = [];
                for (var id in lights) {
                    that.lights.push(new Light(id, lights.id.name));
                }
            }
        })
    };
    
    return Bridge;
    
});