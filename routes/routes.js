const {Router} = require('express')
const skuRoutes = require('./skuRoutes')
const routes = Router()

routes.use('/', skuRoutes)
module.exports = routes;