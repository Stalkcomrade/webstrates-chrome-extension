export const storageMixin = {
    data: () => ({
        server: ["webstrates.cs.au.dk", "webstrates.r2.enst.fr"],
        icon: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z",
    }),
    methods: {

        // SOLVED: list of default servers
        // SOLVED: use this func from mixins only
        // Restores select box and checkbox state using the preferences
        // stored in chrome.storage.
        restore_options: function() {

            // return new Promise((resolve, reject) => {

            chrome.storage.sync.get(null, (servers) => {
                Object.values(servers.server).forEach(server => {
                    this.server.push(server) // SOLVED: server is not really array get array of values
                    // console.log(this.server)
                })
                console.log("Restoring Servers", this.server)

            })

            // resolve(this.server)
            // })


        },
        fetchInfoPerWs: function() {

            // const serverUtils = require("#server-utils")
            var input = "dull-warthog-73",
                current = input !== "undefined" ? input : this.selected;

            var fetched = fetch("https://webstrates.cs.au.dk/" + current + "/?ops")
                .then((html) => {
                    return html.json()
                })
                .then((body) => {
                    console.log('Fetched:\n', current)
                    var versioningRaw = body
                    return body
                })

            console.log(fetched)
            return fetched

        },

        // INFO: wrapper method for communication with background.js
        getContent: function() {
            this.callEventPageMethod('getContent', 'some parameter', function(response) {
                console.log(response);
            });
        },

        // INFO: generic method for call methods from background
        callEventPageMethod: function(method, data, callback) {
            chrome.runtime.sendMessage({
                method: method,
                data: data
            }, function(response) {
                if (typeof callback === "function") callback(response);
            });
        }

    }

}