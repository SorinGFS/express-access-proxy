[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Csrf Protection

This module provides CSRF Protection. Cross-site request forgery, also known as one-click attack or session riding and abbreviated as CSRF or XSRF, is a type of malicious exploit of a website where unauthorized commands are submitted from a user that the web application trusts. It is very important to understand exactly what CSRF is before using this module, sometimes the documentation can be confusing but there are some very good articles about CSRF: [What is Cross-site request forgery](https://en.wikipedia.org/wiki/Cross-site_request_forgery), [Cross-Application CSRF Prevention](https://github.com/xing/cross-application-csrf-prevention), and so on...

In simple words Csrf Protection module in conjunction with JsonWebToken (JWT) and correct settings offers bulletproof protection against almost all types of attacks except XSS, because it can't just be blocked cross site access everywhere so XSS issue has to be managed separately:
- Csrf Protection ensures that the request comes from the same place that initiated it (e.g for authentication with username and password completed by issuing a JWT token)
- JsonWebToken (JWT) issues tokens based on user details and permissions, then when a token is presented for authentication it is ensured that it is valid 
- Binding CSRS to JWT ensures that validated token is not a stolen one

#### How Csrf Protection Works

**Terminology used:**
`csrs` = cross site request signature (or secret)
`csrt` = cross site request token

When a request commes in for the first time there is no `csrs` and `csrt`, so this module sends them to the client and expects them back within a new request. The `csrs` cookie can then be used for the entire session, as for `csrt` by default it will be renewed with every request, or it will be used for the entire user session if is required in a `csrtHeader`. This module doesn't store the secret or the token, it only verifies if the given pair are valid, meaning that the request commes from the same place that initiated it, in our concern the place where username and password were entered to gain access token.

This module can be configured to expect the `csrt` in a cookie (default), or in a `http header` configured in`csrfProtection.csrtHeader` (e.g `CSRF-TOKEN`, or `X-CSRF-TOKEN`). For the last scenario the frontend will receive the `csrt` in a cookie and must pass it using javascript to the designated header. To summarize, the default option `csrt` in cookie is more restrictive asking validation for every single request, while `csrt` in header allows the use of the same token several times. Since `csrt` in header allows javascript access to the `csrt` cookie enforce [Same Origin Policy](https://en.wikipedia.org/wiki/Same-origin_policy#Cross-Origin_Resource_Sharing), or allow origin by using [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

#### Status

Active, configurable.

#### Documentation
- [Official Documentation](https://github.com/expressjs/csurf#readme)

#### Configuration Options

**ModuleName:** `csrfProtection`

For default activation use `csrfProtection = true`.
To require `csrt` in header use: `csrfProtection.csrtHeader = "some-header"`.

#### Some usage examples:

**Enabling csrfProtection at `server` level and disabling at specific `location`**

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "proxyPass": "localhost:1337",
        "csrfProtection": { "csrtHeader": "CSRF-TOKEN" },
        "...": "...",
        "locations": [
            {
                "^/auth": {
                    "csrfProtection": true
                },
                "^/api": {
                    "csrfProtection": false
                }
            }
        ]
    }
}
```
**Note:** In this example `csrfProtection` will be totally invalidated at `/api` route, and `csrfProtection.csrtHeader` will be invalidated at `/auth` route by fallback to default `csrt` in cookie. For `/auth` route the same result can be achieved by `csrfProtection.csrtHeader = false`.