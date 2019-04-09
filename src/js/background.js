chrome.runtime.onInstalled.addListener(function() {

    // INFO: checking whether current tab relates to the webstrates
    var someVar = {
        text: 'test',
        foo: 1,
        bar: false
    };


    // chrome.tabs.create({
    //     'url': 'https://stackoverflow.com'
    // });


    // chrome.browserAction.onClicked.addListener(function(tab) {

    // console.log("window", tab)

    // chrome.tabs.create({
    //         url: 'https://stackoverflow.com',
    //     },
    //     function(tab) {}
    // );

    // chrome.tabs.executeScript({
    //     code: '(' + function(params) {
    //         // alert("window", window)
    //         document.body.insertAdjacentHTML('beforeend',
    //             '<div style="all:unset; position:fixed; left:0; top:0; right:0; bottom:0;' +
    //             'background-color:rgba(0,255,0,0.3)">' + params.text + '</div>'
    //         );
    //         return {
    //             success: true,
    //             html: document.body.innerHTML
    //         };
    //     } + ')(' + JSON.stringify(someVar) + ');'
    // }, function(results) {
    //     console.log(results[0]);
    // });

    // });





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