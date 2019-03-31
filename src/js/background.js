chrome.runtime.onInstalled.addListener(function() {

    // SOLVED: read user servers first
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

    let bkmExtracted;
    let bookmarksAll = [];

    function traverseBookmarks(bookmarkTreeNodes) {

        for (var i = 0; i < bookmarkTreeNodes.length; i++) {

            bookmarksAll.push({
                title: bookmarkTreeNodes[i].title,
                urlOrFolder: bookmarkTreeNodes[i].url ? bookmarkTreeNodes[i].url : "[Folder]"
            })

            if (bookmarkTreeNodes[i].children) {
                traverseBookmarks(bookmarkTreeNodes[i].children);
            }

        }

        return bookmarksAll

    }

    var bookmarkTreeNodes = chrome.bookmarks.getTree(
        function(bookmarkTreeNodes) {
            bkmExtracted = traverseBookmarks(bookmarkTreeNodes);
            console.log("bookmarkTreeNodes: ", bkmExtracted)
        });


    console.log("Restore Options");
    restore_options();

    setTimeout(() => {

        let containerObject = []

        console.log("serversDefined", serversDefined)
        // specifying url to search trhough
        serversDefined.forEach(srv => {

            bkmExtracted.forEach(bkm => {

                bkm.urlOrFolder.indexOf(srv) > -1 && containerObject.push(bkm)

            })

        })


        // TODO: clean bookmark storage
        chrome.storage.sync.set({
            config: null
        })

        // SOLVED: first, check whether config already contains
        // extracted bookmarks

        chrome.storage.sync.get(null, (result) => {

            var jsObj = {}

            if (result["config"] !== undefined && result["config"] !== null) {

                var array = Array.isArray(result["config"]) && result["config"]

                console.log("Bookmarks Extracted All", array)
                jsObj["config"] = array
                jsObj["config"] = jsObj["config"].concat(containerObject)

                chrome.storage.sync.set({
                        config: jsObj["config"]
                    },
                    null
                );


            } else {

                jsObj["config"] = []
                jsObj["config"] = jsObj["config"].concat(containerObject)
                chrome.storage.sync.set({
                        config: jsObj["config"]
                    },
                    null
                );


            }

        })

        console.log("Filtered Bookmarks", containerObject)

    }, 1000)

});