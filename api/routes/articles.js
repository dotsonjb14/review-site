const sqlService = require("../services/sqlService")
const uuid = require('uuid/v4');

const router = require('express').Router();

const authService = require('../services/authService');

const scopes = (scope) => authService.requireScopes(["adminpanel", scope]);

router.get('/', [async (req, res) => {
    try {
        let results = await sqlService.executeQuery('SELECT * from article');
        res.send(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}]);

router.get('/search', [async (req, res) => {
    try {
        let results = await sqlService.executeQuery('SELECT * from article');
        res.send(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}]);

router.post('/', [scopes('article:add'), async (req, res) => {
    let data = Object.assign({}, req.body, {
        id: uuid()
    });

    let sqlQuery = 'INSERT INTO article \
    (id,         author,   category, tags,     content,  title,    product,  created_at, modified_at, active) VALUES \
    ($1::uuid,   $2::uuid, $3::uuid, $4::text, $5::text, $6::text, $7::uuid, NOW(),   NOW(), false)'

    try {
        await sqlService.executeQuery(sqlQuery, [
            data.id, data.author, data.category, data.tags, data.content, data.title, data.product
        ])
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}])

router.delete('/:id', [scopes('article:delete'), async (req, res) => {
    let id = req.params.id;

    let sqlQuery = 'DELETE FROM article WHERE id = $1::uuid'

    try {
        await sqlService.executeQuery(sqlQuery, [id])
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}])

router.put('/:id', [scopes('article:update'), async (req, res) => {
    let id = req.params.id;
    let data = Object.assign({}, req.body, {
        id: id
    });

    let sqlQuery = 'UPDATE article SET \
                    category = $2::uuid, tags = $3::text, content = $4::text, title = $5::text, product = $6::uuid, modified_at = NOW()\
                    WHERE id = $1::uuid'

    try {
        await sqlService.executeQuery(sqlQuery, [id, data.category, data.tags, data.content, data.title, data.product])
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}])

router.put('/publish/:id', [scopes('article:publish'), async (req, res) => {
    let id = req.params.id;

    let sqlQuery = 'UPDATE article SET \
                    active = true, modified_at = NOW(), published_at = NOW()\
                    WHERE id = $1::uuid'

    try {
        await sqlService.executeQuery(sqlQuery, [id])
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
}]);

module.exports = router;
