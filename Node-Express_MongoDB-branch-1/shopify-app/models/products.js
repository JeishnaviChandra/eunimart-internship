const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        _id : {
            type : String
        }, 
        product : {
        title: {
            type : String
        },
        body_html: {
            type : String
        },
        vendor: {
            type : String
        },
        product_type: {
            type : String
        },
        tags : {
            type : Array
        }, 
        created_at : {
            type : String
        },
        handle : {
            type : String
        },
    }
    },
    {
        timestamps : true,
        id: false
    }
)

let Products = mongoose.model('product', productSchema);
module.exports = Products;