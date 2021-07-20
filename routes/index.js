var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

const nodefetch = require('node-fetch');

var fetchpokapi = require('../jspublic/fetchpokapi_commonjs');
fetchpokapi.setFetch(nodefetch);
/// REM1
/// router.use(express.static("jspublic"));
// router.use(express.static("stylesheets"));

router.use(bodyParser.json({type:"application/json"}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Trial pokemon page */
router.get('/pokemon1', function(req, res){
  res.render('pokemon1', {});
});

/* Enhanced trial pokemon with details */
router.get('/pokemon1details', function(req, res) {
  res.render('pokemon1details', {});
});

router.get('/pokemon/slice/:pokemonId(\\d+)', async (req, res)=>{
  console.log('/pokemon/slice/n invoked');
  try {
    let pj = await fetchpokapi.pokemonJson(parseInt(req.params.pokemonId));
    let slice = await fetchpokapi.pokemonSlice(["name", "stats"], pj);
    res.json({'slice': slice}).status(200);
    // res.json({'testk':req.params.pokemonId}).status(200);
  }
  catch (e) {
    res.json({"error":"code"}).status(304);
  }
});

router.get('/pokemon/slice/:pokemonId', (req, res)=>{
  console.log('/pokemon/slice/any invoked');
  res.send('alternate for /pokemon/slice/:pokemondId');
});

router.get('/pokemon/transform/:pokemonId(\\d+)', async (req, res)=>{
  console.log('/pokemon/slice/n invoked');
  try {
    let pj = await fetchpokapi.pokemonJson(parseInt(req.params.pokemonId));
    let slice = await fetchpokapi.pokemonSlice(["name", "stats"], pj);
    let tslice = fetchpokapi.pokemonTransformedSlice(slice);
    res.json({'tslice': tslice}).status(200);
    // res.json({'testk':req.params.pokemonId}).status(200);
  }
  catch (e) {
    res.json({"error":"code"}).status(304);
  }
});

module.exports = router;
