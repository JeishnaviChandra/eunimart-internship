// const { query } = require('express');
const { getShopResponse, getProducts, updateProduct, deleteProduct } = require('../integration/shopifyIntegration');

const nonce = require('nonce')();
const dotenv = require('dotenv').config();
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_products, write_products';
const forwardingAddress = "https://26ee6bbba610.ngrok.io"; 
const crypto = require('crypto')
const querystring = require('querystring');
const { default: axios } = require('axios');

exports.buildingInstallUrl = (shop) => {
    const state = nonce();
    const redirectUri = forwardingAddress + '/shopify/callback';
    const installUrl = 'https://' + shop +
      '/admin/oauth/authorize?client_id=' + apiKey +
      '&scope=' + scopes +
      '&state=' + state +
      '&redirect_uri=' + redirectUri;
    return {installUrl: installUrl, state: state}
}

exports.validatingAuthCode = ({shop, hmac, code, state}) => {
    return new Promise(async(resolve, reject) => {
        const query = {shop, hmac, code, state}
        const map = Object.assign({}, query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
        crypto
            .createHmac('sha256', apiSecret)
            .update(message)
            .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;
    
        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
        } catch (e) {
            hashEquals = false;
        };
    
        if (!hashEquals) {
            return reject("HMAC validation failed")
        } else {
            const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };
            try {
                const shopResponse = await getShopResponse(shop, accessTokenRequestUrl, accessTokenPayload)
                return resolve(shopResponse)
            } catch (error) {
                return reject(error)
            }
        }
    });
}

exports.getProducts = (shop) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/products.json'
        try {
            const products = await getProducts(shop, url)
            return resolve(products)
        } catch (error) {
            return reject(error)
        }
    })
}

// exports.getOrders('./getOrders', async(req,res) => {
//     try {
//         const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders.json?status=any';
//         const resp = await axios.get(url)
//         console.log("order received")
//         res.send(resp.data)
//     } catch (error) {
//         console.log(error)
//         res.send("Error occurred while getting orders")
//     }
// }) 
    

exports.addProduct = (shop, newProduct) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/products.json'
        try {
            const addedProduct = await addProduct(shop, url, newProduct)
            return resolve(addedProduct)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.updateProduct = (shop, updatedProduct, product_id) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/product/' + product_id + '.json'
        try {
            const updatedProduct = await updateProduct(shop, url, updatedProduct)
            return resolve(updatedProduct)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.deleteProduct = (shop, product_id) => {
    return new Promise(async(resolve, reject) => {
        const url = 'https://' + shop + '/admin/api/2021-01/product/' + product_id + '.json'
        try {
            const deletedProduct = await deleteProduct(shop, url)
            return resolve(deletedProduct)
        } catch (error) {
            return reject(error)
        }
    })
}