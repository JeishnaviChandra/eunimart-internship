const { buildingInstallUrl, validatingAuthCode, getProducts, addProduct, updateProduct, deleteProduct } = require("../services/shopifyServices");
const express = require('express')
var shopifyRouter = express.Router();
shopifyRouter.route('/')
.get(async(req, res) => {
    console.log("in shopify")
    const shop = req.query.shop;
    if (shop) { 
        const {installUrl, state} = buildingInstallUrl(shop)  
        res.cookie('state', state);
        console.log("install url", installUrl)
        res.redirect(installUrl);
    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

shopifyRouter.route('/callback')
.get(async(req, res) => {
    console.log('In Callback')
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }
    if (shop && hmac && code) {
        try {
            const shopResponse = validatingAuthCode(req.query)
            res.status(200).send(shopResponse)
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        res.status(400).send('Required parameters missing');
    }
});

shopifyRouter.route('/products')
.get(async(req, res) => {
    const {shop} = req.query
    console.log("got into products")
    if (shop){
        try {
            const products = await getProducts(shop)
            res.status(200)
            res.send(products)
        } catch (error) {
            res.status(400)
            res.send(error)
        }
    } else {
		console.log(req.query)
		res.status(400)
        res.send("shop missed")
	}
});
shopifyRouter.route('/products')
.post(async(req, res) => {
    const {product, shop} = req.body
    console.log("inproducts")
    if (shop && product){
        try {
            const addedProduct = await addProduct(shop, product)
            res.status(200)
            res.send(addedProduct)
        } catch (error) {
            res.status(400)
            res.send(error)
        }
    } else {
        res.status(400)
        res.send("missing shop or product")
    }
  });

  shopifyRouter.route('/products/:product_id')
  .put(async(req, res) => {
  
    const {product_id} = req.params
	const {shop, product} = req.body

	console.log(req.params)
    console.log("updted products")

    if (shop && product){
        try {
            const updatedProduct = await updateProduct(shop, product, product_id)
            res.status(200)
            res.send(updatedProduct)
        } catch (error) {
            res.status(400)
            res.send(error)
        }
    } else {
        res.status(400)
        res.send("missing shop or product")
    }
  });

  shopifyRouter.route('/products/:product_id')
  .delete(async(req, res) => {
  
    const {product_id} = req.params
	const {shop} = req.body

	console.log(req.params)
    console.log("deleted products")

    if (shop){
        try {
            const deletedProduct = await deleteProduct(shop, product, product_id)
            res.status(200)
            res.send(deletedProduct)
        } catch (error) {
            res.status(400)
            res.send(error)
        }
    } else {
        res.status(400)
        res.send("missing shop")
    }
  });

  
  shopifyRouter.get('./getOrders', async(req, res) => {
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
});

shopifyRouter.post('./postOrders', async(req, res) => {
    console.log("got into orders")
    try {
        const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders.json';
        const resp = await axios.post(url)
        console.log("order posted")
        res.send(resp.data)
    } catch (error) {
        console.log(error)
        res.send("Error occurred while creating orders")
    }
});

shopifyRouter.delete('./deleteOrders', async(req, res) => {
    console.log("got into orders")
    const order_id = req.query.order_id
    try {
        const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders/'+ order_id+ '.json';
        const resp = await axios.post(url)
        console.log("order deleted")
        res.send(resp.data)
    } catch (error) {
        console.log(error)
        res.send("Error occurred while deleting orders")
    }
});

shopifyRouter.put('./putOrder', async(req, res) => {
    console.log("got into orders")
    const order_id = req.query.order_id
    try {
        const url = 'https://74dffbe019dd03437bda9608f9938ce8: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@closestone.myshopify.com/admin/api/2021-01/orders/'+ order_id+ '.json';
        const resp = await axios.post(url)
        console.log("order updated")
        res.send(resp.data)
    } catch (error) {
        console.log(error)
        res.send("Error occurred while updating order")
    }
});