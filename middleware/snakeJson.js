const changeCase = require('change-case');

module.exports = (req, res, next) => {
    res.snakeJson = (rawData) => {
        return res.json(changeCase.snakeCase(rawData));
    }
}