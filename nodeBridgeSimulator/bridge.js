var express = require("express");
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
};

var whitelist = function(req, res, next) {
    if (req && req.params && req.params.hasOwnProperty('username')) {
        var username = req.params.username;
        if (username !== '' && app.get('usernames').indexOf(username) > -1) {
            req.username = username;
            next();
        }
    }
    res.send(200, [
        {
            error: {
                type: 1,
                address: '/',
                description: 'unauthorized user'
            }
        }
    ]);
};

app.use(express.logger());
app.use(express.static(__dirname + '/public_html'));
app.use(express.bodyParser());
app.use(allowCrossDomain);
app.set('linkbuttonPushed', false);
app.set('usernames', [ "newdeveloper" ]);
app.set('state', {
    "lights": {
        "1": {
            "state": {
                "on": false,
                "bri": 0,
                "hue": 0,
                "sat": 0,
                "xy": [0.0000, 0.0000],
                "ct": 0,
                "alert": "none",
                "effect": "none",
                "colormode": "hs",
                "reachable": true
            },
            "type": "Extended color light",
            "name": "Hue Lamp 1",
            "modelid": "LCT001",
            "swversion": "65003148",
            "pointsymbol": {
                "1": "none",
                "2": "none",
                "3": "none",
                "4": "none",
                "5": "none",
                "6": "none",
                "7": "none",
                "8": "none"
            }
        },
        "2": {
            "state": {
                "on": true,
                "bri": 254,
                "hue": 33536,
                "sat": 144,
                "xy": [0.3460, 0.3568],
                "ct": 201,
                "alert": "none",
                "effect": "none",
                "colormode": "hs",
                "reachable": true
            },
            "type": "Extended color light",
            "name": "Hue Lamp 2",
            "modelid": "LCT001",
            "swversion": "65003148",
            "pointsymbol": {
                "1": "none",
                "2": "none",
                "3": "none",
                "4": "none",
                "5": "none",
                "6": "none",
                "7": "none",
                "8": "none"
            }
        }
    },
    "groups": {
        "1": {
            "action": {
                "on": true,
                "bri": 254,
                "hue": 33536,
                "sat": 144,
                "xy": [0.3460, 0.3568],
                "ct": 201,
                "effect": "none",
                "colormode": "xy"
            },
            "lights": ["1", "2"],
            "name": "Group 1"
        }
    },
    "config": {
        "name": "Philips hue",
        "mac": "00:00:88:00:bb:ee",
        "dhcp": true,
        "ipaddress": "192.168.1.74",
        "netmask": "255.255.255.0",
        "gateway": "192.168.1.254",
        "proxyaddress": "",
        "proxyport": 0,
        "UTC": "2012-10-29T12:00:00",
        "whitelist": {
            "newdeveloper": {
                "last use date": "2012-10-29T12:00:00",
                "create date": "2012-10-29T12:00:00",
                "name": "test user"
            }
        },
        "swversion": "01003372",
        "swupdate": {
            "updatestate": 0,
            "url": "",
            "text": "",
            "notify": false
        },
        "linkbutton": false,
        "portalservices": false
    },
    "schedules": {
        "1": {
            "name": "schedule",
            "description": "",
            "command": {
                "address": "/api/0/groups/0/action",
                "body": {
                    "on": true
                },
                "method": "PUT"
            },
            "time": "2012-10-29T12:00:00"
        }
    }
});

app.get('/', function(req, res) {
    res.redirect(301, 'index.html');
});

app.get('/linkbutton', function(request, response) {
    app.set('linkbuttonPushed', true);
    setTimeout(function() {
        app.set('linkbuttonPushed', false);
    }, 30000);
    response.send(200, "link button pushed. you have 30 seconds to register new usernames");
});

app.get('/api/:username', whitelist, function(request, response) {
    response.send(200, app.get('state'));
});

app.post('/api', function(request, response) {
    var devicetype = request.body.devicetype;
    var username = request.body.username;
    if (username === '') {
        username = "letmegeneratethatforyou";
    }
    if (app.get('linkbuttonPushed')) {
        app.get('usernames').push(username);
        response.send(200, [
            {
                success: {
                    username: username
                }
            }
        ]);
    } else {
        response.send(200, [
            {
                error: {
                    type: 101,
                    address: '',
                    description: 'link button not pressed'
                }
            }
        ]);
    }
});

// Lights API

app.get('/api/:username/lights', whitelist, function(req, res) {
    // get light state
    var lights = app.get('state').lights;
    // only send names of lights
    var result = mapObject(lights, function(light) {
        return selectSubsetFromJSON(light, 'name');
    });
    res.send(200, result);
});

var mapObject = function(obj, fn) {
    var result = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = fn(obj[key]);
        }
    }
    return result;
};

var selectSubsetFromJSON = function(json, keys) {
    var result = {};
    // cast 'keys' to array
    if (typeof keys !== 'object') {
        keys = [ keys ];
    }
    console.log(keys);
    for(var i=0; i < keys.length; i++) {
        result[keys[i]] = json[keys[i]];
    }
    return result;
};

app.get('/api/:username/lights/new', whitelist, function(req, res) {
    res.send(200, {
        "7": {
            "name": "Hue Lamp 7"
        },
        "8": {
            "name": "Hue Lamp 8"
        },
        "lastscan": "2012-10-29T12:00:00"
    });
});

app.post('/api/:username/lights', whitelist, function(req, res) {
    res.send(200, [{"success": {"/lights": "Searching for new devices"}}]);
});

app.get('/api/:username/lights/:id', whitelist, function(req, res) {
    var id = req.params.id;
    res.send(200, app.get('state').lights[id]);
});

app.put('/api/:username/lights/:id', whitelist, function(req, res) {
    var name = req.body.name;
    var id = req.params.id;
    app.get('state').lights[id]["name"] = name;
    var success = {};
    success["/lights/"+id+"/name"] = name;
    res.send(200, [{ "success": success }]);
});

app.put('/api/:username/lights/:id/state', whitelist, function(req, res) {
    var id = req.params.id;
    var response = [];
    
    console.log(req.body);
    
    var state = app.get('state').lights[id].state;
    for (var propertyToBeUpdated in req.body) {
        if (req.body.hasOwnProperty(propertyToBeUpdated)) {
            if (state.hasOwnProperty(propertyToBeUpdated)) {
                var newValue = req.body[propertyToBeUpdated];
                state[propertyToBeUpdated] = newValue;
                // TODO: currently all values are treated as string ! this could lead to bugs and has to be fixed
                var success = {};
                success["/lights/"+id+"state"] = newValue;
                response.push({
                    "success": success
                });
            }
        }
    }

    res.send(200, response);
});

module.exports = app;