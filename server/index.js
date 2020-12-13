var jsonQuery = require('json-query')
const express = require('express')
const store = require('data-store')({ path: process.cwd() + '/store/.store.json' });
const server_config = require('data-store')({ path: process.cwd() + '/store/.server.json' });
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
var fs = require("fs");
const util = require("util");
var session = require('express-session')
var companion = require('@uppy/companion')


server_config.set("port",3000)

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
const { timeStamp } = require('console');

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);
app.use(express.static("public"));

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

function auth(mykey) {

    if (mykey == authKey) {
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

function log(x, comment) {
    var activity = {
        "_id": uuidv4(),
        "ip": x.ip,
        "url": x.originalUrl,
        "method": x.method,
        "_timestamp": timestamp(),
        "comment": comment || ""
    }
    store.union("_logs", activity);
    console.log(activity);
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
    res.sendFile(path.join(__dirname + '/public/indexb.html'));
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
app.get('/collections', cors(), (req, res) => {
    if (!auth(req.query._auth)) {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        return 0;
    }
    log(req);
    res.send(Object.keys(store.data));
})
app.get('/logs', cors(), (req, res) => {
    if (!auth(req.query._auth)) {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        return 0;
    }
    log(req);
    store.set("_logs", store.get("_logs").slice(0).slice(-5));
    
    res.send(store.get("_logs"));
})
//i.e /api/product
app.route('/api/:model', cors())
    .get(function (req, res) {
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

        if (auth(mkey)) {
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
        } else {
            res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        }
    })
    .post(function (req, res) {
        log(req);
        var model = req.params.model;
        var body = req.body;
        for (let i = 0; i < body.length; i++) {
            body[i]._id = uuidv4();
            body[i]._timestamp = timestamp();
        }

        //var bodyj = JSON.stringify(body);
        store.union(model, body);
        res.send(message("success", "data added successfully", "201", "OK"));
    })
    .delete(function (req, res) {
        log(req);
        if (auth(req.query._auth)) {
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
        } else {
            res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        }


    })
    .put(function (req, res) {
        log(req);
        if (auth(req.query._auth)) {
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
        } else {
            res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        }
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
var server = app.listen(port, () => {
    console.log(`Rootless 🌲 listening at http://localhost:${port}`)
})
companion.socket(server, options)
