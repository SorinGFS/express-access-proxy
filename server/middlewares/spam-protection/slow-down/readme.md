[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Slow Down

Basic rate-limiting middleware for Express that slows down responses rather than blocking them outright. Use to limit repeated requests to public APIs and/or endpoints such as password reset.

#### Documentation

-   [Official Documentation](https://github.com/nfriedly/express-slow-down#readme)

#### Status

Active, configurable.

#### Configuration Options

**ModuleName:** `slowDown`

**SubModule:** `slowDown.ip`
| Variable               | Type    | Default | Required | Description                                                     |
| ---------------------- | ------- | ------- | -------- | --------------------------------------------------------------- |
| windowMs               | number  | 120000  | FALSE    | Timeframe for which requests are checked/remembered.            |
| delayAfter             | number  | 500     | FALSE    | allow requests per windowMs, then...                            |
| delayMs                | number  | 10      | FALSE    | begin adding delay per request above delayAfter.                |
| skipFailedRequests     | boolean | FALSE   | FALSE    | When set to true, failed requests ( >= 400) won't be counted.   |
| skipSuccessfulRequests | boolean | FALSE   | FALSE    | When set to true successful requests ( < 400) won't be counted. |

**SubModule:** `slowDown.route`
| Variable               | Type    | Default | Required | Description                                                     |
| ---------------------- | ------- | ------- | -------- | --------------------------------------------------------------- |
| windowMs               | number  | 120000  | FALSE    | Timeframe for which requests are checked/remembered.            |
| delayAfter             | number  | 5       | FALSE    | allow requests per windowMs, then...                            |
| delayMs                | number  | 1400    | FALSE    | begin adding delay per request above delayAfter.                |
| skipFailedRequests     | boolean | FALSE   | FALSE    | When set to true, failed requests ( >= 400) won't be counted.   |
| skipSuccessfulRequests | boolean | FALSE   | FALSE    | When set to true successful requests ( < 400) won't be counted. |

#### Some usage examples:

**Enabling slowDown at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "slowDown": {
            "ip": true
        },
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "slowDown": {
                        "route": true
                    }
                }
            }
        ]
    }
}
```
**Note:** In this example `slowDown.ip` will be active at `/api` route along with newlly activated `slowDown.route`.

**Overriding default options**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "slowDown": {
            "ip": true,
            "route": {
                "windowMs": 10000,
                "delayAfter": 10,
                "delayMs": 1000,
                "skipSuccessfulRequests": true
            }
        },
        "...": "..."
    }
}
```

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.