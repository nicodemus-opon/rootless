const express = require('express')
const store = require('data-store')({ path: process.cwd() + 'store.rootless' });
var crypto = require('crypto');
// Difining algorithm 
const algorithm = 'aes-256-cbc';
const key = "2wrH24LYjLbCfMZghR1WvUE0386nG1sc";
const iv = "kAO1TRHM6zWInFWm";
var authKey = "69420";

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000


function encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    console.log(encrypted)
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

app.get('/', (req, res) => {
    res.send("nye");
})
app.get('/api', (req, res) => {
    res.send(message("success", "rootless server running", "200", "SERVER_OK"));
})
//i.e /api/user
app.route('/api/:model')
    .get(function (req, res) {
        var mkey = req.query.auth
        var model = req.params.model;
        var fquery = req.query;
        delete fquery.auth;
        console.log(fquery)
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
        res.send(store.get(model))
    })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})