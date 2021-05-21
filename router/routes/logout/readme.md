[Back to Main Page](https://github.com/SorinGFS/access-proxy#configuration)

### Logout Route

This route handles logout (removing the granted permissions from database) for all hosted servers and for application itself by responding with a `401 Unautorized` after success, amd with a `403 Forbidden` if logout already succeeded (provided token not valid anymore).