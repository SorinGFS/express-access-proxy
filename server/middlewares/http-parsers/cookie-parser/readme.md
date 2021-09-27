[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Cookie Parser

Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns `req.secret` so it may be used by other middleware.

#### Documentation

- [Official Documentation](https://github.com/expressjs/cookie-parser#readme)

#### Status

Active, not configurable except `COOKIE_SECRET` in `.env` files.