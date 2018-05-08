const sqlService = require("../services/sqlService")
const uuid = require('uuid/v4');

const sql = new sqlService();

class crudBuilder {
    buildCrud({router, tableConfig}) {
        router.get("/", function (req, res) {
            sql.executeQuery(`SELECT * from ${tableConfig.tableName}`)
                .catch(err => {
                    res.status(500).send(err);
                })
                .then(results => {
                    res.send(results.rows);
                });
        })

        router.get("/:id", function (req, res) {
            let id = req.params.id;
            sql.executeQuery(`SELECT * from ${tableConfig.tableName} WHERE id = $1::uuid`, [id])
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

            let fieldsToMap = tableConfig.fields.slice();
            fieldsToMap.push({
                "name": 'id',
                "type": 'uuid'
            })

            let fieldNames = fieldsToMap.map(field => {
                if(typeof field === "string") return field;
                else return field.name;
            })

            let fieldParams = fieldsToMap.map((field, index) => {
                let type = 'text';
                if(typeof field !== "string") {
                    type = field.type;
                }

                return `$${index + 1}::${type}`;
            })

            let fieldValues = fieldNames.map(field => {
                return data[field]
            })

            let sqlQuery = `INSERT INTO ${tableConfig.tableName} (${fieldNames.join(',')}) VALUES (${fieldParams.join(',')})`
        
            sql.executeQuery(sqlQuery, fieldValues)
                .catch(err => {
                    res.status(500).send(err);
                })
                .then(results => {
                    res.send(data);
                });
        })
        
        router.put("/:id", function (req, res) {
            let id = req.params.id;

            let data = Object.assign({}, req.body);

            let fieldsToMap = tableConfig.fields.slice();

            let fieldNames = fieldsToMap.map(field => {
                if(typeof field === "string") return field;
                else return field.name;
            })

            let fieldParams = fieldsToMap.map((field, index) => {
                let type = 'text';
                let name = field;

                if(typeof field !== "string") {
                    type = field.type;
                    name = field.name;
                }

                return `${name} = $${index + 1}::${type}`;
            })

            let fieldValues = fieldNames.map(field => {
                return data[field]
            })

            fieldValues.push(id);

            let sqlQuery = `UPDATE ${tableConfig.tableName} SET ${fieldParams.join(',')} WHERE id = $${fieldValues.length}::uuid`
        
            sql.executeQuery(sqlQuery, fieldValues)
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
        
            sql.executeQuery(`DELETE FROM ${tableConfig.tableName} WHERE id = $1::uuid`, [req.params.id])
                .catch(err => {
                    res.status(500).send(err);
                })
                .then(results => {
                    res.status(204).send();
                });
        })
    }
}

module.exports = crudBuilder;
