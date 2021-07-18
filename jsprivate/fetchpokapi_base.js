/*
 * Provides fetch web api code access to pokapi.
 * The name has _base because this file will be cat
 * with an ending, to produce the correct module
 * format (commonjs, ecmascript).  Commonjs is used
 * in node, while ecmascript is used when the code
 * needs to be in the browser, in web pages.
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
        await alertFetchResponse(response, "pokemon1");
        return response;
    } catch (e) {
        alert("pokemon1 caught");
    }
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