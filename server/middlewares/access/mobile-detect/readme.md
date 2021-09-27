[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Mobile Detect

This module will detect the device by comparing patterns against a given User-Agent string. You can find out information about the device rendering your web page. As a result this module sets `req.device` object which can be then used in another modules (fingerprint, logs, ...). Knowing that the result is based on the given User-Agent which can be faked `req.device` should never be used to block requests.

#### Documentation

- [Official Documentation](https://github.com/hgoebl/mobile-detect.js/)

#### Configuration Options

**ModuleName:** `mobileDetect`

Main module returns the basic information about device:

| Variable   | Type    | Description                             |
| ---------- | ------- | --------------------------------------- |
| isPhone    | boolean | Device is a phone.                      |
| isTablet   | boolean | Device is a tablet.                     |
| isMobile   | boolean | Device is mobile (phone or tablet).     |
| isComputer | boolean | Device is a computer (not mobile).      |
| type       | string  | `computer`, `phone`, or `tablet`.       |

This module has two submodules: `client` and `browser`. Activating a submodule automatically triggers main module activation. 

**SubmoduleName:** `mobileDetect.client`

Returns information about the client by scanning in order the following `regex` patterns:

| Result     | Type   | Description                                                     |
| ---------- | ------ | --------------------------------------------------------------- |
| maybeHuman | string | First we assume is human, then override if match next patterns. |
| assumedBot | string | User-Agent contains text `bot`.                                 |
| serpBot    | string | User-Agent match `serpBot` pattern.                             |
| tracker    | string | User-Agent match `tracker` pattern.                             |
| crawler    | string | User-Agent match `crawler` pattern.                             |
| allowedBot | string | User-Agent match `allowedBot` pattern.                          |

This submodule uses a default `uaPattern` object having similar properties which can be overwritten in config file as shown in examples bellow.

**SubmoduleName:** `mobileDetect.browser`

Returns information about the browser and os.

| Result    | Type   | Description                          |
| --------- | ------ | ------------------------------------ |
| userAgent | string | Browser name (Chrome, Firefox, etc). |
| version   | number | Browser version.                     |
| os        | string | Operating system.                    |

#### Some usage examples:

**Enabling mobileDetect at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "mobileDetect": { "browser": true },
        "...": "...",
        "locations": [
            {
                "^/auth": {
                    "mobileDetect": { "client": true },
                },
                "^/api": {
                    "mobileDetect": false,
                }
            }
        ]
    }
}
```
**Note:** In this example `mobileDetect.browser` will be active at `/auth` route along with newlly activated `mobileDetect.client` and `mobileDetect` will be fully deactivated at `/api` route.

**Overriding default options**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "mobileDetect": {
            "browser": true,
            "client": {
                "assumedBot": "my-custom-bot-regex",
                "serpBot": "my-custom-bot-regex",
                "tracker": "my-custom-bot-regex",
                "crawler": "my-custom-bot-regex",
                "allowedBot": "my-custom-bot-regex"
            }
        },
        "...": "..."
    }
}
```
**Note:** `client` User-Agent bot patterns will mix into default `uaPattern`, if one not present the default will be used. Order is not important.

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.

#### Status

Active, configurable.