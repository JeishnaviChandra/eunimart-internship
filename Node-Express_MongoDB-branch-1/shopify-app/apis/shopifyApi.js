const express = require('express');
const bodyParser = require('body-parser');
const cookie = require('cookie');
const { buildInstallURL, validateCode, getProducts, addProduct, updateProduct, deleteProduct } = require('../services/shopifyService');
const axios = require('axios')
const shopifyRouter = express.Router();
shopifyRouter.use(bodyParser.json());

shopifyRouter.route('/')

.get((req, res, next) => {
	const shop = req.query.shop;
	console.log("query", req.query)
	if (shop) {
		const { installUrl, state } = buildInstallURL(shop)
		res.cookie('state', state)
		res.redirect(installUrl)
	} else {
		return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
	}
})

shopifyRouter.route('/callback')

.get( async (req, res, next) => {
	const { shop, hmac, code, state } = req.query;
	const stateCookie = cookie.parse(req.headers.cookie).state;
	if (state !== stateCookie) {
		return res.status(403).send('Request origin cannot be verified');
	}
	try {
		const response = await validateCode(shop, hmac, code, req.query)
		res.status(200)
		res.send(response)
	} catch (error) {
		res.status(400)
		res.send(error)
	}
})

shopifyRouter.route('/products')

.get(async (req, res, next) => {
	const { shop } = req.query
	console.log("in products")
	if (shop) {
		try {
			const products = await getProducts(shop);
			res.status(200)
			res.send(products)
		} catch (error) {
			if(error.startsWith("install app")){
				res.status(302)
				return res.redirect("/shopify?shop=" + shop)
			}
			res.status(400)
			res.send(error)
		}
	} else {
		res.status(400)
		res.send('Missing shop query dstring parameter')
	}
})

.post(async (req, res, next) => {
	const { shop, product } = req.body
	if (shop && product) {
		try {
			const addedProduct = await addProduct(shop, product)
			res.status(200)
			res.send(addedProduct)
		} catch (error) {
			if(error.startsWith("install app")){
				res.status(302)
				return res.redirect("/shopify?shop=" + shop)
			}
			res.status(400)
			res.send(error)			
		}
	} else {
		res.status(200)
		res.send('Missing shop or accesstoken or product')
	}
})

shopifyRouter.route('/products/:productId/')
.put(async (req, res, next) => {
	const { shop, product } = req.body
	const productId = req.params.productId
	// console.log("ID", productId, req.params)
	if (shop && product && productId) {
		try {
			const updatedProduct = await updateProduct(shop, product, productId)
			res.status(200)
			res.send(updatedProduct)
		} catch (error) {
			if(error.startsWith("install app")){
				res.status(302)
				return res.redirect("/shopify?shop=" + shop)
			}
			// console.log('error while updating product 3', error)
			res.status(400)
			res.send(error)			
		}
	} else {
		res.status(400)
		res.send('Missing shop or product or product id')
	}
})

.delete(async (req, res) => {
	const { shop } = req.body
	const { productId } = req.params
	if (shop && productId) {
		try {
			const deletedProduct = await deleteProduct(shop, productId)
			res.status(200)
			res.send(deletedProduct)
		} catch (error) {
			if(error.startsWith("install app")){
				res.status(302)
				return res.redirect("/shopify?shop=" + shop)
			}
			res.status(400)
			res.send(error)
		}
	} else {
		res.status(400)
		res.send('Missing shop or product id')
	}
})

shopifyRouter.route('/orders')
  .get(async(req, res) => {
        console.log("got into orders")
        try {
            const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders.json?status=any';
            const resp = await axios.get(url)
            console.log("order received")
            res.send(resp.data)
        } catch (error) {
            console.log(error)
            res.send("Error occurred while getting orders")
        }
})

.post(async(req, res) => {
    console.log("got into orders")
	console.log(req.body)
    try {
        const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders.json';
        const options = {
            method : 'POST',
			headers: {
				'content-type' : 'application/json',
			},
            url : url,
            data : { order : req.body.order }
        }
		const resp = await axios(options)
        console.log("order posted")
        res.send(resp.data)
    } catch (error) {
        console.log(error.message)
        res.send("Error occurred while creating orders")
    }
});

shopifyRouter.route('/orders/:order_id')

.put(async(req, res) => {
    console.log("got into orders")
    const order_id = req.params.order_id
    try {
        const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders/'+ order_id+ '.json';
        const resp = await axios.post(url)
        console.log("order updated")
        res.send(resp.data)
    } catch (error) {
        console.log(error)
        res.send("Error occurred while updating order")
    }
})

.delete(async(req, res) => {
    console.log("got into orders")
    const order_id = req.params.order_id
    try {
        const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders/'+ order_id+ '.json';
        const resp = await axios.post(url)
        console.log("order deleted")
        res.send(resp.data)
    } catch (error) {
        console.log(error)
        res.send("Error occurred while deleting orders")
    }
})

module.exports = shopifyRouter;
