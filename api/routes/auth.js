const router = require('express').Router()
const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets");

const authService = require('../services/authService');

router.post('/token', async function (req, res) {
    if(req.body.grant_type !== "password") {
        res.status(400).send("invalid grant type.")
    }

    let result = null;
    
    try {
        result = await authService.loginUser(req.body.username, req.body.password);
    } catch (error) {
        console.error(error)
        res.status(500).send(error)
        return;
    }
    
    if(result === null) {
        res.status(400).send("invalid credentials")
        return;
    }

    let token = jwt.sign({
        uuid: result.id,
        username: req.body.username,
        "role": result.role,
        scopes: authService.getScopes(result.role),
    }, secrets.jwtPassPhrase);

    res.send({
        bearer: token
    })
})

module.exports = router;
