[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Server Configuration

This application was inspired by Nginx's way of doing things with the use of blocks: `http`, `server`, `location`. So, seemingly similar settings have different priority depending on their position: `server` overwrites `http`, and location overwrites both `http` and `server`. Think the `http` block at `Express` level, and here you can configure the `server` and it's `locations`.

The motivation behind this mechanism is simple: in accessing the web some routes need more processing than others and it would make no sense to reduce the speed to the level of the slowest route. This mechanism provides granular control over the processes that take place at each level.

Each level is controlled through modules, individual or grouped and which can be found in the `middlewares` directory. The order in which they are processed is set in the main and secondary routers, so the order in which they are put in configuration does not matter.

Each module (middleware) has its own properties that can be found in its own configuration documentation.

The configurations of all servers are processed on load, stored in memory, and then dinamically selected according to the request. The selection of the server at runtime is based on the `serverName` which must contain `req.hostname`. The configuration of each server is made up practically on the basis of the modules configured in it and is located in the file `config/servers/available/*.json`.

#### Access Basics

Servers can be configured for any of the following cases:

-   many domains can be directed to the same server
-   any domain can be directed to multiple servers depending on the route

#### Server structure

**File:** `config/servers/available/my-custom-server.json`

```json
{
    "serverName": "domain-or-ip",
    "secretKey": "if-secretKey-is-provided-RSA-keys-wont-be-used",
    "privateKeyPath": "absolute-path",
    "publicKeyPath": "absolute-path",
    "server": {
        "proxyPass": "localhost:1337",
        "module-1": { "...": "..." },
        "module-2": { "...": "..." },
        "...": { "...": "..." },
        "module-N": { "...": "..." },
        "locations": [
            {
                "^/route": {
                    "module-1": { "...": "..." },
                    "...": { "...": "..." }
                }
            },
            {
                "^/another-route": {
                    "module-2": { "...": "..." },
                    "...": { "...": "..." }
                }
            }
        ]
    }
}
```

#### App Settings

`Express` app can be also configured at `server` and `location` levels using `appSettings` directive. For a list of available settings see [Express app(set)](https://expressjs.com/en/api.html#app.set). Example configuration:

**File:** `config/servers/available/my-custom-server.json`

```json
{
    "serverName": "domain-or-ip",
    "server": {
        "appSettings": { "trust proxy": true },
        "...": { "...": "..." },
        "locations": [
            {
                "^/route": {
                    "appSettings": {
                        "query parser": false,
                        "etag": "strong"
                    },
                    "...": { "...": "..." }
                }
            }
        ]
    }
}
```

#### Server Name

As the name suggests, `serverName` contains the names or IPs to which the server responds, and in addition to the unique form presented above, it can also be in the form of an array:

**File:** `config/servers/available/my-custom-server.json`

```json
{
    "serverName": ["domain.com", "sub.domain.com", "ip"],
    "...": { "...": "..." },
    "server": {
        "...": { "...": "..." }
    }
}
```

#### Including entire files in config

Each server config may also include another files located in `config/servers/includes/**/*.json` and referred inside config at any level by the `include` directive. Included files must exist in `config/servers/includes/**` directory no matter how deep. The files will be included based on directives inside server configs in the specified position. They can be included anywhere, but in such a way that after inclusion the resulting configuration should be valid. Included files may also contain `include` directive. Here some examples about including files:

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "domain-or-ip",
    "include": "includes/keys/my-server.json",
    "server": {
        "proxyPass": "localhost:1337",
        "include": ["includes/access/my-server.json", "includes/locations/my-server.json", "includes/dev-tools/my-server.json"]
    }
}
```

**Important:**

-   on same level key similarity the later wins
-   on different level key similarity the deeper level wins
-   all included files must be `json` formatted as `array` of at least one `object`: `[{...}]`
-   `serverName` directive can be a `string` for one name, or `array` for single or multiple names.
-   `include` directive can be a `string` for one file, or `array` for single or multiple files.
-   always inspect resulted config in console!

---

Once configured, the configuration must be enabled by adding the corresponding symlink in `enabled` directory. This can be done in two ways:

-   manually adding the symlink in `enabled` dir
-   automatically (default) by specifying the enabled files in `enabled.json` as follows:

**File:** `config/servers/enabled.json`

```json
["conf-1.json", "conf-2.json", "...", "conf-n.json"]
```

**Note:** in case of manual management the `enabled.json` must be removed.
