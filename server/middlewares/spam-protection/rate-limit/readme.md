[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Rate Limit

Basic rate-limiting middleware for Express. Use to limit repeated requests to API endpoints. Plays nice with express-slow-down.

#### Documentation

-   [Official Documentation](https://github.com/nfriedly/express-rate-limit#readme)

#### Status

Active, configurable.

#### Configuration Options

**ModuleName:** `rateLimit`

**SubModule:** `rateLimit.ip`
| Variable               | Type    | Default  | Required | Description                                                     |
| ---------------------- | ------- | -------- | -------- | --------------------------------------------------------------- |
| windowMs               | number  | 60000    | FALSE    | Timeframe for which requests are checked/remembered.            |
| max                    | number  | 1000     | FALSE    | Limit each IP to max requests per windowMs.                     |
| headers                | boolean | FALSE    | FALSE    | Enable headers X-RateLimit-Limit and X-RateLimit-Remaining.     |
| statusCode             | number  | 429      | FALSE    | HTTP status code returned when max is exceeded.                 |
| message                | text    | variable | FALSE    | Error message sent to user when max is exceeded.                |
| skipFailedRequests     | boolean | FALSE    | FALSE    | When set to true, failed requests ( >= 400) won't be counted.   |
| skipSuccessfulRequests | boolean | FALSE    | FALSE    | When set to true successful requests ( < 400) won't be counted. |

**SubModule:** `rateLimit.route`
| Variable               | Type    | Default  | Required | Description                                                     |
| ---------------------- | ------- | -------- | -------- | --------------------------------------------------------------- |
| windowMs               | number  | 60000    | FALSE    | Timeframe for which requests are checked/remembered.            |
| max                    | number  | 10       | FALSE    | Limit each IP to max requests per windowMs.                     |
| headers                | boolean | FALSE    | FALSE    | Enable headers X-RateLimit-Limit and X-RateLimit-Remaining.     |
| statusCode             | number  | 429      | FALSE    | HTTP status code returned when max is exceeded.                 |
| message                | text    | variable | FALSE    | Error message sent to user when max is exceeded.                |
| skipFailedRequests     | boolean | FALSE    | FALSE    | When set to true, failed requests ( >= 400) won't be counted.   |
| skipSuccessfulRequests | boolean | FALSE    | FALSE    | When set to true successful requests ( < 400) won't be counted. |

#### Some usage examples:

**Enabling RateLimit at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "rateLimit": {
            "ip": true
        },
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "rateLimit": {
                        "route": true
                    }
                }
            }
        ]
    }
}
```
**Note:** In this example `rateLimit.ip` will be active at `/api` route along with newlly activated `rateLimit.route`.

**Overriding default options**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "rateLimit": {
            "ip": true,
            "route": {
                "windowMs": 10000,
                "max": 10,
                "headers": true,
                "message": "my custom message"
            }
        },
        "...": "..."
    }
}
```

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.