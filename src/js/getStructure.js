'use strict';

// get operational history per a webstrate

// TODO: add server
// TODO: use webstrate.getOps(0, 2)
// TODO: ask Kristina to change HTTP API

const getOps = async (webstrateId) => {

    var current = webstrateId

    return fetch("https://webstrates.cs.au.dk/" + current + "/?ops")
        .then((html) => {
            return html.json()
        })
        .then((body) => {
            console.log("Fetched:\n", current)
            // var versioningRaw = body[0]
            console.log(body[0])
            return body[0]
        })
}

// const getOps = async (webstrateId) => {

//     var current = webstrateId

//     // webstrate.getOps("")

//     return fetch("https://webstrates.cs.au.dk/" + current + "/?ops")
//         .then((html) => {
//             return html.json()
//         })
//         .then((body) => {
//             console.log("Fetched:\n", current)
//             var versioningRaw = body
//             return body
//         })
// }


/**
 * search for copies given a operational history of a webstrate
 * @param {any} cps - 
 * @returns {array} array of copies given a webstrate
 */
const searchCopies = async (input) => {

    var target = [],
        children = []


    var cpsWs = await getOps(input)

    // var cpsWs = await this.getOpsJsonMixin(input)
    // console.log("cpsWs = ", cpsWs);

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

const getStructure = async (webstrateId) => {

    // var webstrateId = "slimy-cobra-37";
    var str = await searchCopies(webstrateId)

    console.log(str)
    return str

}

// console.log("External Object in Content Script", config)
// alert('Example:' + config);

// var webstrateId = "slimy-cobra-37"
// getStructure(webstrateId)

// INFO: opens port to listen to messages from the content script
// var port = chrome.runtime

chrome.runtime.onMessage.addListener(async (msg) => {

    console.log("Inside Message Listener")

    // var value = "ANSWER"

    // chrome.storage.local.set({
    //     key: value
    // }, function() {
    //     console.log('Value is set to ' + value);
    // });

    var webstrateId = "slimy-cobra-37"
    var dt = await getStructure(webstrateId)

    // FIXME: make async 
    chrome.runtime.sendMessage({
        // answer: "answer to popup"
        answer: await JSON.stringify(dt)
    })

    // if (msg.question == "Who's there?")
    //     port.postMessage({
    //         answer: "Madame"
    //     });
    // else if (msg.question == "Madame who?")
    //     port.postMessage({
    //         answer: "Madame... Bovary"
    //     });
});