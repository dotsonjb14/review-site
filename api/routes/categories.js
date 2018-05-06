const router = require('express').Router();
const uuid = require('uuid/v4');
const sqlService = require("../services/sqlService")

const sql = new sqlService();

router.get("/", function (req, res) {
    sql.executeQuery("SELECT * from categories")
        .catch(err => {
            res.status(500).send(err);
        })
        .then(results => {
            res.send(results.rows);
        });
})

router.post("/", function (req, res) {
    let data = Object.assign({}, req.body, {
        id: uuid()
    });

    sql.executeQuery("INSERT INTO categories (name, id) VALUES ($1::text, $2::uuid)", [data.name, data.id])
        .catch(err => {
            res.status(500).send(err);
        })
        .then(results => {
            res.send(data);
        });
})

router.put("/:id", function (req, res) {
    let id = req.params.id;

    sql.executeQuery("UPDATE categories SET name = $1::text WHERE id = $2::uuid", [req.body.name, req.params.id])
        .catch(err => {
            res.status(500).send(err);
        })
        .then(results => {
            res.send(Object.assign({}, req.body, {
                id: id
            }));
        });
})

router.delete("/:id", function (req, res) {
    let id = req.params.id;

    sql.executeQuery("DELETE FROM categories WHERE id = $1::uuid", [req.params.id])
        .catch(err => {
            res.status(500).send(err);
        })
        .then(results => {
            res.status(204).send();
        });
})

module.exports = router;
