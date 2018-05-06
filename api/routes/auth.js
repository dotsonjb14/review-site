const router = require('express').Router()
const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets");
const sqlService = require("../services/sqlService")
const crypto = require('crypto');

router.post('/token', function (req, res) {
    if(req.body.grant_type !== "password") {
        res.status(400).send("invalid grant type.")
    }
    const secret = secrets.passwordHashPhrase;
    const hash = crypto.createHmac('sha256', secret)
        .update(req.body.password)
        .digest('hex');

    let sql = new sqlService();
    sql.executeQuery('SELECT * from users WHERE username = $1::text AND password = $2::text', [req.body.username, hash])
        .then((result) => {
            if(result.rowCount === 0) {
                res.status(400).send("invalid credentials")
                return;
            }
    
            let token = jwt.sign({
                uuid: result.rows[0].id,
                username: req.body.username,
                "role": result.rows[0].role
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
