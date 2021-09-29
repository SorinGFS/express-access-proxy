'use strict';
// http://expressjs.com/en/4x/api.html#router.route
const router = require('express').Router();
const createError = require('http-errors');
const pluralize = require('pluralize');
const fn = require('express-access-proxy-base/fn');

// syntax: [regex, replacement, flags?]
const urlRewrite = (req, res, next) => {
    // we expect an array of strings or an array of array of strings
    if (!req.server.urlRewrite || !Array.isArray(req.server.urlRewrite)) return next();
    if (!Array.isArray(req.server.urlRewrite[0])) req.server.urlRewrite = [req.server.urlRewrite];
    req.server.urlRewrite.forEach((rule) => {
        req.url = req.url.replace(new RegExp(rule[0], rule[2]), rule[1]);
    });
    next();
};

// sets the configured routes if any and sets the parsing sequences for each method
const setRoutes = (req, res, next) => {
    let routes = ['/:dbName/:action(command)/', '/:sl([a-z]{2}|[a-z]{2}-[a-z]{2})?/:dbName/:controller/:_id([a-f0-9]{1,24})?/:action(count|distinct|data|validation|indexes|info)?/*'];
    if (req.server.routes) routes = req.server.routes;
    router.get(routes, setLocals, setOptions, setModel, setFilter, setValidationSchema, serialize, get, deserialize, send);
    router.post(routes, setLocals, dataAdapter, setOptions, setModel, setFilter, setValidationSchema, serialize, post);
    router.patch(routes, setLocals, dataAdapter, setOptions, setModel, setFilter, setValidationSchema, serialize, patch);
    router.put(routes, setLocals, dataAdapter, setOptions, setModel, setFilter, setValidationSchema, serialize, put);
    router.delete(routes, setLocals, setOptions, setModel, setFilter, setValidationSchema, serialize, del);
    router.trace(routes, setLocals, setModel, trace);
    router.all('*', send); // no route match
    next();
};

// sets the local route env vars
const setLocals = (req, res, next) => {
    req.locals = req.locals || {};
    // the purpose of server.locals is to allow shorter urls. The longer version of url will be also available.
    Object.assign(req.locals, req.server.locals);
    // hardcoded defaults (in case of no server.locals)
    if (!req.locals.sl) req.locals.sl = 'en'; // site language
    if (!req.locals.action) req.locals.action = 'index'; // controller method
    // init req.filter
    req.filter = req.server.filter || {};
    // process params
    req.locals.unparsedFilters = [];
    Object.keys(req.params).forEach((key) => {
        if (req.params[key]) {
            if (!(!isNaN(parseFloat(key)) && isFinite(key))) {
                if (['sl', 'dbName', 'controller', 'action'].includes(key)) {
                    Object.assign(req.locals, { [key]: req.params[key] });
                } else {
                    Object.assign(req.filter, { [key]: req.params[key] });
                }
            } else {
                console.log(req.params[key].split('/'));
                req.locals.unparsedFilters = req.locals.unparsedFilters.concat(req.params[key].split('/'));
            }
        }
    });
    next();
};

// allow post validation to send all the data in req.body
// allow post, patch and put to send all the data in req.body, this will redistribute pieces to the right locations
// however, if url filters or url query params are used they will take precedence
const dataAdapter = async (req, res, next) => {
    if (req.body && !Array.isArray(req.body)) {
        // post, patch, put
        if (req.body.filter || req.body.update || req.body.options) {
            req.filter = Object.assign(req.filter, req.body.filter);
            req.options = req.body.options || {};
            req.body = req.body.update || {};
        }
        // set validation
        if (req.body.validation || req.body.commandOptions) {
            req.options = req.body.commandOptions || {};
            req.body = req.body.validation || {};
        }
        // set indexes
        if (req.body.keys || req.body.indexOptions) {
            req.options = req.body.indexOptions || {};
            req.body = req.body.keys || {};
        }
    }
    next();
};

// sets the Model method options, they will always be passed to api as url query params
const setOptions = (req, res, next) => {
    // console.log(fn.parseQueryString(req.originalUrl));
    const urlParts = new URL(req.url, 'http://example.com');
    const queryParams = ['q', 'lang', 'caseSensitive', 'diacriticSensitive', 'key', 'ref', 'redirect'];
    // console.log(urlParts);
    req.options = fn.parseQueryString(urlParts.search);
    if (req.options.pp) Object.assign(req.options, { limit: req.options.pp });
    if (!req.options.limit) req.options.limit = 10; // hardcoded
    if (req.options.pn) Object.assign(req.options, { skip: req.options.limit * (req.options.pn - 1) });
    // extract query params from req.options into req.query
    queryParams.forEach((param) => {
        if (req.options[param]) req.query[param] = req.options[param];
        delete req.options[param];
    });
    // console.log(req.options);
    // console.log('query params', req.query);

    next();
};

// sets the dynamic model
const setModel = (req, res, next) => {
    if (pluralize.isSingular(req.locals.controller)) {
        req.locals.controller = pluralize.plural(req.locals.controller);
        req.single = true;
    }
    // all database models must have the same functions with same args
    const connection = require('../../../config/connections')((config) => config.dbName === req.locals.dbName)[0];
    if (!connection) throw new Error(`Error: <${req.locals.dbName}> db connection config not found!`);
    // in api controller is db table or collection
    connection.namespace = `${req.locals.dbName}.${req.locals.controller}`;
    req.Model = require('express-access-proxy-base/db/model')(connection);
    next();
};

