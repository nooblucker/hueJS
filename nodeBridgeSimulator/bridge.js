var express = require("express");
var app = express();
app.listen(80);

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
};

app.use(express.logger());
app.use(express.static(__dirname + '/public_html'));
app.use(express.bodyParser());
app.use(allowCrossDomain);

app.set('linkbuttonPushed', false);
app.set('usernames', []);

app.get('/linkbutton', function(request, response) {
    app.set('linkbuttonPushed', true);
    setTimeout(function() {
        app.set('linkbuttonPushed', false);
    }, 30000);
    response.send(200, "link button pushed. you have 30 seconds to register new usernames");
});

app.get('/api/:username', function(request, response) {
    var username = request.params.username;
    if (app.get('usernames').indexOf(username) > -1) {
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
                    type: 1,
                    address: '/',
                    description: 'unauthorized user'
                }
            }
        ]);
    }
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