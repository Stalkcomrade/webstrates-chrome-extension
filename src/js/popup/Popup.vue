<template>
  <div id="app">
      <header class="header">
        <h1> Webstrates Bookmarks </h1>

        <div class="grid-container">

          <div class="sidebar">
            <li> navig1 </li>
            <li> navig2 </li>
            </div>
          
          <div class="main">
          
        <p> </p>
        <!-- <div v-for="bk in config"> -->
        <!--   <a :href="bk.url"> {{ bk.title }} </a> -->
          <!-- <p> {{ bk.title }} : {{  bk.url }} </p> -->
          <!-- <img src="../../../assets/ws.png" height="16" width="16"/> -->
          <!-- <img :src="require('../../../assets/ws.png')"/> -->
          <!-- <img src="chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/assets/ws.png" height="16" width="16"/> -->
        <!-- </div> -->
        <div>
          <b-table striped hover :items="processedHistory" :fields="fields">
            <template slot="link" slot-scope="row">
               <b-link :href="row.item.searchElement.url">Link</b-link>
              <!-- {{ row.item.searchElement ? row.item.searchElement.url : "" }} -->
            </template>
            </b-table>
        </div>

        </div>
        </div>
        
      </header>
  </div>
</template>


<script lang="js">

import * as d3 from 'd3';
import BTable from '../../../node_modules/bootstrap-vue/es/components/table/table.js'
import BLink from '../../../node_modules/bootstrap-vue/es/components/link/link.js'
import {
    storageMixin
} from '../../mixin'

import contentScript from '../../js/getOps.js';
// import structureScript from '../../js/getStructure.js';

export default {
    mixins: [storageMixin],
    components: {
        'b-table': BTable,
        'b-link': BLink
    },
    data: () => ({
        bookmarksProcessed: [],
        config: [],
        history: [],
        processedHistory: [],
        fields: [
            'link',
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
            },
            {
                key: 'searchElement.visitCount',
                label: 'visits',
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

            chrome.history.search({text: "", maxResults: 0, startTime: 0}, (data) => {

                data.forEach((page) => {

                    // TODO: push the whole object
                    // FIXME: will ruing the whole mechanism
                    // this.history.push(page.url)

                    this.history.push(page)
                })
                
            })
            
            // chrome.history.search({text: text,
            //                        maxResults: 30000}, (data) => {
            //                            data.forEach((page) => {
            //                                // console.log(page.url);
            //                                this.history.push(page.url)
            //                            })
            //                        })
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
            this.history.forEach(element => {

                var el = element.url
                
                // SOLVED: fetch list of available servers
                this.server.forEach(server => {

                    // TODO: consider visits in a url

                   
                    // Object.assign({searchElement: element}, this.extractInfo(el, "history")).webstrateId == "wicked-wombat-56" &&
                    //     console.log("visits:",
                    //                 chrome.history.getVisits(Object.assign({searchElement: element},
                    //                                                        this.extractInfo(el, "history")).searchElement.url,
                    //                                          (dt) => {console.log(dt)}))
                    
                    // console.log("inspect this", element)
                    // console.log("inspect this", Object.assign({searchElement: element}, this.extractInfo(el, "history")))
                    el.indexOf(server) > -1 &&
                        el.indexOf("undefined") == -1 &&
                        el.indexOf("google") == -1 &&
                        this.processedHistory.push(Object.assign({searchElement: element}, this.extractInfo(el, "history")))
                        // this.processedHistory.push({searchElement: element, ...this.extractInfo(el, "history")})

                })
                
            })

            console.log("Processed History: ", this.processedHistory)
            
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
                        extractedBkmOBject.server.indexOf("google") == -1 &&
                        extractedBkmOBject.server.indexOf("undefined") == -1
                        this.processedHistory.push(Object.assign({searchElement: {url: null}}, extractedBkmOBject))
                    // this.processedHistory.push(this.extractInfo(bkm.urlOrFolder, "bookmark"))
                })

                clearInterval(updBookmarks)

                // INFO: drawing interface
                this.drawInterface()
            
            }
                
        }, 1000)



        // INFO: setting parameters to pass to getStructure script
        // var config = {somebigobject: 'complicated value'};
        // chrome.tabs.executeScript(null, {
        //     code: 'var config = ' + JSON.stringify(config)
        // }, function() {
        //     chrome.tabs.executeScript(null, {file: structureScript});
        //     // chrome.tabs.sendMessage(null, 'whatever value; String, object, whatever');
        //     chrome.tabs.query({active: true, currentWindow: true}, (tabs) =>  {
        //     chrome.tabs.sendMessage(tabs[0].id,
        //                             {type: "getText"},
        //                             (response) => {
        //                                 console.log("Message to Content Script is Sent")
        //                                 console.log("Got a response", response)
        //                             });
        // });
        // });
        
        // INFO: another way
        // FIXME: how script is executed

        var scripts = [
            "getStructure.bundle.js"
            // "../../js/getStructure.js"
            // structureScript,
            // contentScript
        ];
        
        scripts.forEach(function(script) {
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

            console.log("TABS", tabs)
            // chrome.tabs.executeScript(tabs[0].id, {file: script}, function() {
            chrome.tabs.executeScript(tabs[0].id, {file: script}, function() {
                chrome.tabs.sendMessage(tabs[0].id, 'whatever value; String, object, whatever');

                //
                chrome.runtime.onMessage.addListener(
                    function(request, sender, sendResponse){
                        // localStorage["total_elements"] = request.total_elements;
                        console.log("Got Response from Content")
                    }
                );
                
                });
            
        })
            })

        
        // INFO: communication with a popup
        // console.log("contentScript", contentScript)
        //      chrome.tabs.executeScript(null,
        //                                { file: script },
        //                                function(resp) {
        //          if (script!=='last.js') return;
        //                                    // Your callback code here
        //                                    console.log("accessing content")
        //          console.log("Results:", resp)
        //          return resp
        //      });
        // });

        // INFO: messaging to content script to start parsing operational history
        // window.addEventListener('DOMContentLoaded', function () {
    //     setTimeout(() => {
    //     chrome.tabs.query({
    //         active: true,
    //         currentWindow: true
    //     }, (tabs) =>  {

    //         chrome.tabs.sendMessage(
    //         // null,
    //             tabs[0].id,
    //         {type: "getText"},
    //             (response) => {
    //                 console.log("Message to Content Script is Sent")
    //                 console.log("Got a response", response)
    //             // $("#text").text(response);
    // // });
    //     });
    //         });

    //     }, 3000)
        

      }
      
  }
</script>


<style lang="css">
.grid-container {
  display: grid;
  grid-template-columns: 0.2fr 1.8fr;
  grid-template-rows: 1fr;
  grid-template-areas: "sidebar main";
}

.main { grid-area: main; }

.sidebar { grid-area: sidebar; }

</style>
