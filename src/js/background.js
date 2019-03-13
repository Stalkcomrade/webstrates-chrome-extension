console.log("storage")

chrome.runtime.onInstalled.addListener(function() {

    function doSomething(a) {

        chrome.bookmarks.search(a, function(items) {
            var source = [];
            for (var i = 0; i < items.length; i++) {
                source[i] = items[i];
            }

            console.log("storage")
            chrome.storage.sync.set({
                    config: source
                },
                null
            );

            alert(source[0].title);

        });
    }

    doSomething("webstrates");

});

save_options: function() {

    var server = this.server

    chrome.storage.sync.set({
        server: server
    }, () => {

        // Update status to let user know options were saved.
        this.status = 'Options saved'

        setTimeout(() => {
            this.status = ''
        }, 1000);

    });
}