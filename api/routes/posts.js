const router = require('express').Router();
const crudBuilder = require('../services/crudBuilder')

const builder = new crudBuilder();

builder.buildCrud({
    router,
    tableConfig: {
        tableName: 'posts',
        fields: [
            {
                name: "author",
                type: "uuid"
            },
            {
                name: "category",
                type: "uuid"
            },
            "tags",
            "content",
            "title"
        ]
    }
})

module.exports = router;
