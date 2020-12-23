var jsonQuery = require('json-query')
var health = require('express-ping');
const express = require('express')
const store = require('data-store')({ path: process.cwd() + '/store/.store.json' });
const server_config = require('data-store')({ path: process.cwd() + '/store/.server.json' });
const path = require('path');
const cors = require('cors');
const helmet = require("helmet");
const { v4: uuidv4 } = require('uuid');
var fs = require("fs");
var session = require('express-session')
var companion = require('@uppy/companion')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

server_config.set("port", 3000)

var multer = require("multer");
var pth = process.cwd() + '/public/uploads'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pth);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage })

require('custom-env').env("staging")
var crypto = require('crypto');

// Encryption 
const algorithm = process.env.ENCRYPTION_ALGORITHM;
const key = process.env.ENCRYPTION_KEY;
const iv = process.env.ENCRYPTION_IV;
const authKey = process.env.APIKEY || "key";

const app = express()
const router = express.Router();

app.use(session({ secret: key }))
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));
app.use(health.ping());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);
app.use(express.static("public"));
const path_s = __dirname + '/client/rootless/dist';

app.use(express.static(path_s));
app.use(helmet());

const port = process.env.PORT || 3000
console.clear()
const options = {
    providerOptions: {
        drive: {
            key: 'GOOGLE_DRIVE_KEY',
            secret: 'GOOGLE_DRIVE_SECRET'
        }
    },
    server: {
        host: 'localhost:3000/',
        protocol: 'http',

    },
    secret: key,
    filePath: process.cwd() + '/public/uploads',
    sendSelfEndpoint: "localhost:3000",

}

app.use(companion.app(options))

function encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    return (encrypted.toString())
}
function decrypt(text) {
    var decipher = crypto.createDecipheriv(algorithm, key, iv);
    var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return (decrypted.toString())
}

function message(resp, message, code, status) {
    var mresponse = {}
    mresponse[resp] = { "message": message, "code": code, "status": status };
    return mresponse;
}
function loginRequired(req, res, next) {
    var auth_t = req.query._auth || req.headers.authorization
    if (!auth(auth_t)) {
        return res.send(message("error", "Unable to authenticate", "401", "UNAUTHORIZED"));
    }
    next();
}
function auth(mykey) {
    var emq = '_users[apiKey=' + mykey + ']'
    var match = jsonQuery(emq, {
        data: store.data
    }).value;
    if (match) {
        return true;
    } else {
        return false;
    }
}
function filterBy(list, criteria) {
    return list.filter(candidate =>
        Object.keys(criteria).every(key =>
            candidate[key] == criteria[key]
        )
    );
}

function url(urln) {
    return (path.join(__dirname + '/html/' + urln))
}
function isContainedIn(a, b) {
    if (typeof a != typeof b)
        return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        // assuming same order at least
        for (var i = 0, j = 0, la = a.length, lb = b.length; i < la && j < lb; j++)
            if (isContainedIn(a[i], b[j]))
                i++;
        return i == la;
    } else if (Object(a) === a) {
        for (var p in a)
            if (!(p in b && isContainedIn(a[p], b[p])))
                return false;
        return true;
    } else
        return a === b;
}
function oupdate(obj/*, …*/) {
    for (var i = 1; i < arguments.length; i++) {
        for (var prop in arguments[i]) {
            var val = arguments[i][prop];
            if (typeof val == "object") // this also applies to arrays or null!
                update(obj[prop], val);
            else
                obj[prop] = val;
        }
    }
    return obj;
}

function timestamp() {
    var dt = new Date();
    return (dt.toISOString())
}

