const mongodb = require('mongodb').MongoClient

module.exports = {
    getDb
}

var _client = null;
var _db = null;

// pool the connection, that way I don't need to worry about multiple connects.
async function getDb() {
    if(client === null || !_client.isConnected) {
        _client = await mongodb.connect("mongodb://localhost:27017");
        _db = null;
    }
    if(_db === null) {
        _db = _client.db('gfy')
    }
    
    return _db;
}
