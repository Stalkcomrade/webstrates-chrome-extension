export const storageMixin = {
    data: () => ({
        server: ["webstrates.cs.au.dk", "webstrates.r2.enst.fr"]
    }),
    methods: {

        // TODO: list of default servers
        // TODO: use this func from mixins only

        // Restores select box and checkbox state using the preferences
        // stored in chrome.storage.
        restore_options: function() {

            chrome.storage.sync.get(null, (servers) => {

                this.server.push(Object.values(servers.server)) // SOLVED: server is not really array get array of values
                console.log(this.server)

            })
        },

    }

}