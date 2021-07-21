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
  console.log('/pokemon/transform/n invoked');
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

/*
 * An endpoint that transforms pokemon resources with a inclusive range
 * of ids, and puts that into an array.  The result is a new json resource
 * produced by this expressjs server.
 */
router.get('/pokemon/transform/:fromPokemonId(\\d+)-:toPokemonId(\\d+)', async (req, res, next)=> {
  console.log('/pokemon/transform/m-n invoked');
  try {
    let m = parseInt(req.params.fromPokemonId);
    let n = parseInt(req.params.toPokemonId);
    if ((m <= n) && (m > 0)) {
      let pokemonIds = [];
      let tsliceArray = [];
      let tsliceNameArray = [];
      for (var i = m; i<=n; i++) {
        // pokemonIds.push(i);
        let pj = await fetchpokapi.pokemonJson(i);
        let slice = await fetchpokapi.pokemonSlice(["name", "stats"], pj);
        let tslice = fetchpokapi.pokemonTransformedSlice(slice);
        tsliceNameArray.push(tslice.name);
        tsliceArray.push(tslice);
      }
      tsliceArray.sort((a,b)=>{
        let aname = a.name;
        let bname = b.name;
        if (aname < bname) {
          return -1;
        }
        if (aname > bname) {
          return 1;
        }
        return 0;
      });
      res.json(tsliceArray);
      /***
      pokemonIds.forEach(async (value, index, array)=>
      {
        let pj = await fetchpokapi.pokemonJson(value);
      });
       ***/
      // res.json({"transformFromTo": {"m": m, "n": n}});
    }
    else {
      throw new Error("problem with m and n");
    }
  }
  catch (e) {
    next(e);
  }
  // The following is an error condition (or we can just throw)
  /// -next does not work (hmmm)
  /// next("Error with m and n");
  /// - throw here does not seem to appear in custom error handler. Why?
  /// throw new Error("Error with m and n");
});

/*
 * An endpoint that catches bad cases that were some to fit into the
 * regexp pattern for the above endpoint.  Notice the presence of
 * (\\d+) in the above.  Notice the lack of these below.
 * Basically, either from nor to should be anything other than ints.
 * Since this is a catch route, it gets put after the real route above.
 */
router.get('/pokemon/transform/:fromPokemonId-:toPokemonId', async (req, res, next)=> {
  console.log('/pokemon/transform/m-n (non-int) invoked');
  // next("Some error");
  try {
    throw new Error("Other error2");
  }
  catch (e) {
    next(e);
  }
  // res.send("alternative to /pokemon/transform/m-n non-int");
});

module.exports = router;
