'use strict';

// get operational history per a webstrate

// TODO: add server
// TODO: use webstrate.getOps(0, 2)
// TODO: ask Kristina to change HTTP API

const getOps = async (webstrateId) => {

    var current = webstrateId

    return fetch("https://webstrates.cs.au.dk/" + current + "/?ops&from=0&to=2")
        .then((html) => {
            return html.json()
        })
        .then((body) => {
            console.log("Fetched:\n", current)
            console.log(body[0])
            return body[0]
        })
}


/**
 * search for copies given a operational history of a webstrate
 * @param {any} cps - 
 * @returns {array} array of copies given a webstrate
 */
const searchCopies = async (input) => {

    var target = [],
        children = [],
        cpsWs = await getOps(input)

    // returns null if undefined
    if (!cpsWs) {
        return null
    }

    children = {
        value: (typeof cpsWs.create !== "undefined" && typeof cpsWs.create.id !== "undefined" ?
            cpsWs.create.id :
            "no copies found"),
        name: (typeof cpsWs.create !== "undefined" && typeof cpsWs.create.id !== "undefined" ?
            cpsWs.create.id :
            "no copies found"),
        children: (cpsWs.create.id !== input && await searchCopies(cpsWs.create.id))
    }

    target.push(children)
    // console.dir(target)

    return target
};

// returns a promise per each webstrate to
// return a structure later
const getStructure = (webstrateId) => {

    return new Promise(async (resolve, reject) => {

        // var webstrateId = "slimy-cobra-37";
        try {
            var str = await searchCopies(webstrateId)

            if (str != null) {
                console.log("Resolved:", webstrateId)
                resolve(str)
            } else {
                console.log("Rejected", webstrateId)
                reject()
            }


        } catch (error) {
            console.log("Rejected", webstrateId)
            reject(error)
        }
    })

}


// TODO:
// 1. send filtered lists of unique webstrates
// choose only core webstrate server
// filter undefined and google/search related
// try exceptions
// 2. make a promise for every request
// 3. filter rejected promises
// 4. send object back to popup

// INFO: opens port to listen to messages from the content script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {

    console.log("Inside Message Listener")
    console.log("History in Content Script", JSON.parse(request.history))
    var history = JSON.parse(request.history),
        promisessContainer = [],
        singlePromise,
        responseWebstratesStructure;

    history.forEach(webstrateId => {

        singlePromise = getStructure(webstrateId)
        promisessContainer.push(singlePromise)

    })

    console.log("Promises are prepared", promisessContainer)
    console.log("Cutted promises", promisessContainer.slice(0, 5))

    responseWebstratesStructure = await Promise.all(promisessContainer.slice(0, 5))
        .then((structures) => {
            console.log("Structure building is finished", structures)
            return structures
        })

    console.log("Promises stringified before sending", JSON.stringify(responseWebstratesStructure))

    chrome.runtime.sendMessage({
        responseWebstratesStructure: await JSON.stringify(responseWebstratesStructure),
    })

});