function log(x, comment, meta) {
    var activity = {
        "_id": uuidv4(),
        "ip": x.ip,
        "url": x.originalUrl,
        "method": x.method,
        "_timestamp": timestamp(),
        "comment": comment || "",
        "meta": meta || {}
    }
    store.union("_logs", activity);
    console.log(activity);
}
function generateAccessToken(uid) {
    return jwt.sign({ uid }, key, { "expiresIn": '1d' });
}

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/rootless/dist/index.html'));
})
app.get('/api', (req, res) => {
    res.send(message("success", "rootless server running", "200", "SERVER_OK"));
})
app.get('/dump', (req, res) => {
    if (auth(req.query._auth)) {
        res.send(store.data);
    } else {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
    }
})
app.get('/collections', loginRequired, (req, res, next) => {
    log(req);
    res.send(Object.keys(store.data));
})
app.get('/brief', (req, res) => {
    if (!auth(req.query._auth)) {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        return 0;
    }
    log(req);
    res.send(Object.keys(store.data));
})
app.get('/logs',loginRequired, (req, res) => {
    log(req);
    store.set("_logs", store.get("_logs").slice(0).slice(-20));

    res.send(store.get("_logs"));
})
app.route('/plugin/:plugin/:method')
    .get(function (req, res) {
        if (!auth(req.query._auth)) {
            res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
            return 0;
        }
        log(req);
        var plugin = req.params.plugin;
        console.log(plugin)
        var method = req.params.method;
        var p = require("./plugins/" + plugin);
        p[method](req, res);
    })

app.route('/auth')
    .get(function (req, res) {
        res.send(message("success", "auth works", "200", "OK"))
    })
    .post(function (req, res) {
        res.send(message("success", "auth works", "200", "OK"))
    })
app.route('/auth/register')
    .post(function (req, res) {
        log(req);
        var model = req.params.model;
        var body = req.body;
        for (let i = 0; i < body.length; i++) {
            if (!body[i].email || !body[i].password) {
                res.send(message("error", "missing email or password", "400", "MISSING_PARAMETER"))
                return 0
            }
            if (!email_regex.test(body[i].email)) {
                res.send(message("error", "invalid email format", "400", "INVALID_EMAIL"))
                return 0
            }
            if (body[i].password.length < 6) {
                res.send(message("error", "password must be at least 6 characters long", "400", "SHORT_PASSWORD"))
                return 0
            }
            var emq = '_users[*email=' + body[i].email + ']'
            var match = jsonQuery(emq, {
                data: store.data
            }).value;

            if (match[0]) {
                res.send(message("error", "a user already exists with the provided email address", "400", "USER_EXISTS"))
                return 0
            }

            body[i]._id = uuidv4();
            body[i].createdAt = timestamp();
            body[i].apiKey = uuidv4().toUpperCase();
            body[i].password = bcrypt.hashSync(body[i].password, 10);
            body[i].emailVerified = false;
            body[i].enabled = true;
            body[i].photoURL = null;
            body[i].phoneNumber = null;
            body[i].role = "public";
            body[i].providerData = {};
        }

        store.union("_users", body);

        res.send(message("success", "user added successfully", "201", "OK"));
    })
app.route('/auth/login')
    .post(function (req, res) {
        log(req);
        var body = req.body;
        var emq = '_users[email=' + body[0].email + ']'
        var match = jsonQuery(emq, {
            data: store.data
        }).value;
        if (match) {
            var match_f = { ...match }
            if (bcrypt.compareSync(body[0].password, match.password)) {
                delete match_f.password
                out = { "token": generateAccessToken(body[0].email), "user": match_f }
                return res.send(out);
            } else {
                return res.send(message("error", "invalid password", "400", "INVALID_PASSWORD"))

            }
        } else {
            return res.send(message("error", "provided email does not exist", "400", "NONEXISTENT_EMAIL"))

        }


    })
