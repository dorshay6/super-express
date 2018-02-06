const express = require('express')

const chalk = require('chalk');

const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require("compression")
const helmet = require('helmet')
const inflector = require('json-inflector');

const defaultOptions = require('./defaultOptions.json')

module.exports = function(options = {}) {
    const app = express()

    const isProd = process.env.NODE_ENV === 'production'
    const isStage = process.env.NODE_ENV === 'staging'
    const mergedOptions = Object.assign({}, defaultOptions, options)

    if (isProd || isStage) {
        // Prod settings
        app.use(morgan('short'))
    } else {
        // Dev & Test Settings
        app.use(morgan('dev'))
        app.use(require('express-status-monitor')())
    }

    // General
    if( mergedOptions.bodyParser ) {
        app.use(bodyParser.urlencoded({
            extended: true
        }))
        app.use(bodyParser.json())
    }

    if( mergedOptions.compression ) app.use(compression(mergedOptions.compression.options))
    if( mergedOptions.helmet ) app.use(helmet(mergedOptions.helmet.options))

    if (mergedOptions.convertCasing) app.use(inflector(mergedOptions.convertCasing === true ? undefined : mergedOptions.convertCasing));

    app.nativeListen = app.listen
    app.listen = function (port, cb) {
        console.log(chalk.blue(`Super express will listen on port ${port}`))
        console.log(chalk.blue(`Production mode: ${isProd}`))
        app.nativeListen(port, cb)
    }

    return app
};
