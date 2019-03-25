// console.log("storage")

chrome.runtime.onInstalled.addListener(function() {

    // TODO: read user servers first

    var serversDefined = ["webstrates.cs.au.dk", "webstrates.r2.enst.fr"]

    // INFO: this fun duplicates one in vue mixins
    function restore_options() {

        chrome.storage.sync.get(null, (servers) => {

            Object.values(servers.server).forEach(server => {
                serversDefined.push(server) // SOLVED: server is not really array get array of values
                alert(server)
            })

        })
    }


    function extractBookmarks(a) {

        chrome.bookmarks.search(a, function(items) {

            // INFO: extracting new bookmarks
            var source = [];
            for (var i = 0; i < items.length; i++) {
                source[i] = items[i];
            }

            // TODO: first, check whether config already contains
            // extracted bookmarks

            chrome.storage.sync.get(null, (result) => {

                if (result["config"] !== undefined) {

                    debugger;
                    //   var array = Array.isArray(result["config"]) ? result["config"] : [result["config"]]
                    var array = Array.isArray(result["config"]) && result["config"]
                    var jsObj = {}
                    console.log("CALL", array)
                    jsObj["config"] = array
                    // jsObj["config"].push(source)
                    jsObj["config"] = jsObj["config"].concat(source)

                    console.log("BACK")

                    // TODO: check for duplicates
                    // console.log("storage")

                    chrome.storage.sync.set({
                            // config: source
                            config: jsObj["config"]
                        },
                        null
                    );

                    //  alert(source[0].title);

                }

            })



        });
    }

    restore_options();

    // clean bookmark storage
    // chrome.storage.sync.set({
    //         // config: source
    //         config: []
    //     },
    //     null
    // );

    setTimeout(() => {

        serversDefined.forEach(srv => {

            console.log(srv)
            extractBookmarks(srv);

        })

    }, 1000)

});