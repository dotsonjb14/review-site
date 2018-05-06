var router = require('express').Router()
var jwt = require('jsonwebtoken');
var secrets = require("../config/secrets");

router.post('/token', function (req, res) {
    if(req.body.grant_type !== "password") {
        res.status(400).send("invalid grant type.")
    }

    let token = jwt.sign({ 
        username: req.body.username,
        "role": req.body.username
    }, secrets.jwtPassPhrase);

    res.send({
        bearer: token
    })
})

module.exports = router;
