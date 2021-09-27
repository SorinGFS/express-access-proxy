[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Parse Json

This module is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.

#### Documentation

- [Official Documentation](http://expressjs.com/en/api.html#express.json)

#### Some usage examples:

**Enabling parseJson at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "parseJson": true,
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "parseJson": false
                }
            }
        ]
    }
}
```

**Note:** In this example `parseJson` will be activated at `server` level and invalidated at `/api` route. Also, `parseJson` can just simply be activated only at desired route without any setting at `server` level.

#### Status

Active, configurable