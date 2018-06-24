const jwt = require('jsonwebtoken');
const secrets = require("../config/secrets");
const crypto = require('crypto');
const mongoService = require("./mongoService")

const userRoleScopes = []; // no specific permissions
const authorRoleScopes = userRoleScopes.concat(
    ["adminpanel", "article:add", "article:edit", "article:publish"]
);
const adminRoleScopes = authorRoleScopes.concat(
    ["article:delete", "category:all", "product:all"]
);
const superAdminRoleScopes = adminRoleScopes.concat(
    ["productType:all", "users:all"]
);

const scopeMapping = {
    user: userRoleScopes,
    author: authorRoleScopes,
    admin: adminRoleScopes,
    superadmin: superAdminRoleScopes
}

module.exports = {
    getScopes,
    requireScopes,
    loginUser
}

async function loginUser(username, password) {
    const hash = crypto.createHmac('sha256', secrets.passwordHashPhrase)
        .update(password)
        .digest('hex');

    var db = await mongoService.getDb();
    var users = db.collection('users');

    var result = await users.find({
        username: username,
        password: hash
    }).toArray();

    if(result.length !== 0) {
        return result[0];
    }
    else {
        return null;
    }
}

function getScopes(role) {
    console.log(role, scopeMapping[role]);
    return scopeMapping[role];
}

function requireScopes(scopes) {
    return function(req, res, next) {
        let canGoNext = true;
        let token = jwt.verify(req.headers.authorization, secrets.jwtPassPhrase);

        try {
            if(scopes !== void 0 && !hasScopes(scopes, token.scopes)) {
                res.status(400).send("unauthorized");
                canGoNext = false;
            }
            else {
                req.token = token;
            }
        } catch (error) {
            res.status(401).send("invalid token");
            canGoNext = false;
        }
        
        if(canGoNext)
            next();
    }
}

function hasScopes(valid, actual) {
    console.log(valid, actual);
    let hasScopes = true;

    valid.forEach(x => {
        if(actual.indexOf(x) === -1) {
            hasScopes = false;
        }
    });

    return hasScopes;
}
