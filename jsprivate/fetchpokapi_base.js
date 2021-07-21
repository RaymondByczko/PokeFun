/*
 * Provides fetch web api code access to pokapi.
 * The name has _base because this file will be cat
 * with an ending, to produce the correct module
 * format (commonjs, ecmascript).  Commonjs is used
 * in node, while ecmascript is used when the code
 * needs to be in the browser, in web pages.
 */

/*
 * setFetch and fetchFunction allow the particular
 * fetch function to be assigned, and utilized, per
 * the context in which this module is used.
 *
 * In node.js (server side), setFetch will be called.
 * Its argument is something like that which is
 * obtained with node-fetch.  Here is some server side
 * code from index.js.
 *
 *      const nodefetch = require('node-fetch');
 *      var fetchpokapi = require('../jspublic/fetchpokapi_commonjs');
 *      fetchpokapi.setFetch(nodefetch);
 *
 * On the client side, the native fetch will be used.  This is
 * arranged by *NOT CALLING setFetch*.  And so there is not require
 * of 'node-fetch' either.
 *
 * So are the accomodations that are made between the server and client sides.
 * @todo setFetch is exported in both the commonjs and ecmascript worlds.
 * It should not be exported in the ecmascript world if it will not
 * be called there.
 */
var fetchFunction;

function setFetch(preferredFetch) {
    fetchFunction = preferredFetch;
}

/*
 * Provides proof of concept of pokeapi to sample endpoint.
 * Lets see whats returned.  Everything is hardcoded to
 * keep it simple.
 */
async function pokemon1() {
    try {
        let url = 'https://pokeapi.co/api/v2/pokemon/1';
        let data = {};
        let opt = {
            method: 'GET',
            headers: {
                'Accept':'application/json'
            }
        }
        let response = await fetch(url, opt);
        // await alertFetchResponse(response, "pokemon1");
        return response;
    } catch (e) {
        // alert("pokemon1 caught");
        console.log('pokemon1 caught');
        throw e;
    }
}

/*
 * A more generalized version to check and use the pokemon api.
 * The resource number n can be specified as an integer.
 * The response of the fetch is returned.  Make sure to do
 * something like response.json() to get the json body.
 */
async function pokemon(n) {
    try {
        if (typeof(n) != "number") {
            throw new Error("fetchpokapi_base:need a number");
        }
        if (!Number.isInteger(n)) {
            throw new Error("fetchpokapi_base:need an integer");
        }
        let url = 'https://pokeapi.co/api/v2/pokemon/' + n.toString();
        let data = {};
        let opt = {
            method: 'GET',
            headers: {
                'Accept':'application/json'
            }
        }
        if (fetchFunction == undefined) {
            fetchFunction = fetch;
        }
        let response = await fetchFunction(url, opt);
        // await alertFetchResponse(response, "pokemon1");
        return response;
    } catch (e) {
        console.log("fetchpokapi_base:pokemon caught");
        console.log("... message = " + e.message);
        throw e;
    }
}

/*
 * Obtains the json body of the response fetched from the endpoint.
 * @todo The url of the endpoint is embedded in pokemon(n).
 * This can be further generalized and made available to the client
 * code.
 */
async function pokemonJson(n) {
    /* let response = await pokemon(n); */
    let response = await pokemon(n);
    if (response.ok) {
        let j = await response.json();
        return j;
    }
    else {
        throw new Error("pokemonJson:response is not ok");
    }
}

/*
 * Given the (slice) properties in the whole json object
 * this function returns a slice of the original whole.
 * Its like ignoring everything in whole except
 * certain properties specified by sliceProperties.
 * whole is typically produced by calling pokemonJson.
 *
 * Sample client code @todo See if this works!
 * let myWhole = await pokemonJson(1);
 * let mySliceProperties = ["stats", "name"];
 * let mySlice = await pokemonSlice(mySliceProperties, myWhole);
 *
 */
async function pokemonSlice(sliceProperties, whole) {
    console.log('pokemonSlice:start');
    let sliceValue = {};

    sliceProperties.forEach(function(val, ind, array){
        console.log("...val="+val);
        sliceValue[val] = whole[val];
    });
    return sliceValue;
}
/*
 * Transforms a slice given to it.  The slice is assumed
 * to have two properties ('name' and 'stats').
 */
function pokemonTransformedSlice(slice) {
    if ((slice === undefined) || (slice === null)) {
        throw new Error("problem with slice");
    }
    if ((slice.name === undefined) || (slice.name === null) )
    {
        throw new Error("problem (name property) with slice");
    }
    if ((slice.stats === undefined) || (slice.stats === null) )
    {
        throw new Error("problem (stats property) with slice");
    }

    let transformedSlice = {};
    transformedSlice['name'] = slice['name'];
    transformedSlice['stats'] = [];
    slice.stats.forEach(function(val, ind, array){
        let name = val['stat']['name'];
        let stat = val['base_stat'];
        let statObject =
            {
                'name':name,
                'stat':stat
            };
        transformedSlice['stats'].push(statObject);
    });
    return transformedSlice;
}

async function alertFetchResponse(responseOriginal, firstAlert="",numberHeaders=5) {

    let response = responseOriginal.clone();
    alert("alertFetchResponse:start");
    alert(firstAlert);
    alert("response="+response);
    alert("response.headers="+response.headers);
    let i = 0;
    for (const pair of response.headers.entries()){
        alert("pair0, pair1="+pair[0]+":"+pair[1]);
        i++;
        if (i===numberHeaders) {
            break;
        }
    }
    alert("responseheaders end");
    alert("response.body="+response.body);
    let bd = await response.json();
    alert("response.json()="+JSON.stringify(bd));
    alert("response.status="+response.status);
    alert("JS(response)="+JSON.stringify(response));
}

function propertiesOf(jsonPok) {
    return Object.getOwnPropertyNames(jsonPok);
}