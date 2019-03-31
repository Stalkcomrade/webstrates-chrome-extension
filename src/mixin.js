export const storageMixin = {
    data: () => ({
        server: ["webstrates.cs.au.dk", "webstrates.r2.enst.fr"]
    }),
    methods: {

        // SOLVED: list of default servers
        // SOLVED: use this func from mixins only

        // Restores select box and checkbox state using the preferences
        // stored in chrome.storage.
        restore_options: function() {

            chrome.storage.sync.get(null, (servers) => {


                Object.values(servers.server).forEach(server => {
                    this.server.push(server) // SOLVED: server is not really array get array of values
                    // console.log(this.server)
                })

                console.log("Restoring Servers", this.server)


            })
        },

    }

}