var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var secrets = require('./config/secrets')

const express = require('express')
const app = express()

var cors = require('cors');

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World! ' + uuid()))
app.get("/check", [auth(), (req, res) => res.send('Hello World!')])
app.get("/check2", [auth("admin"), (req, res) => res.send('Hello World!')])
app.use('/auth', require("./routes/auth"));
app.use('/categories', require("./routes/categories"));

app.listen(3000, () => console.log('Example app listening on port 3000!'))

function auth(requiredRole) {
    return function(req, res, next) {
        let canGoNext = true;
        try {
            let token = jwt.verify(req.headers.authorization, secrets.jwtPassPhrase);

            if(requiredRole !== void 0 && token.role !== requiredRole) {
                res.status(400).send("unauthorized");
                canGoNext = false;
            }
            else {
                req.token = token;
            }
        } catch (error) {
            res.status(401).send("invalid token");
            canGoNext = false;
        }
        
        if(canGoNext)
            next();
    }
}
