[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Local Router

This router handles common local routes before passing the request to proxy.

Existing routes:
1. Auth => `/auth`
    1. Logout => POST `/logout`
    1. Refresh => POST `/refresh`