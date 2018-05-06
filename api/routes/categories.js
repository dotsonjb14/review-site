const router = require('express').Router();
const crudBuilder = require('../services/crudBuilder')

const builder = new crudBuilder();

builder.buildCrud({
    router,
    tableConfig: {
        tableName: 'categories',
        fields: ['name']
    }
})

module.exports = router;
