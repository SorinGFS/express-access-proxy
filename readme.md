# Express Access Proxy

Access Management Reverse Proxy based on JWT.

### Motivation

It is a fact that access to internal applications can be much more easily controlled by an independent application located downstream. It is as if a space is surrounded by a fence and access is allowed only through a gate. This project aims to centrally manage access to multiple applications or services. The way this project is designed allows its use as an intermediary to perform sensitive operations in the backend instead of frontend.

### Requirements

    * node: >=10.0.0
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
npm run action install express-access-proxy -- -p strapi
```

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
    - [Module Configuration](middlewares)
        1. [Request Parsers](middlewares/request-parsers)
            1. [Cookie Parser](middlewares/request-parsers/cookie-parser)
            1. [Method Overwrite](middlewares/request-parsers/method-override)
            1. [Body Forms Parser](middlewares/request-parsers/body-forms-parser)
            1. [Http Logger](middlewares/request-parsers/volleyball)
        1. [Access](middlewares/access)
            1. [Set Server](middlewares/access/set-server)
            1. [Set Device (mobile-detect)](middlewares/access/mobile-detect)
            1. [CSRF Protection](middlewares/access/csrf-protection)
            1. [Fingerprint](middlewares/access/fingerprint)
            1. [Set User (authentication using JWT and permissions)](middlewares/access/set-user)
            1. [Access Control](middlewares/access/access-control)
            1. [Access Logs](middlewares/access/access-logs)
        1. [Spam Protection](middlewares/spam-protection)
            1. [Rate Limit](middlewares/spam-protection/rate-limit)
            1. [Slow Down (DDOS protection)](middlewares/spam-protection/slow-down)
        1. [Router](router)
            1. [Routes](router/routes)
                1. [Logout](router/routes/logout)
                1. [Refresh](router/routes/refresh)
        1. [Dev Tools](middlewares/dev-tools)
            1. [Console Logger](middlewares/dev-tools/console-logger)
            1. [Performance Timer](middlewares/dev-tools/performance-timer)
        1. [Proxy](middlewares/proxy)
            1. [Local](middlewares/proxy/local)
            1. [Available Plugins](middlewares/proxy#plugins)
                1. [Strapi](https://github.com/SorinGFS/strapi-access-proxy#strapi-access-proxy)

**Important:** Some modules are built-in or work only in a certain environment. For the rest of them there is one rule:
- **if is not configured it doesn't run!**

### Todo next (in order of priority):

- Finish Access Logs
- Add upstream support
- Add local authentication
- Add web admin interface
- SSL support to access apps located on the web.

### Disclaimer

Please do not ask for support, since I'm a lone wolf I don't have time for this. I will try to improve the project within the time available.

### License

[MIT](LICENSE)
