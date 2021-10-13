[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Data Adapter

This module is a body-parser that adapts the body payload to desired objects assigned to Express's `req` object (or its subkeys). Data Adapter's module name is `dataAdapter` and its type is `object`. Keys and values inside this object are infact all keys: the keys of the object refer to the keys of the `req` object, and the values refer to the keys in the `req.body`.

The module can have a simple configuration with `"dataAdapter": true` in which case all the `req.body` keys are assigned to `req.site` object. Due to the fact that `req.site` is a frontend shareable object this configuration has one exception: if `req.site.dbConnection` is assigned from the `req.body` then their conntent will be moved to `req.dbConnection`.

If the simple configuration is not enough the module can be onfigured in detail to map each possible `req.body` key to desired `req` key or subkey. Also, multiple `req.body` keys can be mapped to the same `req` object key or subkey, in which case the latest key will prevail (if in the same `req.body` are present multiple keys belonging to the same `req` key or subkey). This procedure is meant to cover multiple `req.body` contexts not multiple `req.body` keys mapped to the same `req` key or subkey.

**Important:** if target object does not exist it will be created. The `req.body` keys must be of type object, but not array. The `req.body` contains `req.body.body` then lastly `req.body` will be replaced by its value (no configuration needed for this).

#### Some usage examples:

To avoid any confusion see the following examples:

**Example 1: assign a `req.body` key to a `req` key:**

**Payload:** `req.body`

```json
{
    "queryOptions": { "limit": 30 }
}
```

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "dataAdapter": {
            "options": "queryOptions"
        },
        "...": "..."
    }
}
```

or

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "dataAdapter": {
            "options": ["queryOptions", "commandOptions", "..."]
        },
        "...": "..."
    }
}
```

**Will result:**

```js
req.options.limit = 30;
```

**Example 2: assign a `req.body` key to a `req` subkey:**

**Payload:** `req.body`

```json
{
    "queryOptions": { "limit": 30 }
}
```

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "dataAdapter": {
            "site": {
                "options": "queryOptions"
            }
        },
        "...": "..."
    }
}
```

or

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "dataAdapter": {
            "site": {
                "options": ["queryOptions", "commandOptions", "..."]
            }
        },
        "...": "..."
    }
}
```

**Will result:**

```js
req.site.options.limit = 30;
```

**Enabling dataAdapter at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "dataAdapter": true,
        "...": "...",
        "locations": [
            {
                "^/api": {
                    "dataAdapter": false
                }
            }
        ]
    }
}
```

**Note:** In this example `dataAdapter` will be activated at `server` level and invalidated at `/api` route. Also, `dataAdapter` can just simply be activated only at desired route without any setting at `server` level.

#### Status

Active, configurable
