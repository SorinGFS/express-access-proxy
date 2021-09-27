[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Fingerprint

Passive fingerprinting is a technique for identifying requests from the web that takes place entirely on the server side without any code execution on the client side. 

In the identification process `fingerprint` module can use the whole set of information transmitted at HTTP level: cookies, headers, ips, network information, so on... The User-Agent string, for example, is an HTTP request header that typically identifies the browser, renderer, version and operating system. Also, `fingerprint` module can use information pre-processed by other modules, being able to use almost everything that exists in the `req` object at the moment when the processing reaches it. 

The `fingerprint` module aims to generate a unique hash (`req.fingerprint.hash`) that can then be used by subsequent modules. 

#### Status

Active, configurable.

#### Documentation
- [Official Documentation](https://github.com/yusukeshibata/express-fingerprint#readme)

#### Configuration Options

**ModuleName:** `fingerprint`

To simplify the configuration process `fingerprint` uses profiles:
- `device` - (reccommended) may be the best choice with `mobileDetect` at least enabled, fastest, ~1ms to process
- `userAgent` - this option is 100% reliable even without `mobileDetect` enabled, ~3ms to process
- `geoip` - (requires geoip enableds), strongest but not neccessarily needed, ~5ms to process

If none of this profiles matches the needs, then existing profiles can be edited or new profiles can be created directly in the module, file: `./express-fingerprint.js`.

`fingerprint.geoip` uses GeoIP, but since requires `MaxMind` account is disabled by default. To enable it run this in terminal:

```shell
cd node_modules/geoip-lite && npm run-script updatedb license_key=YOUR_LICENSE_KEY
```

#### Some usage examples:

**Enabling fingerprint at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "fingerprint": "device" ,
        "...": "...",
        "locations": [
            {
                "^/auth": {
                    "fingerprint": "geoip" 
                },
                "^/api": {
                    "fingerprint": false
                }
            }
        ]
    }
}
```
**Note:** In this example `fingerprint` is using `device` profile for all routes, but will be totally invalidated at `/api` route, and changed to `geoip` at `/auth` route.

**Note:** These are just examples of how the configuration is structured, don't copy-paste without analyzing them.