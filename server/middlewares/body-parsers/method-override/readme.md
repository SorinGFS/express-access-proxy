[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Method Override

Lets you use HTTP verbs such as PUT, PATCH or DELETE in places where the client doesn't support it.

#### Documentation

- [Official Documentation](https://github.com/expressjs/method-override#readme)

#### Some usage examples:

**Enabling methodOverride at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "methodOverride": true,
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "methodOverride": false
                }
            }
        ]
    }
}
```

**Note:** In this example `methodOverride` will be activated at `server` level and invalidated at `/api` route. Also, `methodOverride` can just simply be activated only at desired route without any setting at `server` level.

#### Status

Active, configurable.