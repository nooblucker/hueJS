# A Node.js based Simulator for the Philips Hue API

## Install

```
sudo npm install
```

## Run

With [foreman](http://blog.daviddollar.org/2011/05/06/introducing-foreman.html) installed:
```
foreman start
```

Or just 
```
node bridge.js
```

## Routes

`GET /linkbutton` will enable user registration for 30 seconds.

`GET /api/:username` will return success if the user is already registrated, or error, it the user is unknown:
```JSON
[
    {
        success: {
            username: username
        }
    }
]
[
    {
        error: {
            type: 1,
            address: '/',
            description: 'unauthorized user'
        }
    }
]
```


`POST /api` with parameters `username` and `devicetype` will register the user, if the linkbutton has been pressed, or an error, if the button is not pressed:
```JSON
[
    {
        success: {
            username: username
        }
    }
]
[
    {
        error: {
            type: 101,
            address: '',
            description: 'link button not pressed'
        }
    }
]
```