// all the fields used as filters MUST be present in valodator.$jsonSchema
// in fact, the filter fields MUST be retrieved in frontend as $jsonSchema
const setFilter = (req, res, next) => {
    // the main goal is to identify the $key, the operators and the $value from text using regex, in any supported language
    const parseFilter = (filter) => {
        let parsedFilter = {};
        // check if we have delimiter
        if (filter && filter.split(':').length === 1) return Object.assign(parseFilter, { [filter]: true });
        return parsedFilter;
    };
    if (req.locals.unparsedFilters.length > 0) {
        req.locals.unparsedFilters.forEach((filter) => {
            console.log(filter);
            Object.assign(req.filter, parseFilter(filter));
        });
    }
    // search is passed as a filter to be translated, then transfered to actions
    if (req.filter.search) Object.assign(req.filter, req.Model.orm.textSearch({ search: req.query.q, language: req.query.lang, caseSensitive: req.query.caseSensitive, diacriticSensitive: req.query.diacriticSensitive }));
    delete req.filter.search;
    next();
};

// set the validation schema for serialize
const setValidationSchema = async (req, res, next) => {
    if (req.server.schemaValidation && (['index', 'count', 'distinct', 'data'].includes(req.locals.action) || req.method === 'GET')) {
        // for production validation schema can be cached in config
        if (typeof req.server.schemaValidation !== 'boolean') {
            req.validation = req.server.schemaValidation;
        } else {
            try {
                req.validation = await req.Model.validation();
            } catch (error) {
                return next(createError(400, error, { source: 'validation' }));
            }
        }
    } else if (req.server.schemaValidation && typeof req.server.schemaValidation !== 'boolean' && req.locals.action === 'validation') {
        // deny schema update to avoid confusion
        if (req.method !== 'GET') return next(createError(403, "Validation schema is cached amd cam't be updated."));
    }
    next();
};

// included on methods having req.body or req.filter
const serialize = (req, res, next) => {
    if (!req.validation) return next();
    if (req.filter) req.Model.serialize(req.filter, req.validation.validator.$jsonSchema);
    if (req.body) req.Model.serialize(req.body, req.validation.validator.$jsonSchema);
    // console.log(req.filter);
    // console.log(req.body);
    next();
};

const get = async (req, res, next) => {
    try {
        if (req.locals.action === 'index' && req.single) res.data = await req.Model.findOne(req.filter, req.options);
        if (req.locals.action === 'index' && !req.single) res.data = await req.Model.find(req.filter, req.options).then((cursor) => (req.query.explain ? cursor.explain() : cursor.toArray()));
        if (req.locals.action === 'validation') res.data = req.validation;
        if (req.locals.action === 'indexes') res.data = await req.Model.indexes();
        if (req.locals.action === 'count') res.data = await req.Model.count(req.filter);
        if (req.locals.action === 'distinct') res.data = await req.Model.distinct(req.query.key, req.filter, req.options); // !
        if (req.locals.action === 'info') res.data = await req.Model.info();
    } catch (error) {
        return next(createError(400, error));
    }
    next();
};

const post = async (req, res, next) => {
    try {
        if (req.locals.action === 'index' && req.single) return res.status(201).send(await req.Model.insertOne(req.body, req.options));
        if (req.locals.action === 'index' && !req.single) return res.status(201).send(await req.Model.insertMany(req.body, req.options));
        if (req.locals.action === 'validation') return res.send(await req.Model.setValidation(req.body, req.options));
        if (req.locals.action === 'indexes') return res.send(await req.Model.createIndex(req.body, req.options)); // commitQuorum = 'votingMembers' (available from mongodb 4.4)
        if (req.locals.action === 'data') return res.send(await req.Model.aggregate(req.body, req.options).then((cursor) => (req.query.explain ? cursor.explain() : cursor.toArray()))); // deserialize in frontend
    } catch (error) {
        return next(createError(400, error));
    }
};

const patch = async (req, res, next) => {
    try {
        if (req.locals.action === 'index' && req.single) return res.send(await req.Model.updateOne(req.filter, req.body, req.options));
        if (req.locals.action === 'index' && !req.single) return res.send(await req.Model.updateMany(req.filter, req.body, req.options));
    } catch (error) {
        return next(createError(400, error));
    }
};

const put = async (req, res, next) => {
    try {
        if (req.locals.action === 'index' && req.single) return res.send(await req.Model.upsertOne(req.filter, req.body, req.options));
        if (req.locals.action === 'index' && !req.single) return res.send(await req.Model.upsertMany(req.body));
    } catch (error) {
        return next(createError(400, error));
    }
};

const del = async (req, res, next) => {
    try {
        if (req.locals.action === 'index' && req.single) return res.send(await req.Model.deleteOne(req.filter, req.options));
        if (req.locals.action === 'index' && !req.single) return res.send(await req.Model.deleteMany(req.filter, req.options));
        if (req.locals.action === 'indexes') return res.send(await req.Model.dropIndex(req.query.key)); // commitQuorum = 'votingMembers' (available from mongodb 4.4)
    } catch (error) {
        return next(createError(400, error));
    }
};

const trace = (req, res) => {
    return res.send(req.body);
};

// included only on GET
const deserialize = (req, res, next) => {
    next();
};

// included only on GET and all if no route match
const send = (req, res, next) => {
    if (res.data && Object.keys(res.data).length) {
        return res.send(res.data);
    } else {
        if (req.method === 'GET') {
            return next(createError.NotFound());
        } else {
            return next(createError.BadRequest());
        }
    }
};

router.use(urlRewrite, setRoutes);

module.exports = router;
