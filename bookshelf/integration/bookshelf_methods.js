const knex = require('../config/db').knex;
const City = require('../model/city');
const winston = require('winston');

async function save_city(name, area) {

    try {
        let val = await City.forge({ 'name': name, 'area': area}).save();
        console.log(val.toJSON());
        return val;
    } catch (e) {
        console.log(`Failed to save data: ${e}`);
    } finally {
        knex.destroy();
    }
}


async function get_city() {
    try {
        let vals = await City.fetchAll();
        console.log(vals.toJSON());
        return vals;
    } catch (e) {
        console.log(`Failed to fetch data: ${e}`);
    } 
}

async function put_city(id, info) {
    try {
        let update = await City.where('id', id).save(info, {patch: true})
        console.log(update.toJSON())
        return {status: 200, data: "updated"}
    } catch (error) {
        return {status: 400, data: "update failed"}
    }
} 

async function delete_city(id) {
    try {
        let deleted = await City.where('id', id).destroy()
        return {status: 200, data: "deleted"}
    } catch (error) {
        return {status: 400, data: "delete failed"}
    }
}
module.exports = {save_city, get_city, put_city, delete_city}