[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Authentication and Authorization

This module is a custom implementation of `Auth0's JsonWebToken` library for JWT based Access Management

#### Documentation

-   [Official Documentation](https://github.com/auth0/node-jsonwebtoken)

#### Configuration Methods

The main objective of this module is to configure the `jwt` on which depends the way in which users are authenticated and authorized. The `jwt` can be configured in 3 ways:

-   automatic, by choosing or configuring existing options
-   hardcoded, by manually editing `auth.jwt`'s compositing options
-   both, automatic and hardcoded (automatic options will prevail)

However, the automatic `jwt` configuration is sufficient and contains both the options in the [Auth0 module](https://github.com/auth0/node-jsonwebtoken#usage) and other newly added options. The other configuration methods exist only for brevity. Also, the automatic configuration method is designed to simplify the configuration, reduce the possibility of error, and even help to understand how the jwt works.

As a concept, this module follows the same model that exists everywhere in the project: **if you don't put something in, it doesn't exist!** So the first step is to add the module in the server configuration, then add its options. Unlike most other modules, this module can only be configured at the `server` level, not at the `location` level. However, there is an exception, module activation `auth.mode` that can be done at the `server` level and disabled at the `location` level, or inactive at the `server` level and enabled at the `location` level. The principle that guides this mode of operation is simple: **the same server cannot work simultaneously with several types of `jwt`**.

#### Basic Structure

**File:** `config/servers/available/my-server.json`

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "...": "...",
        "auth": {
            "option1": "value1",
            "...": "..."
        }
    }
}
```

This module needs keys to work. The keys can be of 2 types, depending on the auth mode used: secret key or RSA key pair (public and private). The configuration of the keys is as follows:

**Secret key:**

```json
{
    "serverName": "myDomain.com",
    "secretKey": "my-secret-key",
    "server": {
        "...": "...",
    }
}
```

<details>
<summary>Example to generate secretKey in console <em>(Click to expand)</em></summary>

```shell
npm run action generate secret-key -- -l 32
```

**Note:** the size of secretKey doesn't affect the size of jwt token which is determined by the jwt sign algorithm, but is affecting the jwt token generation speed in runtime. The `-l` parameter means length in bytes.

</details>

**RSA key pair:**

```json
{
    "serverName": "myDomain.com",
    "privateKeyPath": "/etc/letsencrypt/live/domain.com/privkey.pem",
    "publicKeyPath": "C:\\path\\to\\fullchain.pem",
    "server": {
        "...": "...",
    }
}
```
**Note:** The keys are configured in this way because they are processed before being inserted into auth module, and more than that they can be requested by other modules too.

**Note:** If the token is verified in FRONTEND use RSA keys, because sharing the `secretKey` is a security mistake (unless there is full control over the receiver servers).

Adding options follows the same pattern: if the option is not configured it does not exist! Except for the `provider` the other options are optional. The name of the provider must correspond to the name of the plugin that comes installed in the proxy, for example for Strapi the installed plugin is called `strapi`:

```json
{
    "auth": {
        "provider": { "name": "strapi" }
    }
}
```

If there are several servers that use the same provider, it is mandatory that they be differentiated by an id. Remember that each source can have a user with `id = 1`. So the main purpose for using the `provider.id` is to differentiate the users according to the source they come from. Using the provider port as an id can be a good idea to have a visual clue about the provider.

```json
{
    "auth": {
        "provider": { "name": "strapi", "id": 1337 }
    }
}
```

#### Configuration Options

Couple of `jwt` authentication modes can be configured which are differentiated mainly by the way of extending the validity of the token:
1. `auth.mode = "refreshTokens"` extended using refresh tokens
1. `auth.mode = "slideExpiration"` extended by sliding expiration of access token

Due to the fact that `auth.mode = "slideExpiration"` validity extension requires database records it can only be used inside the same machine, while `auth.mode = "refreshTokens"` doesn't have this constraint. Instead, the latter are forced to carry larger amounts of information in the token, while the former can be supple.

As specified in Configuration Methods `auth.mode` can be done at the `server` level and disabled at the `location` level, or inactive at the `server` level and enabled at the `location` level.

**Disabling auth on `/api` route**

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "...": "...",
        "auth": {
            "mode": "slideExpiration",
            "...": "..."
        },
        "locations": [
            {
                "^/api": {
                    "auth": {
                        "mode": false
                    }
                }
            }
        ],
    }
}
```

**Enabling auth on `/admin` and `/api` routes only**

```json
{
    "serverName": "myDomain.com",
    "...": "...",
    "server": {
        "...": "...",
        "auth": {
            "mode": false,
            "...": "..."
        },
        "locations": [
            {
                "^/admin": {
                    "auth": {
                        "mode": "slideExpiration"
                    }
                },
                "^/api": {
                    "auth": {
                        "mode": "slideExpiration"
                    }
                }
            }
        ],
    }
}
```
**Note:** `auth.mode: false` at server level is the same as when ``auth.mode` not set at server level.

Before starting the configuration must be kept in mind that some of the settings can only refer to one of the modes, their configuration neither harms nor helps when the mode to which it refers is not selected.

Also, if due to the settings the token issued to the user is always identical then there is a potential security risk.
For this reason there must always be at least one variable property in the token (e.g timestamp `iat`, meaning issued at). `Auth0's JsonWebToken` library automatically places a timestamp in the token, but it can be removed by using `noTimestamp: true`.

Once the plan is made according to the needs, options can be added one by one while being tested using [Auth0's jwt tool](https://jwt.io/) and an API testing tool such as [Insomnia](https://insomnia.rest/) for outgoing `jwt`'s. For incoming `jwt` do not hesitate to abuse the internal tools `consoleLogger` and `performanceTimer`.

**Here is a basic example of devTools usage that can be placed at any level:**
```json
{
    "devTools": {
        "consoleLogger": { "setUser": ["user"] },
        "performanceTimer": ["setUser"]
    }
}
```

**Common configuration**

| Variable        | Type               | Default | Required | Description                                                                                                          | JWT |
| --------------- | ------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------- | --- |
| mode            | string enum, false |         | FALSE    | This option allows to enable or disable the specified auth mode at single level.                                     |     |
| provider.name   | string enum        |         | TRUE     | Auth provider's name defines the proxy plugin used to capture the token.                                             |     |
| provider.id     | number, string     |         | FALSE    | If multiple providers with the same name exists this will make the difference.                                       |     |
| algorithm       | string enum        | HS256   | FALSE    | The algorithm used in jwt.header. Use RS256,RS384,RS512 for refreshTokens.                                           |     |
| noTimestamp     | boolean            |         | FALSE    | JWT will include an iat (issued at) claim by default unless noTimestamp:true.                                        | iat |
| audience        | boolean, original  |         | FALSE    | If true will use config serverName, otherwise will use the given value as audience.                                  | aud |
| issuer          | boolean, original  |         | FALSE    | If true will use auth.provider.name otherwise will use the given value as issuer.                                    | iss |
| jwtid           | boolean, original  |         | FALSE    | If true will use auth.provider.id otherwise will use the given value as jwtid.                                       | jti |
| subject         | original           |         | FALSE    | This can only be set in jwt.signOptions && jwt.verifyOptions directly.                                               | sub |
| bindCsrs        | boolean            |         | FALSE    | If true will check if token user has the same origin as the recorded login. The csrfProtection must be enabled too.  |     |
| bindProvider    | boolean            |         | FALSE    | If true will check if token user has the same provider as the recorded login.                                        |     |
| bindFingerprint | boolean            |         | FALSE    | If true will check if token user has the same fingerprint as the recorded login. Fingerprint must be configured too. |     |

**Note:** original means same as described in original [Auth0 library](https://github.com/auth0/node-jsonwebtoken#usage)

**SlideExpiration specific configuration**

| Variable             | Type   | Default | Required | Description                                                                  | JWT |
| -------------------- | ------ | ------- | -------- | ---------------------------------------------------------------------------- | --- |
| maxInactivitySeconds | number | 1800    | FALSE    | Max inactivity seconds after which sliding expiration is no longer possible. |     |

**RefreshTokens specific configuration**

| Variable         | Type              | Default | Required | Description                                                                            | JWT |
| ---------------- | ----------------- | ------- | -------- | -------------------------------------------------------------------------------------- | --- |
| expiresIn        | vercel/ms         | 30m     | FALSE    | Token expiration period.                                                               | exp |
| notBefore        | vercel/ms         |         | FALSE    | Token validity until start period.                                                     | nbf |
| clockTolerance   | number            |         | FALSE    | Number of seconds to tolerate when checking the nbf and exp claims.                    |     |
| clockTimestamp   | number            |         | FALSE    | Time in seconds that should be used as the current time for all necessary comparisons. |     |
| maxAge           | number, vercel/ms |         | FALSE    | The maximum allowed age for tokens to still be valid. If number means seconds.         |     |
| nonce            | string            |         | FALSE    | String value to check nonce claim, used on Open ID for the ID Tokens.                  |     |
| refreshInSeconds | number            | 84600   | FALSE    | Max interval in seconds in which refreshing access tokens is possible.           |     |

**Note:** `maxInactivitySeconds`, `expiresIn` and `refreshInSeconds` have default values because if user omits to set one of them they will give errors in runtime.

**Note:** vercel/ms means time to milliseconds converter [vercel/ms library](https://github.com/vercel/ms).

**Note:** All the given configurations are just examples of how the configuration is structured, don't copy-paste without analyzing them.