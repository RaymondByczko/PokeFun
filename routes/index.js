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
let pokemonApp = new fetchpokapi.ApplicationDetails();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: fetchpokapi.ApplicationDetails.title /*'Pokemon API Application'*/, about: fetchpokapi.ApplicationDetails.about , endpoints: pokemonApp.endpoints, endpointExamples: pokemonApp.endpointsExample});
});

/* Trial pokemon page */
router.get('/pokemon1', function(req, res){
  res.render('pokemon1', {});
});

/* Enhanced trial pokemon with details */
router.get('/pokemon1details', function(req, res) {
  res.render('pokemon1details', {});
});

/*
 * Endpoint that gets a slice of the Pokemon given by a resource id.
 * The returned slice is put into the value associated with the
 * toplevel key, 'slice'.
 */
let indexEndpoint = pokemonApp.addEndpoint('/pokemon/slice/:pokemonId(\\d+)');
pokemonApp.addEndpointExample(indexEndpoint, '/pokemon/slice/1');
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

/*
 * A fallback endpoint used if the client does not specify an integer.
 * Note the presence of the regexp \\d+ in the above path.  Notice the
 * lack of it in this one.
 */
router.get('/pokemon/slice/:pokemonId', (req, res)=>{
  console.log('/pokemon/slice/any invoked');
  res.send('alternate for /pokemon/slice/:pokemondId');
});

/*
 * The endpoint that first fetches the Pokemon, then takes a slice of it,
 * and lastly transforms it.
 */
indexEndpoint = pokemonApp.addEndpoint('/pokemon/transform/:pokemonId(\\d+)');
pokemonApp.addEndpointExample(indexEndpoint, '/pokemon/transform/1');
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
 * of ids, and puts that into an array.  The array is sorted according to
 * the Pokemon name.  The result is a new json resource produced by this
 * expressjs server.
 */
indexEndpoint = pokemonApp.addEndpoint('/pokemon/transform/:fromPokemonId(\\d+)-:toPokemonId(\\d+)');
pokemonApp.addEndpointExample(indexEndpoint, '/pokemon/transform/1-2');
router.get('/pokemon/transform/:fromPokemonId(\\d+)-:toPokemonId(\\d+)', async (req, res, next)=> {
  console.log('/pokemon/transform/m-n invoked');
  try {
    let m = parseInt(req.params.fromPokemonId);
    let n = parseInt(req.params.toPokemonId);
    if ((m <= n) && (m > 0)) {
      if (false) {
        ///// ST
        let pokemonIds = [];
        let tsliceArray = [];
        let tsliceNameArray = [];
        for (var i = m; i <= n; i++) {
          // pokemonIds.push(i);
          let pj = await fetchpokapi.pokemonJson(i);
          let slice = await fetchpokapi.pokemonSlice(["name", "stats"], pj);
          let tslice = fetchpokapi.pokemonTransformedSlice(slice);
          tsliceNameArray.push(tslice.name);
          tsliceArray.push(tslice);
        }
        tsliceArray.sort((a, b) => {
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
        ///// EN
      }
      let tsliceArray = await fetchpokapi.pokemonSortedTransformed(m, n);
      res.json(tsliceArray);
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

/*
 * This endpoint computes an average for each stat encountered in
 * 1 or more pokemon resources.  These pokemon resources are identified
 * by ids in the inclusive range, fromPokemonId and toPokemonId.
 *
 * The body returned by this endpoint is json and looks something like:
 * [
 *    {
 *      "name":"hp",
 *      "stat":58.333333333333336
 *    },
 *    {
 *      "name":"attack",
 *      "stat":66.66666666666667
 *    },
 *    {
 *      "name":"defense",
 *      "stat":59.666666666666664
 *    },
 *    {
 *      "name":"special-attack",
 *      "stat":83
 *    },
 *    {
 *      "name":"special-defense",
 *      "stat":66.66666666666667
 *    },
 *    {
 *      "name":"speed",
 *      "stat":81.66666666666667
 *    }
 * ]
 *
 * (The above is from:http://localhost:3000/pokemon/averagestat/4-6
 */
indexEndpoint = pokemonApp.addEndpoint('/pokemon/averagestat/:fromPokemonId(\\d+)-:toPokemonId(\\d+)');
pokemonApp.addEndpointExample(indexEndpoint,'/pokemon/averagestat/1-3');
router.get('/pokemon/averagestat/:fromPokemonId(\\d+)-:toPokemonId(\\d+)', async (req, res, next)=> {
  console.log('/pokemon/averagestat/m-n (non-int) invoked');
  try {
    let m = parseInt(req.params.fromPokemonId);
    let n = parseInt(req.params.toPokemonId);
    if (!((m <= n) && (m > 0))) {
      throw new Error(`problem with m, n: ${m}, ${n}`)
    }
    let tsliceArray = await fetchpokapi.pokemonSortedTransformed(m, n);
    let aveStats = await fetchpokapi.pokemonAverageStats(tsliceArray);
    res.json(aveStats);
  }
  catch (e) {
    next(e);
  }
});



router.get('/pokemon/averagestat/:fromPokemonId-:toPokemonId', async (req, res, next)=> {
  console.log('/pokemon/averagestat/m-n (non-int) invoked');
  try {
    throw new Error("endpoint /pokemon/averagestat/m-n error: ints not specified");
  }
  catch (e) {
    next(e);
  }
});

indexEndpoint = pokemonApp.addEndpoint('/pokemon/transformaveragecombo/:fromPokemonId(\\d+)-:toPokemonId(\\d+)');
pokemonApp.addEndpointExample(indexEndpoint,'/pokemon/transformaveragecombo/1-3');
router.get('/pokemon/transformaveragecombo/:fromPokemonId(\\d+)-:toPokemonId(\\d+)', async (req, res, next)=> {
  console.log('/pokemon/transformsaveragecombo/m-n (int-int) invoked: OK');
  try {
    let m = parseInt(req.params.fromPokemonId);
    let n = parseInt(req.params.toPokemonId);
    if (!((m <= n) && (m > 0))) {
      throw new Error(`problem with m, n: ${m}, ${n}`)
    }

    let tsliceArray = await fetchpokapi.pokemonSortedTransformed(m, n);
    let aveStats = await fetchpokapi.pokemonAverageStats(tsliceArray);
    res.json({"pokemon":tsliceArray, "averages":aveStats});
  }
  catch (e) {
    next(e);
  }
});

router.get('/pokemon/transformaveragecombo/:fromPokemonId-:toPokemonId', async (req, res, next)=> {
  console.log('/pokemon/transformsaveragecombo/m-n (non-int) invoked: NOT OK');
  try {
    throw new Error("endpoint /pokemon/averagestat/m-n error: ints not specified");
  }
  catch (e) {
    next(e);
  }
});
module.exports = router;