//i.e /api/product
app.route('/api/:model')
    .get(loginRequired, (req, res, next) => {
        var mkey = req.query._auth
        var model = req.params.model;
        tm = req.query
        var fquery = { ...tm };
        //delete query keywords
        delete fquery._auth;
        delete fquery._limit;
        delete fquery._start;
        delete fquery._search;
        delete fquery._query;
        log(req);

        if (Object.keys(fquery).length > 0) {
            res.send(filterBy(store.data[model], fquery))
        } else {
            var response = store.get(model);

            if (response === undefined) {
                res.send(message("error", "requested model doesn't exist", "404", "UNDEFINED_MODEL"));
            } else {
                //search
                if (req.query._search) {
                    finalr = []
                    for (let i = 0; i < response.length; i++) {
                        var vls = Object.values(response[i])
                        if (vls.find(a => a.includes(req.query._search))) {
                            finalr.push(response[i])
                        }
                    }
                    response = finalr;
                }

                if (req.query._query) {
                    tempr = response
                    response = jsonQuery(req.query._query, {
                        data: tempr
                    });
                    response = response["value"]
                }
                //limit pagination
                if (req.query._limit) {
                    if (isNaN(req.query._limit)) {
                        res.send(message("error", "limit invalid datatype for limit,must be a number", "400", "INVALID_DATATYPE"));
                    } else {
                        var start = 0;
                        if (req.query._start && !isNaN(req.query._start)) {
                            start = req.query._start
                        }
                        var end = start + req.query._limit
                        res.send(response.slice(start, end))
                    }

                } else {
                    //no query
                    res.send(response)
                }

            }
        }

    })
    .post(loginRequired, (req, res, next) => {
        log(req);
        var model = req.params.model;
        var body = req.body;
        for (let i = 0; i < body.length; i++) {
            body[i]._id = uuidv4();
            body[i]._meta = {}
            body[i]._meta.createdAt = timestamp();
        }

        //var bodyj = JSON.stringify(body);
        store.union(model, body);
        res.send(message("success", "data added successfully", "201", "OK"));
    })
    .delete(loginRequired, (req, res, next) => {
        log(req);
        var model = req.params.model;
        var affected = 0
        console.log(store.data[model].length)
        for (var i = store.data[model].length - 1; i > -1; i--) {
            if (isContainedIn(req.body.query, store.data[model][i])) {
                store.data[model].splice(i, 1);
                affected++
            }
        }
        store.save();
        var msg = affected + " row(s) affected";
        res.send(message("success", msg, "200", "OK"))



    })
    .put(loginRequired, (req, res, next) => {
        log(req);
        var model = req.params.model;
        //var body = req.body;
        var affected = 0
        for (let i = 0; i < store.data[model].length; i++) {
            if (isContainedIn(req.body.query, store.data[model][i])) {
                store.data[model][i] = oupdate(store.data[model][i], req.body.data);
                affected++
            }
        }
        store.save()
        console.log(affected);
        var msg = affected + " row(s) affected";
        res.send(message("success", msg, "200", "OK"))

    })

app.post("/_uploads", upload.any(), function (req, res) {
    var files = req.files;
    var rfiles = []
    if (files) {
        for (let i = 0; i < files.length; i++) {
            tfiles = { ...files[i] }
            tfiles._id = uuidv4();
            tfiles._url = req.headers.host + "/d/" + tfiles._id
            store.union("_uploads", tfiles);
            rfiles.push(tfiles);

        }
        res.send(rfiles);
    }
});
app.get('/_uploads', (req, res) => {
    var folder = "./public/uploads"
    var ou = []
    fs.readdirSync(folder).forEach(file => {
        var fd = folder + "/" + file
        stats = fs.statSync(fd)
        var tmpf = { filename: file, stats: stats }
        ou.push(tmpf);
    });
    //console.log(ou); 
    res.send(ou);
})
app.get('/d/:_id', cors(), (req, res) => {
    var flt = jsonQuery(`[_id=${req.params._id}].filename`, {
        data: store.get("_uploads")
    })["value"];
    if (flt) {
        var filen = '/public/uploads/' + flt;
        res.sendFile(path.join(__dirname + filen));
    } else {
        res.send(message("error", "No such file", "404", "FILE_NOT_FOUND"))
    }
})
app.get('*', function (req, res) {
    res.send(message("error", "No such file/path", "404", "PATH_NOT_FOUND"));
});
/*
app.use(function (err, req, res, next) {
    //res.status(err.status || 500);
    res.status(200).send(message("error", err.message, "500", "SERVER_ERROR"));
});
*/
var server = app.listen(port, () => {
    console.log(`Rootless 🌲 listening at http://localhost:${port}`)
})
companion.socket(server, options)
