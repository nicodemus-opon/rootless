const express = require('express')
const store = require('data-store')({ path: process.cwd() + '/store/.store.json' });
const path = require('path');
const cors = require('cors');

require('custom-env').env("staging")
var crypto = require('crypto');
// Difining algorithm 
const algorithm = process.env.ENCRYPTION_ALGORITHM;
const key = process.env.ENCRYPTION_KEY;
const iv = process.env.IV;
var authKey = process.env.APIKEY;

const app = express()
const router = express.Router();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);
app.use(express.static("public"));

const port = process.env.PORT



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
    if (auth(req.query.auth)) {
        res.send(store.data);
    } else {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
    }
})
app.get('/model', (req, res) => {
    if (auth(req.query.auth)) {
        res.send(Object.keys(store.data));
    } else {
        res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
    }
})
//i.e /api/user
app.route('/api/:model')
    .get(function (req, res) {
        var mkey = req.query.auth
        var model = req.params.model;
        var fquery = req.query;
        delete fquery.auth;
        if (auth(mkey)) {
            if (Object.keys(fquery).length > 0) {
                res.send(filterBy(store.data[model], fquery))
            } else {
                var response = store.get(model);//req.params req.query
                if (response === undefined) {
                    res.send(message("error", "requested model doesn't exist", "404", "UNDEFINED_MODEL"));
                } else {
                    res.send(response)
                }
            }
        } else {
            res.send(message("error", "Unable to authenticate,invalid or missing apikey", "401", "UNAUTHORIZED"));
        }
    })
    .post(function (req, res) {
        //console.log(req.params.model);
        var model = req.params.model;
        var body = req.body;
        var bodyj = JSON.stringify(body);
        store.union(model, body);
        res.send(store.get(model));
    })
    /**
     * {
        "target": "username.nico"
        }
     */
    .delete(function (req, res) {
        var model = req.params.model;
        //var body = req.body;
        var affected = 0
        console.log(store.data[model].length)
        for (var i = store.data[model].length - 1; i > -1; i--) {
            if (isContainedIn(req.body.query, store.data[model][i])) {
                store.data[model].splice(i, 1);
                //delete store.data[model][i]
                affected++
            }
        }
        store.save();
        var msg = affected + " row(s) affected";
        res.send(message("success", msg, "200", "OK"))
        /* var model = req.params.model;
         var body = req.body;
         var conct = body.target.split(".")
         todelete = conct[0];
         tar = conct[1];
 
         items = store.data[model];
         var i = items.length;
         for (let i = 0; i < items.length; i++) {
             var element = items[i];
             console.log(element);
             if (items[i][todelete] === tar) {
                 store.data[model].splice(i, 1);
             }
         }
         store.save();
         res.send(store.get(model))*/
    })
    .put(function (req, res) {
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
        //var vv = filterBy(store.data[model][0], req.body.query)
        var msg = affected + " row(s) affected";
        res.send(message("success", msg, "200", "OK"))
    })

app.listen(port, () => {
    console.log(`Rootless 🌲 listening at http://localhost:${port}`)
})