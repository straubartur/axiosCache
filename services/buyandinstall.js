

const ServiceBySku = require('../models/ServiceBySku');
const axiosCache = require('./axiosCache')

const VTEX_PRODUCT_URL = "https://intelbras.vtexcommercestable.com.br/api/catalog_system/pvt/sku/stockkeepingunitbyid/"
const headersInfo = {
    'content-type': 'application/json',
    accept: 'application/json',
    'x-vtex-api-appkey': process.env.VTEX_APP_KEY,
    'x-vtex-api-apptoken': process.env.VTEX_APP_TOKEN
}

function buyAndInstallService()  {
   async function getServiceSkus(req, res) {
        const { sku, destinationCep } = req.query
        try {
            const serviceSku = await ServiceBySku.findOne({
                skuId: sku,
                zipCodeEnd: {
                    $gte: Number(destinationCep)
                },
                zipCodeStart: {
                    $lte: Number(destinationCep)
                },
            })
            if(!serviceSku) {
                return res.status(404).json('Não foram encontradas skus de serviço para este produto')
            }
            
            const vtexProduct = await axiosCache({
                url: `${VTEX_PRODUCT_URL}${"4750069" || serviceSku.serviceSkuId}`,
                method: 'get',
                headers: headersInfo
            })

            return res.json({
                sku: vtexProduct,
            }).status(200)
        } catch (error) {
            console.log(error)
            return res.status(404).json({
                message: "Não foram encontradas skus de serviço para este produto"
            })
        }
    }

    async function postServiceSkus(req, res) {
        const { skuId, serviceSkuId, zipCodeStart, zipCodeEnd } = req.query

        try {
            await ServiceBySku.create({
                serviceSkuId: serviceSkuId,
                skuId,
                zipCodeStart,
                zipCodeEnd
            })
    
            return res.json('criado com sucesso')
        } catch (error) {
            console.log(error)
            res.status(500)
        }
    }
    return {
        getServiceSkus,
        postServiceSkus
    }
}

module.exports = buyAndInstallService();