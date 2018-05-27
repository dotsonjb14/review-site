const router = require('express').Router()
const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets");
const sqlService = require("../services/sqlService")
const crypto = require('crypto');

const authService = require('../services/authService');

router.post('/token', function (req, res) {
    if(req.body.grant_type !== "password") {
        res.status(400).send("invalid grant type.")
    }
    const hash = crypto.createHmac('sha256', secrets.passwordHashPhrase)
        .update(req.body.password)
        .digest('hex');

    sqlService.executeQuery('SELECT * from users WHERE username = $1::text AND password = $2::text', [req.body.username, hash])
        .then((result) => {
            if(result.rowCount === 0) {
                res.status(400).send("invalid credentials")
                return;
            }
    
            let token = jwt.sign({
                uuid: result.rows[0].id,
                username: req.body.username,
                "role2": result.rows[0].role,
                scopes: authService.getScopes(result.rows[0].role),
            }, secrets.jwtPassPhrase);
        
            res.send({
                bearer: token
            })
        })
        .catch((reason) => {
            res.status(500).send(reason)
        })
})

module.exports = router;
