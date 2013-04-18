define(['hue/light', 'hue/request'], function(Light, Request) {

    var ERRORS = {
        unauthorizedUser: 1,
        linkButtonNotPressed: 101
    };
    
    var INTERVAL_RETRY_LINKBUTTON = 2000;
    var AUTHORIZE_FAILCOUNT = 0;
    var MAX_RETRIES = 50;
    var AUTHORIZE_TIMER = null;

    function Bridge(ip) {
        this.ip = ip;
        this.username = localStorage.getItem('username') || '';
        this.devicetype = 'hueJS';
        this.lights = [];
        
        this.authorize(this.username);
    }
    
    Bridge.prototype.authorize = function(username) {
        var req = this.doRequest();
        var that = this;
        req.done(function(response) {
            if (unauthorized(response)) {
                AUTHORIZE_FAILCOUNT = 0;
                alert('please push link button');
                that.createUsername(username);
            } else {
                console.log('hello '+username);
                console.log(response);
            }
        });
        req.fail(function(response) {
            console.log('failbob');
        });
    };
    
    Bridge.prototype.doRequest = function(url, method, body) {
        return new Request({
            url: this.getApiUrl() + (url || ''),
            method: method,
            body: body
        });
    };
    
    function unauthorized(response) {
        return response[0] && response[0].error && response[0].error.type == ERRORS.unauthorizedUser;
    }
    
    function authorized(response) {
        return response[0] && response[0].success;
    }
    
    function linkButtonNotPressed(response) {
        return response[0] && response[0].error && response[0].error.type == ERRORS.linkButtonNotPressed;
    }
    
    Bridge.prototype.createUsername = function(username) {
        var that = this;
        var request = new Request({
            url: this.getBaseApiUrl(),
            method: 'POST',
            body: {
                devicetype: this.devicetype,
                username: username
            }
        });
        request.done(function(response) {
            
            if (linkButtonNotPressed(response)) {
                if (AUTHORIZE_FAILCOUNT++ < MAX_RETRIES) {
                    AUTHORIZE_TIMER = setTimeout(function() {
                        that.createUsername(username);
                    }, INTERVAL_RETRY_LINKBUTTON);
                } else {
                    alert('Could not connect to bridge. Did you press the linkbutton?');
                }
            }
            
            else if (authorized(response)) {
                that.setUsername(response.success.username);
                clearTimeout(AUTHORIZE_TIMER);
            }
            
        });
    };
    
    Bridge.prototype.setUsername = function(username) {
        this.username = username;
        localStorage.setItem('username', username);
    };
        
    Bridge.prototype.getBaseApiUrl = function() {
        return 'http://'+this.ip+'/api';
    };
    
    Bridge.prototype.getApiUrl = function() {
        return this.getBaseApiUrl()+this.username;
    };
        
    return Bridge;
    
});