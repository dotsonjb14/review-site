const sqlService = require("../services/sqlService")
const router = require('express').Router();
const authService = require('../services/authService');
const mongoService = require('../services/mongoService');

const scopes = (scope) => authService.requireScopes(["adminpanel", scope]);

router.get('/', [async (req, res) => {
    try {
        var results = await mongoService.getDocs('articles', {});
        res.status(200).send(results);
    } catch (error) {
        res.status(500).send('error');
    }
}]);

router.get('/search', [async (req, res) => {
    res.status(200).send('yo')
}]);

router.post('/', [scopes('article:add'), async (req, res) => {
    try {
        var result = await mongoService.insertDoc('articles', req.body);
        res.status(201).send(Object.assign(req.body, {
            _id: result.inser1tedId
        }))
    } catch (error) {
        res.status(500).send('error');
    }
}])

router.delete('/:id', [scopes('article:delete'), async (req, res) => {
    try {
        var result = await mongoService.deleteDoc('articles', req.params.id);
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('error');
    }
}])

router.patch('/:id', [scopes('article:update'), async (req, res) => {
    try {
        var result = await mongoService.updateDoc('articles', req.body, req.params.id);
        res.status(200).send(result)
    } catch (error) {
        res.status(500).send('error');
    }
}])

module.exports = router;
