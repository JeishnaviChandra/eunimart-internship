var express = require('express');
var router = express.Router();
const vari = require('../integration/bookshelf_methods')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//saving the cities
router.post('/savecities', async function(req,res,next) {
  const name = req.body.name;
  const area = req.body.area;

  const cityobj = await vari.save_city(name, area)
  // console.log("resp",cityobj);
  res.send(cityobj)
})

//getting all city details
router.get('/getcities', async function(req,res) {
  // const details = req.body

  const citydetails = await vari.get_city()
  console.log("cityname",citydetails);
  res.send(citydetails)
})

router.put('/updatecity', async function(req,res) {
  const id = req.query.id
  const info = req.body

  const updated = await vari.put_city(id, info)
  console.log("updated city", updated)
  res.send(updated)
})

router.delete('/deletecity', async function(req,res) {
  const id = req.query.id
  console.log(id);

  const deleted = await vari.delete_city(id)
  console.log("deleted city", deleted)
  res.send(deleted)
})
module.exports = router;
