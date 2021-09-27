[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Parse Text

This module is a built-in middleware function in Express. It parses incoming requests with Text payloads and is based on body-parser.

#### Documentation

-   [Official Documentation](http://expressjs.com/en/api.html#express.text)

#### Some usage examples:

**Enabling parseText at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "parseText": true,
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "parseText": false
                }
            }
        ]
    }
}
```

**Note:** In this example `parseText` will be activated at `server` level and invalidated at `/api` route. Also, `parseText` can just simply be activated only at desired route without any setting at `server` level.

#### Status

Active, configurable
