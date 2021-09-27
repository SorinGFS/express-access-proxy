[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Proxy

This proxy is completely transparent with one exception: it filters the access token issued by providers like Strapi after a successful login. Every provider has its onw specific way of passing the token to the client, so for this reason every provider must have it's own proxy type.
The application itself does not modify the requests in any way, but only allows or denies access. This proxy works dynamically based on `server` set before request reaches here, so nothing to configure.

#### Plugins

Available Plugins are:
- [strapi](https://github.com/SorinGFS/strapi-access-proxy#strapi-access-proxy)

#### Status

Active, not configurable