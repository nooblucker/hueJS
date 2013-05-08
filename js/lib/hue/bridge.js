define(['backbone', 'underscore', 'jquery', 'hue/request', 'hue/uuid'], function(Backbone, _, $, Request) {

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

    function createObjectFromPath(pathArray, value) {
        var o;
        if (pathArray.length > 0) {
            var index = pathArray.shift();
            var o = {};
            if (index) {
                o[index] = createObjectFromPath(pathArray, value);
            } else {
                o = createObjectFromPath(pathArray, value);
            }
        } else {
            o = value;
        }
        return o;
    }

    return Backbone.Model.extend({
        getFullState: function() {
            return this.doRequest();
        },
        setGroupState: function(groupId, state) {
            var req = this.doRequest('/groups/' + groupId + '/action', 'PUT', state);
            var that = this;
            req.done(function() {
                that.getAllLightState.call(that);
            });
            return req;
        },
        setLightState: function(lightId, state) {
            return this.doRequest('/lights/' + lightId + '/state', 'PUT', state);
        },
        getLightState: function(lightId) {
            var that = this;
            var req = this.doRequest('/lights/' + lightId);
            req.done(function(light) {
                that.get('data').lights[lightId] = light;
                that.trigger('change:data', that);
            });
            return req;
        },
        getAllLightState: function() {
            var that = this;
            _.each(that.get('data').lights, function(light, lightId) {
                that.getLightState.call(that, lightId);
            });
        },
        devicetype: 'hueJS',
        defaults: {
            ip: '',
            username: ''
        },
        initialize: function() {
            this.set('username', localStorage.getItem('username') || '');
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
                    that.set('data', response);
                    that.trigger('connect', that);
                }
            });
            req.fail(function(response) {
                console.log(response);
            });
        },
        doRequest: function(url, method, body) {
            var that = this;
            var req = new Request({
                url: this.getApiUrl() + (url || ''),
                method: method,
                body: body
            }).send();
            req.done(function(response) {
                that.processResponse.call(that, response);
            });
            return req;
        },
        processResponse: function(response) {
            console.log(response);
            var that = this;
            _.each(response, function(res) {
                if (res.success) {
                    _.each(res.success, function(value, path) {
                        var parts = path.split('/');
                        var changeObj = createObjectFromPath(parts, value);
                        var oldData = that.get('data');
                        var newData = $.extend(true, oldData, changeObj);
                        that.set('data', newData);
                        that.trigger('change:data', that);
                    });
                }
            });
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
                            that.trigger('requestlinkbutton', that);
                        }
                        AUTHORIZE_TIMER = setTimeout(function() {
                            that.createUsername(username);
                        }, INTERVAL_RETRY_LINKBUTTON);
                    } else {
                        that.trigger('linkbuttonNotPressed', that);
                    }
                }

                else if (authorized(response)) {
                    that.set('username', response[0].success.username);
                    that.authorize();
                    clearTimeout(AUTHORIZE_TIMER);
                }

            });
        },
        getApiUrl: function() {
            var user = this.get('username') !== '' ? '/' + this.get('username') : '';
            return this.getBaseApiUrl() + user;
        },
        getBaseApiUrl: function() {
            return 'http://' + this.get('ip') + '/api';
        }

    });

});