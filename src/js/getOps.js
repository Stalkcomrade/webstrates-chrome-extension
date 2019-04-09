'use strict';

const getOps = () => {

    var input = "dull-warthog-73"
    var current = input

    return fetch("https://webstrates.cs.au.dk/" + current + "/?ops")
        .then((html) => {
            return html.json()
        })
        .then((body) => {
            console.log("Fetched:\n", current)
            var versioningRaw = body
            return body
        })
}

console.log(getOps())