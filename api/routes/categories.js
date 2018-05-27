const sqlService = require("../services/sqlService")
const uuid = require('uuid/v4');

const router = require('express').Router();

const authService = require('../services/authService');

const scopes = authService.requireScopes(["adminpanel", "category:all"]);

router.get('/', [async (req, res) => {
    try {
        let results = await sqlService.executeQuery('SELECT * from category');
        res.send(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}]); 

router.post('/', [scopes, async (req, res) => {
    let data = Object.assign({}, req.body, {
        id: uuid()
    });

    let sqlQuery = 'INSERT INTO category (id, name) VALUES ($1::uuid, $2::text)'

    try {
        await sqlService.executeQuery(sqlQuery, [data.id, data.name])
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}])

router.delete('/:id', [scopes, async (req, res) => {
    let id = req.params.id;

    let sqlQuery = 'DELETE FROM category WHERE id = $1::uuid'

    try {
        await sqlService.executeQuery(sqlQuery, [id])
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}])

router.put('/:id', [scopes, async (req, res) => {
    let id = req.params.id;
    let data = Object.assign({}, req.body, {
        id: id
    });

    let sqlQuery = 'UPDATE category SET name = $2::text WHERE id = $1::uuid'

    try {
        await sqlService.executeQuery(sqlQuery, [id, data.name])
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}])

module.exports = router;
