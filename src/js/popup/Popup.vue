<template>
<div id="app">
  <header class="header">
    <h1 align="center"> Webstrates Projects </h1>
    
    <button v-on:click="deleteWebstratesStructure">Delete Structure Storage</button>
    <br>
    <br>
    
    <!-- <div class="grid-container"> -->
      <!-- <div class="sidebar"> -->
        <!--   <li> bookmarks </li> -->
        <!--   <li> history </li> -->
        <!-- </div> -->
      
      <div class="main">
        
        <!-- <img src="../../../assets/ws.png" height="16" width="16"/> -->
        <!-- <img :src="require('../../../assets/ws.png')"/> -->
        <!-- <img src="chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/assets/ws.png" height="16" width="16"/> -->
        <div>
          <!-- <b-table striped hover :items="processedHistory" :fields="fields"> -->
            
            <!-- projects with branching -->
            <div>
              <b-card no-body>
                <b-tabs card>
                  <b-tab no-body v-for="(value, name) in projects" :title="name">
                    <b-table striped hover :items="value" :fields="fields">
                      <template slot="link" slot-scope="row">
                        <b-link :href="row.item.searchElement.url">Link</b-link>
                      </template>
                    </b-table>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
            
            
            <!-- projects without branching -->
            <div>
              <b-card no-body>
                <b-tabs card>
                  <b-tab no-body v-for="(value, name) in finestHistory" :title="name">
                    <b-table striped hover :items="value" :fields="fields">
                      <template slot="link" slot-scope="row">
                        <b-link :href="row.item.searchElement.url">Link</b-link>
                      </template>
                    </b-table>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
            
            <!-- old rendering - all-together -->
            <!-- <b-table striped hover :items="finalHistory" :fields="fields"> -->
            <!--   <template slot="link" slot-scope="row"> -->
            <!--     <b-link :href="row.item.searchElement.url">Link</b-link> -->
            <!--   </template> -->
            <!-- </b-table> -->
            
        </div>

        </div>
        <!-- </div> -->
        
      </header>
  </div>
</template>


<script lang="js">

import * as d3 from 'd3';

import BTable from '../../../node_modules/bootstrap-vue/es/components/table/table.js'
import BLink from '../../../node_modules/bootstrap-vue/es/components/link/link.js'
import BCard from '../../../node_modules/bootstrap-vue/es/components/card/card.js'
import BTab from '../../../node_modules/bootstrap-vue/es/components/tabs/tab.js'
import BTabs from '../../../node_modules/bootstrap-vue/es/components/tabs/tabs.js'

import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'

import {
    storageMixin
} from '../../mixin'

// import contentScript from '../../js/getOps.js';
// import structureScript from '../../js/getStructure.js';

