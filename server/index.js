const express = require('express')
const store = require('data-store')({ path: process.cwd() + '/store/.store.json' });
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, file.originalname);
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;



require('custom-env').env("staging")
var crypto = require('crypto');

// Encryption 
const algorithm = process.env.ENCRYPTION_ALGORITHM;
const key = process.env.ENCRYPTION_KEY;
const iv = process.env.ENCRYPTION_IV;
var authKey = process.env.APIKEY;

const app = express()
const router = express.Router();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);
app.use(express.static("public"));

const port = process.env.PORT
console.clear()


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
function log(x) {
    console.clear();
    console.log(x);
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
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
app.get('/model', (req, res) => {
    if (auth(req.query._auth)) {
        res.send(Object.keys(store.data));
    } else {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
    }
})
//i.e /api/product
app.route('/api/:model')
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
                            if(vls.find(a =>a.includes(req.query._search))){
                                finalr.push(response[i])
                            }
                        }
                        response=finalr;
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
        var model = req.params.model;
        var body = req.body;
        for (let i = 0; i < body.length; i++) {
            body[i]._id = uuidv4()
        }

        //var bodyj = JSON.stringify(body);
        store.union(model, body);
        res.send(message("success", "data added successfully", "201", "OK"));
    })
    .delete(function (req, res) {
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

app.listen(port, () => {
    console.log(`Rootless 🌲 listening at http://localhost:${port}`)
})