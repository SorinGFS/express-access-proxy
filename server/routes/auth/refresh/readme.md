[Back to Main Page](https://github.com/SorinGFS/express-access-proxy#configuration)

### Refresh Token

This route handles token renewval (searching the granted permissions in database) for all hosted servers and for application itself by responding with a new access token on success, or with a `403 Forbidden` if logout succeeded (provided token not valid anymore).