export default {
    mixins: [storageMixin],
    components: {
        'b-table': BTable,
        'b-link' : BLink,
        'b-card' : BCard,
        'b-tabs' : BTabs,
        'b-tab'  : BTab,
    },
    data: () => ({
        bookmarksProcessed: [],
        config: [], // fetching configuration from storage
        history: [],
        processedHistory: [],
        finalHistory: [], // history object for rendering
        finestHistory: [], // FIXME: temporal storage for histories
        projects: {}, // building projects in tabs
        arrCheck: [],
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
                // key: 'searchElement.visitCount',
                key: 'visits',
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
                myRegexp = /^https:\/\/(?<server>[a-zA-Z0-9\-\.]*?)\/(?<webstrateId>[a-zA-Z0-9\-\.]*?)\/(((?<version>[0-9]*?)|\?v\=(?<versionPlus>[0-9]*?)|\?tag\=(?<tag>[a-zA-Z0-9]*?))\/$|$)?/g,
                match = myRegexp.exec(myString);

            // https://webstrates.cs.au.dk/calm-bat-91/?tag=lastTag/
            // https://webstrates.cs.au.dk/cold-jellyfish-95/?v=3212/
            // https://webstrates.cs.au.dk/cold-jellyfish-95/12/
            // https://webstrates.cs.au.dk/cold-jellyfish-95/12/
            // https://webstrates.cs.au.dk/cold-jellyfish-95/?v=234/
            // https://webstrates.cs.au.dk/cold-jellyfish-95/
            // https://webstrates.cs.au.dk/cold-jellyfish-95/smth/234/
            
            if (!match) {
                
                this.arrCheck.push(myString)
                
                console.group("regexp")
                console.log(myString)
                console.groupEnd("regexp")
                
                regRes = {server: "undefined", webstrateId: "undefined", version: "undefined", bookmark: "history"}
                
            } else {

                match.groups.tag && console.log(match.groups.tag)
                
                regRes = {
	            server:       match.groups.server          ? match.groups.server       : "undefined",
	            webstrateId:  match.groups.webstrateId     ? match.groups.webstrateId  : "undefined",
                    version:      match.groups.version         ? match.groups.version      : match.groups.versionPlus
                        ? match.groups.versionPlus
                        : match.groups.tag,
                    bookmark:     mode === "history"           ? "history" : "bookmark"
                }
                
            }

            

            return regRes
        },
        /**
         * 
         * @param text - search query
         * @return - no return value, pushes to this.history
         */
        
        searchHistory: function(text){

            // FIXME:
            // this.history = []
            // return new Promise()
            
            chrome.history.search({text: "", maxResults: 0, startTime: 0}, (data) => {
                data.forEach((page) => {
                    // TODO: push the whole object
                    // FIXME: will ruing the whole mechanism
                    // this.history.push(page.url)
                    this.history.push(page)
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
        // content script execution
        executeContentScripts: function() {

            var scripts = [
                "getStructure.bundle.js"
            ],
                flag = false; // content script execution is disabled by default
            
            scripts.forEach((script) => {
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {


                    // TODO: do not fetch webstrates, which ids are already in a storage
                    // uses local storage instead of global
                    // https://developer.chrome.com/apps/storage
                    chrome.storage.local.get(null, (result) => {
                        if (result["structures"] != null) { // structure storage exists

                            
                            var projects = this.uniteProjects(result["structures"])
                            console.log("Accessing structure storage:", result["structures"])
                            console.log("Projects !", projects)

                            // making projects considering their structures
                            var ttprj = {}
                            projects.filter(el => { if (el.project) {return el}})
                                .forEach(el => {
                                    // el.project
                                    ttprj[el.project] = this.finalHistory.filter(ws => ws.webstrateId == el.project || ws.webstrateId == el.wsId)
                                })
                            
                            this.projects = ttprj
                            console.log("ttprj", ttprj)

                        } else { // structure storage is empty
                            flag = true;
                            console.log("Structure storage is empty")
                        }
                    });
                    

                    if (flag == true) {
                        
                        console.log("Executing content script")
                        chrome.tabs.executeScript(tabs[0].id, {file: script}, () => {

                        var processedHistory = this.processedHistory,
                            filteredHistory = processedHistory.map(el => el.webstrateId),
                            uniqueHistory = Array.from(new Set(filteredHistory));

                        console.log("History to send from popup", uniqueHistory)
                        chrome.tabs.sendMessage(tabs[0].id, {history: JSON.stringify(uniqueHistory)});

                        // receiving answer from content script
                        // with the webstrates structures
                        chrome.runtime.onMessage.addListener(
                            (request, sender, sendResponse) => {
                                
                                // this.deleteWebstratesStructure("structures")
                                // filters nulls and undefined

                                var projects = this.uniteProjects(JSON.parse(request.responseWebstratesStructure))
                                console.log("Projects: ", projects)
                                
                                var responseStr = JSON.parse(request.responseWebstratesStructure)
                                    .filter(ws => {
	                                return ws != undefined && ws[0].webstrateId != "frontpage" && ws[0].webstrateId != "undefined"
                                    })
                                    .map(ws => {
                                        return {wsId      :  ws[0].webstrateId,
                                                structure :  ws[0]
                                               }
                                    })

                                
                                this.saveWebstratesStructure("structures", responseStr)
                                console.log("Got Response from Content - structure of Webstrates", responseStr)

                                
                            }
                        );
                        
                        });
                    }
                    
                })
            })
        },
        // use to group similar entities (composite key distinguishes bookmarks, versions, tags and servers) to count visits
        aggregateHistory: function(processedHistory) {
            
            // x - every element
            // used to provide aggregate counts and get rid of the duplicates
            var groupBy = function(xs, key) {
                
                return xs.reduce(function(rv, x) {
                    
                    // makes a composite key
                    key = String(x.webstrateId) + String(x.server) + String(x.version) + String(x.bookmark);
                    
                    // (rv[key] = rv[key] || []).push(x);
                    rv[key] = rv[key] || {arr: [], visits: 0, bookmark: x.bookmark, server: x.server, version: x.version, webstrateId: x.webstrateId, searchElement: x.searchElement}
                    rv[key].arr.push(x)
                    rv[key].visits += x.searchElement.visitCount 
                    
                    return rv;
                    
                }, {});
            };


            // used to make project structure WITHOUT taking structure
            // into account
            var groupByProjects = function(xs, key) {
                return xs.reduce(function(rv, x) {
                    
                    key = String(x.webstrateId);
                    (rv[key] = rv[key] || []).push(x);
                    
                    return rv;
                }, {});
            };


            // FIXME:
            var processedHistoryMutated = groupBy(processedHistory, "webstrateId")
            Object.keys(processedHistoryMutated).forEach(el => processedHistoryMutated[el].arr = null) //
            var fnl = Object.keys(processedHistoryMutated).map(el => { try { return processedHistoryMutated[el] } catch(error) { return null} });

            var grpProjects = groupByProjects(processedHistory, "webstrateId");

            
            
            return [fnl, grpProjects]

        },
        },
        
    mounted() {

        // INFO: even though I am messing $watch Vue and promise-based styles
        // should give it a shot
        
        // FIXME: restore options should return a promise
        // FIXME: it seems that bookmarks are not extracted in the right time
        this.$nextTick(() => {
            var optionsRestored = this.restore_options()
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
                this.server.forEach(server => { // fetch list of available servers

                    el.indexOf(server) > -1 &&
                        el.indexOf("undefined") == -1 &&
                        el.indexOf("google") == -1 &&
                        this.processedHistory.push(Object.assign({searchElement: element}, this.extractInfo(el, "history")))

                })
                
            })

            console.log("Processed History: ", this.processedHistory)

            // TODO: group item
            
        }, 2500)


 

        // INFO: extracting bookmarks
        var updBookmarks = setInterval(() => {

            chrome.storage.sync.get(['config'], this.setConfig)
            console.log("Bookmarks - from storage: ", this.config)
            
            if (this.config.length !== 0) {

                // FIXME: get rid of undefined and nulls
                // FIXME: it seems like this is the source for duplicates across history entities
                this.config.forEach(bkm => {
                    var extractedBkmOBject = this.extractInfo(bkm.urlOrFolder, "bookmark")
                    extractedBkmOBject.server != "undefined" &&
                        extractedBkmOBject.webstrateId != "undefined" &&
                        extractedBkmOBject.server.indexOf("google") == -1 &&
                        extractedBkmOBject.server.indexOf("undefined") == -1
                    this.processedHistory.push(Object.assign({searchElement: {url: null}}, extractedBkmOBject))
                })

                clearInterval(updBookmarks)

                this.drawInterface()
                
            }
            
        }, 1000)


        // instead of rewriting all the funs to
        // rely on promises, I am temprorarily using Vue watchers
        // to know, where to start communication
        // with the content scripts

        // use this watcher to construct aggregate object for rendering

        // setup before functions
        let typingTimer,                // timer identifier
            doneTypingInterval = 3000;  // time in ms (5 seconds)
        var accomplish = () =>  {
            this.executeContentScripts()

            // making projects WITHOUT considering their structure
            var [projectsOld, projectsNew] = this.aggregateHistory(this.processedHistory);
                // ttprj = {};
            
            // projects.forEach(el => {
            //     // el.project
            //     ttprj[el.project] = this.finalHistory.filter(ws => ws.webstrateId == el.project || ws.webstrateId == el.wsId)
            // })
            // console.log("ttprj", ttprj)
            // console.log(projectsOld, projectsNew, "Old - New")

            // FIXME: interfering with old ways of making projects
            // old way
            this.finalHistory = projectsOld
            // new way

            // filtering those projects, which webstrate server is
            // not in the list
            // projectsNew

            // FIXME: fetch from any server



            
            
            // TODO: list of servers
            // TODO: update list of servers to vue globals
            console.log("List of servers in Popup", this.server)
            var projectsNewFiltered = Object.keys(projectsNew).map(el => {
	        if (projectsNew[el].some(ar => this.server.includes(ar.server))) {return el}
            })
                .filter(el => el != undefined)
                .reduce((res, key) => (res[key] = projectsNew[key], res), {} );

            projectsNew = projectsNewFiltered
            this.finestHistory = projectsNew
            
            
            // TODO: group entities with equal webstrateId in together
            // TODO: except those with structure Projects

            console.log(this.finestHistory, "Finest History")
            console.log(this.finalHistory, "Final History")
        }
        
        this.$watch(
            (vm) => (vm.processedHistory, Date.now()), val => {
                
                clearTimeout(typingTimer);
                typingTimer = setTimeout(accomplish, doneTypingInterval);
                
            })

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
