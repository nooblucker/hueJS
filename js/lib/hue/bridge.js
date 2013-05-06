define(['backbone', 'hue/light', 'hue/request', 'hue/uuid'], function(Backbone, Light, Request) {

    var ERRORS = {
        unauthorizedUser: 1,
        linkButtonNotPressed: 101
    };
    
    var INTERVAL_RETRY_LINKBUTTON = 2000;
    var AUTHORIZE_FAILCOUNT = 0;
    var MAX_RETRIES = 15;
    var AUTHORIZE_TIMER = null;
    
    function unauthorized(response) {
        return response[0] && response[0].error && response[0].error.type === ERRORS.unauthorizedUser;
    }
    
    function authorized(response) {
        return response[0] && response[0].success;
    }
    
    function linkButtonNotPressed(response) {
        return response[0] && response[0].error && response[0].error.type === ERRORS.linkButtonNotPressed;
    }
    
    var Lights = Backbone.Collection.extend({
        model: Light
    });
    
    return Backbone.Model.extend({
        
        setOn: function(bool) {
            var req = this.doRequest('/groups/0/action', 'PUT', {
                on: bool
            });
            req.done(function() {
                alert('lights on? '+bool);
            });
        },
        
        devicetype: 'hueJS',
        
        defaults: {
            ip: '',
            username: ''
        },
        
        initialize: function() {
            this.set('username', localStorage.getItem('username') || '');
            this.set('lights', new Lights());
            this.authorize();
            this.on('change:username', function(obj, username) {
                localStorage.setItem('username', username);
            });
        },
        
        authorize: function() {
            if (this.get('username') === '') {
                this.createUsername(Math.uuid(10));
                return;
            }
            var req = this.doRequest();
            var that = this;
            req.done(function(response) {
                if (unauthorized(response)) {
                    AUTHORIZE_FAILCOUNT = 0;
                    that.createUsername(that.get('username'));
                } else {
                    that.set(response);
                    that.trigger('connect');
                }
            });
            req.fail(function(response) {
                console.log(response);
            });
        },
        
        doRequest: function(url, method, body) {
            return new Request({
                url: this.getApiUrl() + (url || ''),
                method: method,
                body: body
            }).send();
        },
        
        createUsername: function(username) {
            var that = this;
            var request = new Request({
                url: this.getBaseApiUrl(),
                method: 'POST',
                body: {
                    "devicetype": this.devicetype,
                    "username": username
                }
            });
            request.send().done(function(response) {
            
                if (linkButtonNotPressed(response)) {
                    if (AUTHORIZE_FAILCOUNT++ < MAX_RETRIES) {
                        if (AUTHORIZE_FAILCOUNT === 1) {
                            alert('please push link button');
                        }
                        AUTHORIZE_TIMER = setTimeout(function() {
                            that.createUsername(username);
                        }, INTERVAL_RETRY_LINKBUTTON);
                    } else {
                        alert('Could not connect to bridge. Did you press the linkbutton?');
                    }
                }
            
                else if (authorized(response)) {
                    that.set('username', response[0].success.username);
                    that.trigger('connect');
                    clearTimeout(AUTHORIZE_TIMER);
                }
            
            });
        },
        
        getApiUrl: function() {
            var user = this.get('username') !== '' ? '/'+this.get('username') : '';
            return this.getBaseApiUrl()+user;
        },
        
        getBaseApiUrl: function() {
            return 'http://'+this.get('ip')+'/api';
        }
        
    });
    
});