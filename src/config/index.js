import { merge } from 'lodash'
const env = process.env.NODE_ENV || 'development'
const port = process.env.PORT || 9000

const baseConfig = {
    env,
    isDev: env === 'development',
    isTest: env === 'testing',
    port,
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: '100d'
    }
}

let envConfig = {}

switch (env) {
    case 'dev':
    case 'development':
        envConfig = require('./dev').config
        break
    case 'test':
    case 'testing':
        envConfig = require('./testing').config
        break
    default:
        envConfig = require('./dev').config
}

export default merge(baseConfig, envConfig)
