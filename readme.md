# Express Access Proxy

Access Management Reverse Proxy based on JWT.

### Motivation

It is a fact that access to internal applications can be much more easily controlled by an independent application located downstream. It is as if a space is surrounded by a fence and access is allowed only through a gate. This project aims to centrally manage access to multiple applications or services. The way this project is designed allows its use as an intermediary to perform sensitive operations in the backend instead of frontend.

### Requirements

    * node: >=12.19.0
    * npm: >=6.0.0
    * mongoDB >=2.6
    * downstream server Nginx, Apache, or whatever, to proxy connections to this host (default `localhost:7331` for production, `localhost:3002` for development)

### Installation

Express Access Proxy itself is just a transparent proxy. Install it first:

```shell
cd /path/to/desired/location
git clone https://github.com/SorinGFS/express-access-proxy.git 
cd express-access-proxy
npm install
```

Now, install the desired auth provider plugin, e.g Strapi:

```shell
npm run action install access-proxy -- -p strapi
```

<details>
<summary>Remove an installed plugin: <em>(Click to expand)</em></summary>

```shell
npm run action uninstall access-proxy -- -p strapi
```

</details>

That's all. To start the configuration process run:

```shell
npm run dev
```

This will start your app in development environment on `localhost:3002` where you should configure it according your needs.

To start the app in `production` environment configure the downstream server to proxy the requests to this app on `localhost:7331`, then run:

```shell
npm run start
```

### Configuration

The application is designed in a maximum flexible way and allows granular control by configuring each module separately on each server and on each route. Initially the application offers out of the box functionality by forwarding requests received on `localhost:3002` (or `localhost:7331` for `production` environment) to `localhost:1337`. The purpose for this behaviour is to help the user to adapt and to understand how to configure the application for their own needs. 
**Important:** This application should only run behind a downstream server, there is no SSL/TLS support for now, therefore the communication between downstream server and this application is made in plain text. **So it can be used only when there is control and trust in the host machine!** Moreover, a downstream server like Nginx not only solves much of the http related security issues much faster but is also needed to direct requests to this application. Stil, this application can use existing SSL certificates to encrypt JWT authentication tokens and hopefully in the not too distant future will be able to secure traffic to the downstream server.

#### Configuration Steps

1. [Environment Configuration](config/env)
1. [Database Connection Configuration](config/connections)
1. [Server Configuration](config/servers)
    - [Middlewares](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master)
        1. [Http Parsers](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/http-parsers)
            1. [Cookie Parser](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/http-parsers/cookie-parser)
            1. [Http Console Logger](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/http-parsers/volleyball)
        1. [Access](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access)
            1. [Set Device (mobile-detect)](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access/mobile-detect)
            1. [CSRF Protection](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access/csrf-protection)
            1. [Fingerprint](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access/fingerprint)
            1. [Set User (authentication using JWT and permissions)](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access/set-user)
            1. [Access Control](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access/access-control)
            1. [Access Logs](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/access/access-logs)
        1. [Spam Protection](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/spam-protection)
            1. [Rate Limit](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/spam-protection/rate-limit)
            1. [Slow Down (DDOS protection)](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/spam-protection/slow-down)
        1. [Body Parsers](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/body-parsers)
            1. [Data Adapter](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/body-parsers/data-adapter)
            1. [Method Overwrite](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/body-parsers/method-override)
            1. [Parse Form](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/body-parsers/parse-form)
            1. [Parse Json](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/body-parsers/parse-json)
            1. [Parse Text](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/body-parsers/parse-text)
        1. [Dev Tools](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/dev-tools)
            1. [Console Logger](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/dev-tools/console-logger)
            1. [Performance Timer](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/dev-tools/performance-timer)
        1. [Http Error Logs](https://github.com/SorinGFS/express-access-proxy-middlewares/tree/master/http-errors)
    - [Routes](server/routes)
        1. [Auth](server/routes/auth)
            1. [Logout](server/routes/auth/logout)
            1. [Refresh](server/routes/auth/refresh)
    - [Proxy](server/proxy)
        1. [Available Plugins](server/proxy#plugins)
            1. [Strapi](https://github.com/SorinGFS/strapi-access-proxy#strapi-access-proxy)

**Note:** the server has built-in `urlRewrite`, direct db access, JWT support, dynamically added app and route settings and `RegExp` based route selector.

**Important:** Some modules are built-in or work only in a certain environment. For the rest of them there is one rule:
- **if is not configured it doesn't run!**

### Todo next (in order of priority):

- Add upstream support
- Add local authentication
- Add web admin interface
- SSL support to access apps located on the web.

### Disclaimer

Please do not ask for support, since I'm a lone wolf I don't have time for this. I will try to improve the project within the time available.

### License

[MIT](LICENSE)
