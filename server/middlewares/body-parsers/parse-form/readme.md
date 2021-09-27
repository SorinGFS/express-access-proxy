[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Parse Form

This module is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser.

#### Documentation

- [Official Documentation](http://expressjs.com/en/api.html#express.urlencoded)

#### Some usage examples:

**Enabling parseForm at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "parseForm": true,
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "parseForm": false
                }
            }
        ]
    }
}
```

**Note:** In this example `parseForm` will be activated at `server` level and invalidated at `/api` route. Also, `parseForm` can just simply be activated only at desired route without any setting at `server` level.

#### Status

Active, configurable