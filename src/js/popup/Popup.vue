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
          }
      ]
  }),
    methods: {
        extractInfo: function(history) {
            
             var myString = history,
                 regRes,
                 myRegexp = /(^.*?)\:\/\/(.*?)(\/)(.*?)(\/)(.*?)(\/)(.*?$)/g;
    
            var match = myRegexp.exec(myString);
    
            regRes = {
	        server:  match !== null ? match[2] : "undefined",
	        webstrateId:  match !== null ? match[4]: "undefined",
                version:  match !== null ? match[4] : "last"
                // tag: match[6]
            }

            console.log(regRes)
            return regRes
        }, 
        searchHistory: function(text){
            
            this.history = []
            
            chrome.history.search({text: text,
                                   maxResults: 10000}, (data) => {
                                       data.forEach((page) => {
                                           console.log(page.url);
                                           this.history.push(page.url)
                                       })
                                   })
        },
        categoriesByWebstrate: function(storage) {
            storage.config.forEach(el => {
                el.indexOf("webstrates.cs.au.dk")
                el.indexOf("webstrates.r2.enst.fr")
            })
        },
        categoriseByDomain: function(storage) {
            storage.config.forEach(el => {
                el.indexOf("webstrates.cs.au.dk")
                el.indexOf("webstrates.r2.enst.fr")
            })
        },
        setConfig: function(storage) {
            /**
             * set our internal state
             * with the result from the
             * chrome api call
             */
            this.config = storage.config;
        }
    },
    mounted() {


        this.$nextTick(() => {
            this.restore_options()
            })
        
        this.searchHistory("webstrates")
        console.log(this.history)

        setTimeout(() => {
            this.history.forEach(el => {

                // TODO: fetch list of available servers

                this.server.forEach(server => {

                    console.log(el)
                    console.log(server)
                    el.indexOf(server) > -1 &&
                    this.processedHistory.push(this.extractInfo(el))

                })
                
                
            })
        }, 1500)
        

        console.log(this.processedHistory)
        
        
        this.$nextTick(() => {
            chrome.storage.sync.get(['config'], this.setConfig)
        })

        setTimeout(() => {
            console.log(this.config)
        }, 3000)
          
      }
      
  }
</script>
