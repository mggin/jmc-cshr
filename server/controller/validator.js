const Jwt = require('jsonwebtoken')
const config = require('../config/key.json')
function isValidToken(request) {
    if (request.headers['authorization']) {
        try {
            let decode = Jwt.verify(request.headers['authorization'], config.tokenKey)
            return true
        } catch(error) {
            return false
        }
    } else {
        return false
    }
}

module.exports = isValidToken;