const express = require('express')

const chalk = require('chalk');

const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require("compression")
const helmet = require('helmet')

module.exports = function() {
    const app = express()

    const isProd = process.env.NODE_ENV === 'production'
    const isStage = process.env.NODE_ENV === 'staging'

    if (isProd || isStage) {
        // Prod settings
        app.use(morgan('short'))
    } else {
        // Dev & Test Settings
        app.use(morgan('dev'))
        app.use(require('express-status-monitor')())
    }

    // General
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(bodyParser.json())

    app.use(compression())
    app.use(helmet())

    app.nativeListen = app.listen
    app.listen = function (port, cb) {

        console.log(chalk.blue(`Super express will listen on port ${port}`))
        console.log(chalk.blue(`Production mode: ${isProd}`))
        app.nativeListen(port, cb)
    }
    return app
};
