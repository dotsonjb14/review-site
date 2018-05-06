const secrets = require("../config/secrets")
const { Client } = require('pg')

class sqlService
{
    async executeQuery(queryString, params) {
        const client = new Client(secrets.sqlSettings)

        await client.connect()
        
        let results = await client.query(queryString, params);

        await client.end();

        return results;
    }
}

module.exports = sqlService;
