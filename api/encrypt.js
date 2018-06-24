const secrets = require("./config/secrets");
const crypto = require('crypto');

const pass = "joe";

const hash = crypto.createHmac('sha256', secrets.passwordHashPhrase)
        .update(pass)
        .digest('hex');

console.log(hash)
