const express = require('express')
const skuSercicesRoutes = express.Router()
const skuServices = require('../services/buyandinstall')

skuSercicesRoutes.get('/services', skuServices.getServiceSkus)
skuSercicesRoutes.post('/services', skuServices.postServiceSkus)

module.exports = skuSercicesRoutes;