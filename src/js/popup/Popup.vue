<template>
  <div id="app">
      <header class="header">
        <h1> Webstrates Bookmarks </h1>
        <p> </p>
        <div v-for="bk in config">
          <a :href="bk.url"> {{ bk.title }} </a>
          <!-- <p> {{ bk.title }} : {{  bk.url }} </p> -->
          <!-- <img src="../../../assets/ws.png" height="16" width="16"/> -->
          <!-- <img :src="require('../../../assets/ws.png')"/> -->
          <!-- <img src="chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/assets/ws.png" height="16" width="16"/> -->
        </div>
        <div>
          <b-table striped hover :items="processedHistory" :fields="fields" />
        </div>
      </header>
  </div>
</template>


<script lang="js">

  import BTable from '../../../node_modules/bootstrap-vue/es/components/table/table.js'
  import {
   storageMixin
} from '../../mixin'

export default {
    mixins: [storageMixin],
    components: {
        'b-table': BTable
    },
    data: () => ({
          bookmarksProcessed: [],
          config: [],
          history: [],
          processedHistory: [],
      fields: [
          {
              key: 'server',
              sortable: true
          },
          {
            key: 'webstrateId',
            sortable: true
          },
          {
              key: 'version',
              label: 'version',
              sortable: true,
              // Variant applies to the whole column, including the header and footer
              variant: 'danger'
          },
          {
              key: 'bookmark',
              sortable: true,
              variant: 'danger'
          }
      ]
  }),
    methods: {
        /**
         * 
         * @param history - string to extract information from
         * @param mode - "history" or "bookmark"
         * @return - no return value, pushes to this.history
         */
        extractInfo: function(history, mode) {
            
             var myString = history,
                 regRes,
                 myRegexp = /^https:\/\/(.*?)\/(.*?)\/(.*?|.*?$)\/?([0-9]+|[a-zA-Z]+)?(.*?|\/)?$/g;
            // myRegexp = /(^.*?)\:\/\/(.*?)(\/)(.*?)(\/)(.*?)(\/)(.*?$)/g;
    
            var match = myRegexp.exec(myString);

                regRes = {
	            server:  match !== null ? match[1] : "undefined",
	            webstrateId:  match !== null ? match[2]: "undefined",
                    version:  match !== null ? match[3] : "last",
                    bookmark: mode === "history" ? "history" : "bookmark"
                    // tag: match[6]
                }

            // console.log(regRes)
            return regRes
        },
        /**
         * 
         * @param text - search query
         * @return - no return value, pushes to this.history
         */
        
        searchHistory: function(text){
            
            this.history = []
            
            chrome.history.search({text: text,
                                   maxResults: 10000}, (data) => {
                                       data.forEach((page) => {
                                           // console.log(page.url);
                                           this.history.push(page.url)
                                       })
                                   })
        },
        /**
             * set our internal state
             * with the result from the
             * chrome api call
             */
        setConfig: function(storage) {
            this.config = storage.config;
        }
    },
    mounted() {


        // FIXME: it seems that bookmarks are not extracted in the right time
        this.$nextTick(() => {
            this.restore_options()
            })

        // INFO: search for corresponding links within name of each server
        // as the search query

        this.server.forEach(el => {
            this.searchHistory(el)
        })

        // INFO: extracting history
        setTimeout(() => {
            this.history.forEach(el => {

                // SOLVED: fetch list of available servers
                this.server.forEach(server => {

                    el.indexOf(server) > -1 &&
                        this.processedHistory.push(this.extractInfo(el, "history"))

                })
                
            })

            console.log("Processed History: ",this.processedHistory)
            
        }, 2500)
        

        // INFO: extract bookmarks
        this.$nextTick(() => {
            // chrome.storage.sync.get(['config'], this.setConfig)
            // this.server.forEach(server => {
            //     this.config.forEach(bookmark => {
            //         bookmark.indexOf
            // })
            // })
        })


        // INFO: extracting bookmarks
        setTimeout(() => {

            // FIXME: config is empty
            console.log("Config before addressing storage: ", this.config)
            chrome.storage.sync.get(['config'], this.setConfig)
            console.log("Bookmarks - from storage: ", this.config)

            // this.server.forEach(server => {
            //     this.config.forEach(bookmark => {
            //         // INFO: update bookmarks based on server in the storage
            //         console.log("Looking for bookmarks", bookmark.indexOf(server) > -1)
            //         if (bookmark.indexOf(server) > -1) {
            //             this.bookmarksProcessed.push(bookmark)
            //         }
            // })
            // })

            
        }, 1500)
          
      }
      
  }
</script>
