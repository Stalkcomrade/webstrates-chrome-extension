/* global chrome fetch */
'use strict';

/**
 * get operational history per a webstrate
 * TODO: add server
 * @param {any} webstrateId
 */
const getOps = async (webstrateId) => {

    return fetch("https://webstrates.cs.au.dk/" + webstrateId + "/?ops&from=0&to=2")
        .then((html) => {
            return html.json()
        })
        .then((body) => {
            console.log("Fetched:\n", webstrateId, body[0])
            return body[0]
        })
}


/**
 * search for copies given a operational history of a webstrate
 * @param {any} cps
 * @returns {array} array of copies given a webstrate
 */
const searchCopies = async (input) => {

    var target = [],
        children,
        cpsWs = await getOps(input);

    // returns null if undefined
    if (!cpsWs) {
        console.log("Inspect", input)
        return null
    }

    // adds id of the webstrate

    children = {
        webstrateId: (typeof cpsWs.create !== "undefined" && typeof cpsWs.create.id !== "undefined" ?
            cpsWs.create.id :
            "no copies found"),
        children: (cpsWs.create.id !== input && await searchCopies(cpsWs.create.id))
    }

    target.push({
        webstrateId: input,
        children: await children
    })

    return target
};


/**
 * returns a promise per each webstrate to
 * return a structure later
 * Instead of rejecting promises, they are resolved with null
 * @param {any} webstrateId
 */
const getStructure = (webstrateId) => {

    return new Promise(async (resolve, reject) => {

        try {
            var str = await searchCopies(webstrateId)

            if (str != null) {
                console.log("Resolved:", webstrateId)
                resolve(str)
            } else {
                console.log("Rejected", webstrateId)
                resolve(null) // instead of rejecting, I am resolving with null
            }

        } catch (error) {
            console.log("Rejected", webstrateId)
            // checking whether resolve with null will change
            // promise.all behaviour
            // indeed, it helped
            resolve(null)
            // reject(error)
        }
    })

}


// 1. send filtered lists of unique webstrates
// choose only core webstrate server
// filter undefined and google/search related
// 2. make a promise for every request
// 3. filter rejected promises
// 4. send object back to popup

// INFO: opens port to listen to messages from the content script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {

    var history = JSON.parse(request.history),
        promisessContainer = [],
        singlePromise,
        responseWebstratesStructure;

    console.log("Inside Message Listener")
    console.log("History in Content Script", history)

    console.log("History Sliced", history.slice(0, 15))
    history.forEach(webstrateId => {

        singlePromise = getStructure(webstrateId)
        promisessContainer.push(singlePromise)
        console.log(webstrateId + "Promise")

    })

    console.log("Promises are prepared", promisessContainer)
    console.log("Cutted promises", promisessContainer)

    responseWebstratesStructure = await Promise.all(promisessContainer)
    console.log("Promises stringified before sending", JSON.stringify(responseWebstratesStructure))

    chrome.runtime.sendMessage({
        responseWebstratesStructure: await JSON.stringify(responseWebstratesStructure),
    })

});