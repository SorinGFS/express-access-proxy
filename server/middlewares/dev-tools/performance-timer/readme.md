[Back to Main Page](https://github.com/SorinGFS/access-proxy#configuration)

### Performance Timer

In `development` environment provides console information with the time consumed by the module that just ran.

#### Documentation

In order to be able to measure the time consumed by a certain module, it would be necessary to write code inside the targeted module.

However, this method has 2 problems:

-   it must be requested in several places in order to be able to identify the differences
-   pollutes the code and must be deleted or commented on after use

This module offers the possibility to console log the perfromance timers at certain times chosen by us. And like all other modules it can be activated both at `server` level and at `location` level.

#### Configuration

**ModuleName:** `devTools.performanceTimer`

The list of modules for which you can configure Console Logger is limited to the following modules:

1. setServer
1. setDevice
1. fingerprint
1. setUser

**Note:** The list will be updated as the project develops.

`performanceTimer` expects an array with every requested module name, and to invalidate parent setting a new array with locally requested modules is required. To invalidate all parent `performanceTimer` modules use empty array `[]`.

#### Some usage examples:

**Enabling performanceTimer.fingerprint at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "devTools": {
            "performanceTimer": ["fingerprint"]
        },
        "...": "...",
        "locations": [
            {
                "^/auth": {
                    "devTools": {
                        "performanceTimer": ["fingerprint", "setUser"]
                    }
                }
            },
            {
                "^/api": {
                    "devTools": {
                        "performanceTimer": []
                    }
                }
            }
        ]
    }
}
```

**Note:** In this example all `performanceTimer` modules were inactivated at `/api`, `performanceTimer.fingerprint` and `performanceTimer.setUser` will be active at `/auth` and `performanceTimer.fingerprint` will be active everywhere else.

**Note:** This is just an example of how the configuration is structured, don't copy-paste without analyzing it.

#### Status

Active, configurable.
