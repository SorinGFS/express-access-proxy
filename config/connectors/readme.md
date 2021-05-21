[Back to Main Page](https://github.com/SorinGFS/access-proxy#configuration)

### Database Connector Configuration

This application is designed to be able to make connections to multiple databases using multiple connector types. This is where these connectors are configured. At the time of connection, the connector that is designated by the connection will be chosen.

Each connector must be configured in a separate file located in the `available` directory. The file name is relevant only to the user. The selection of the connector will be made by the `connector` key where the value must correspond with the existing connector files in `base` directory. By default this application uses `mongodb` aka [native mongodb driver](https://github.com/mongodb/node-mongodb-native). More about configuring connector options can be found in [mongodb driver documentation](https://docs.mongodb.com/drivers/node/current/).

**Important: default `mongodb` connector is configured and ready to go. No modification is needed unless there is an intention to add another connector, which involves developing all the files needed by the application to use that connector.**

```json
{
    "connector": "mongodb",
    "options": {
        "...": "..."
    }
}
```

Once configured, the configuration must be enabled by adding the corresponding symlink in `enabled` directory. This can be done in two ways:
- manually adding the symlink in `enabled` dir
- automatically (default) by specifying the enabled files in `enabled.json` as follows:

**File:** `config/connectors/enabled.json`
```json
["conf-1.json", "conf-2.json", "...", "conf-n.json"]
```
**Note:** in case of manual management the `enabled.json` must be removed.
