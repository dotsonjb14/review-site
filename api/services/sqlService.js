const secrets = require("../config/secrets")
const { Client } = require('pg')

module.exports = {
    executeQuery
};

async function executeQuery(queryString, params) {
    const client = new Client(secrets.sqlSettings)

    await client.connect()
    
    let results = await client.query(queryString, params);

    await client.end();

    return results;
}

