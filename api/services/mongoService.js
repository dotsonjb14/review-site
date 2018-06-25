const { MongoClient, ObjectId } = require('mongodb')

module.exports = {
    getDb,
    updateDoc,
    insertDoc,
    getDocs,
    deleteDoc
}

var _client = null;
var _db = null;

const blackList = [
    "_id",
    'asd'
]

// pool the connection, that way I don't need to worry about multiple connects.
async function getDb() {
    if(_client === null || !_client.isConnected) {
        _client = await MongoClient.connect("mongodb://localhost:27017");
        _db = null;
    }
    if(_db === null) {
        _db = _client.db('gfy')
    }
    
    return _db;
}

async function deleteDoc(collectionName, id) {
    let db = await getDb();

    let collection = db.collection(collectionName);

    await collection.deleteOne({_id: ObjectId(id)});
}

async function updateDoc(collectionName, obj, id) {
    let db = await getDb();

    let collection = db.collection(collectionName);

    await collection.updateOne({_id: ObjectId(id)}, { $set: applyBlacklist(obj) });

    let res = await collection.find({_id: ObjectId(id)}).toArray();

    if(res.length !== 0) {
        return res[0];
    }
    else {
        return null;
    }
}
 
async function getDocs(collectionName, filter) {
    let db = await getDb();

    let collection = db.collection(collectionName);

    return await collection.find(filter).toArray();
}

async function insertDoc(collectionName, obj) {
    let db = await getDb();

    let collection = db.collection(collectionName);

    return await collection.insertOne(applyBlacklist(obj));
}

function applyBlacklist(obj) {
    let copy = Object.assign({}, obj);
    for(let i = 0; i < blackList.length; i++) {
        let toDelete = blackList[i];

        if(copy.hasOwnProperty(toDelete)) {
            delete copy[toDelete];
        }
    }

    return copy;
}
