const axios = require('axios')
const mongoose = require('mongoose')
const request = require('request-promise')

exports.getShopResponse = async(shop, accessTokenRequestUrl, accessTokenPayload) => {
    return new Promise(async(resolve, reject) => {
        const accessTokenResponse = await request.post(accessTokenRequestUrl, { json: accessTokenPayload })
        const accessToken = accessTokenResponse.access_token;
        try {
            let obj  = shopSchema({shopName: shop, accessToken: accessToken})
            const respo = await obj.save()
            console.log("accesstoken", respo)
        } catch (error) {
            console.log("accesstoken error",error)
        }
        const shopRequestUrl = 'https://' + shop + '/admin/api/2021-01/shop.json';
        const shopRequestHeaders = {
            'X-Shopify-Access-Token': accessToken,
        };
        try {
            const shopResponse = await obtainResponse('GET', shopRequestUrl, shopRequestHeaders)
            return resolve(shopResponse)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.getProducts = async(shop, url) => {
    return new Promise (async(resolve, reject) => {
        try {
            let headers = await getHeaders(shop)
            const products = await obtainResponse('GET', url, headers)
            return resolve(products)
        } catch (error) {
            console.log("Error while getting product", error.message, error)
            return reject(error.message)
        }
    })
}


exports.addProduct = async(shop, url, newProduct) => {
    return new Promise (async(resolve, reject) => {
        try {
            let headers = await getHeaders(shop)
            const data = {
                product: newProduct
            }
            const addedProduct = await obtainResponse('POST', url, headers, data)
            return resolve(addedProduct)
        } catch (error) {
            console.log("Error while adding product", error.message, error)
            return reject(error.message)
        }
    })
}

exports.updateProduct = async(shop, url, updatedProduct) => {
    return new Promise (async(resolve, reject) => {
        try {
            let headers = await getHeaders(shop)
            const data = {
                product: updatedProduct
            }
            const updatedProduct = await obtainResponse('PUT', url, headers, data)
            return resolve(updatedProduct)
        } catch (error) {
            console.log("Error while updating product", error.message, error)
            return reject(error.message)
        }
    })
}

exports.deleteProduct = async(shop, url) => {
    return new Promise (async(resolve, reject) => {
        try {
            let headers = await getHeaders(shop)
            const deletedProduct = await obtainResponse('DELETE', url, headers)
            return resolve(deletedProduct)
        } catch (error) {
            console.log("Error while deleting product", error.message, error)
            return reject(error.message)
        }
    })
}


async function obtainResponse(method, url, headers, data = null) {
    return new Promise(async(resolve, reject) => {
        const options = {
            method: method,
            headers: headers,
            url: url,
        }
        if (data) {
            options['data'] = data
        }
        try {
            const response = await axios(options)
            return resolve(response.data)
        } catch (error) {
            console.log(error)
            return reject(error.message)
        }
    })
}

async function getHeaders(shop) {
    return new Promise (async(resolve, reject) => {
        try {
            const shop = await shopSchema.findOne({shopName:shop})
            const headers = {
                'X-Shopify-Access-Token': shop.accessToken,
                'content-type' : 'application/json',
            }
            return resolve(headers)
        } catch (error) {
            console.log("Error while getting access token", error, error.message)
            return reject(error.message)
        }
    })
}
            