<template>
  <div id="app">
      <header class="header">
        <h1> Webstrates Bookmarks </h1>
        <p> </p>
        <!-- <div v-for="bk in config"> -->
        <!--   <a :href="bk.url"> {{ bk.title }} </a> -->
          <!-- <p> {{ bk.title }} : {{  bk.url }} </p> -->
          <!-- <img src="../../../assets/ws.png" height="16" width="16"/> -->
          <!-- <img :src="require('../../../assets/ws.png')"/> -->
          <!-- <img src="chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/assets/ws.png" height="16" width="16"/> -->
        <!-- </div> -->
        <div>
          <b-table striped hover :items="processedHistory" :fields="fields" />
        </div>
      </header>
  </div>
</template>


<script lang="js">

import * as d3 from 'd3';
import BTable from '../../../node_modules/bootstrap-vue/es/components/table/table.js'
import {
    storageMixin
} from '../../mixin'

import contentScript from '../../js/getOps.js';

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
        },
        drawInterface: function() {

            
            d3.selectAll("tr[role='row']")
		.append("svg")
		.attr("width", 30)
		.attr("height", 30)
                .append("g")
	        .append("path")
	        .attr("d", this.icon)
                .on("click", () => {

                    this.fetchInfoPerWs()
                    console.log("clicked")
                })
            
            
        },
        
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
        

        // INFO: extracting bookmarks
        var updBookmarks = setInterval(() => {

            chrome.storage.sync.get(['config'], this.setConfig)
            console.log("Bookmarks - from storage: ", this.config)
            
            if (this.config.length !== 0) {

                this.config.forEach(bkm => {
                    var extractedBkmOBject = this.extractInfo(bkm.urlOrFolder, "bookmark")
                    extractedBkmOBject.server !== "undefined" &&
                         extractedBkmOBject.webstrateId !== "undefined" &&
                        this.processedHistory.push(extractedBkmOBject)
                    // this.processedHistory.push(this.extractInfo(bkm.urlOrFolder, "bookmark"))
                })

                clearInterval(updBookmarks)

                // INFO: drawing interface
                this.drawInterface()
            
            }
                
        }, 1000)



        ///
        ///
        ///
        // INFO: communication with a popup

        console.log("contentScript", contentScript)
        var scripts = [
            // 'getOps.js'
            contentScript
        ];
         scripts.forEach(function(script) {
             chrome.tabs.executeScript(null,
                                       { file: script },
                                       function(resp) {
                 if (script!=='last.js') return;
              
                 // Your callback code here

                 console.log("Results:", resp)
                 return resp
              
             });
        });


      }
      
  }
</script>
