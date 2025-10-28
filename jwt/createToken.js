var jwt = require('jsonwebtoken')

module.exports = function createToken(id) {
    return jwt.sign({ id }, 'secretKey', { expiresIn: 60 * 60 })
}