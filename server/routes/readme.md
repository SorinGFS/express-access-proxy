[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Local Router

This router handles common local routes before passing the request to proxy.

Existing routes:
    - Refresh => POST `/refresh`
    - Logout => POST `/logout`