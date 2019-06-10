<template>
<div id="app">
  <header class="header">
    <h1 align="center" id="test-title">Webstrates</h1>
    
    <b-button variant="danger" v-on:click="deleteWebstratesStructure">Delete Structure Storage</b-button>
    
    <br>
    <br>
    
    <!-- <button v-on:click="deleteWebstratesStructure">Delete Structure Storage</button> -->
    <!-- <div class="grid-container"> -->
      <!-- <div class="sidebar"> -->
        <!--   <li> bookmarks </li> -->
        <!--   <li> history </li> -->
        <!-- </div> -->
      <!-- <img src="../../../assets/ws.png" height="16" width="16"/> -->
      <!-- <img :src="require('../../../assets/ws.png')"/> -->
      <!-- <img src="chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/assets/ws.png" height="16" width="16"/> -->
      <!-- <b-table striped hover :items="processedHistory" :fields="fields"> -->
        
        <div class="main">
          <div>
            <div>
              <b-card no-body>
                <b-tabs pills card vertical active-nav-item-class="font-weight-bold text-uppercase text-success">
                  <b-tab title="Projects Structured">
                    <!-- projects with branching -->
                    <div v-if="Object.keys(projects).length == 0">
                      <b-spinner variant="success" label="Spinning"></b-spinner>
                    </div>
                    <div v-else>
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
                  </b-tab>
                  <b-tab title="Project Simple">
                    <!-- projects without branching -->
                    <div v-if="finestHistory.length == 0">
                      <b-spinner variant="success" label="Spinning"></b-spinner>
                    </div>
                    <div v-else>
                      <b-card no-body>
                        <b-tabs card>
                          <b-tab no-body v-for="(value, name) in finestHistory" :title="name">
                            <b-table striped hover :items="value" :fields="fields">
                              <template slot="link" slot-scope="row">
                                <b-link :href="row.item.searchElement.url" v-on:click="redirect(row.item.searchElement.url, row.item)">Link</b-link>
                              </template>
                            </b-table>
                          </b-tab>
                        </b-tabs>
                      </b-card>
                    </div>
                  </b-tab>
                </b-tabs>
              </b-card>
            </div>
            
          </div>
        </div>
      </header>
  </div>
</template>


<script lang="js">

import * as d3 from 'd3';
import moment from 'moment';

import BTable from '../../../node_modules/bootstrap-vue/es/components/table/table.js'
import BLink from '../../../node_modules/bootstrap-vue/es/components/link/link.js'
import BCard from '../../../node_modules/bootstrap-vue/es/components/card/card.js'
import BTab from '../../../node_modules/bootstrap-vue/es/components/tabs/tab.js'
import BTabs from '../../../node_modules/bootstrap-vue/es/components/tabs/tabs.js'
import BButton from '../../../node_modules/bootstrap-vue/es/components/button/button.js'
import BSpinner from '../../../node_modules/bootstrap-vue/es/components/spinner/spinner.js' 

import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../../node_modules/bootstrap-vue/dist/bootstrap-vue.css'

import {
    storageMixin
} from '../../mixin'

export default {
    mixins: [storageMixin],
    components: {
        'b-table'   : BTable,
        'b-link'    : BLink,
        'b-card'    : BCard,
        'b-tabs'    : BTabs,
        'b-tab'     : BTab,
        'b-button'  : BButton,
        'b-spinner' : BSpinner
    },
    data: () => ({
        test: "test",
        bookmarksProcessed: [],
        config: [], // fetching configuration from storage
        history: [],
        processedHistory: [],
        finalHistory: [], // history object for rendering
        finestHistory: [], // FIXME: temporal storage for histories
        projects: {}, // building projects in tabs
        simpleProjects: '',
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
                key: 'visits',
                label: 'visits',
                sortable: true,
                variant: 'danger'
            },
            {
                key: 'lastVisitTime',
                label: 'Time Accessed',
                sortable: true,
                variant: 'danger'
            }
        ]
    }),
    watch: {
        projects() {
            
            console.log("Projects watcher")
            // making two project spaces consistent between each other
            // then branching projects are ready, filtering simple one
            
            // suppress simple projects from being rendered
            // before filtering
            
            var temp1 = this.simpleProjects

            // TODO: fix filtering later
            // var dt = Object.keys(temp1).reduce((rex, key) => { // temp 1 - project without branching
            //     if (Object.keys(this.projects).includes(key)) {
            //         console.log("Filtered", key)}
                
	    //     if (!Object.keys(this.projects).includes(key)) {
	    //         rex[key] = temp1[key]
                    
            //         // extracting visits per entity
            //         // need to be consistent with the template
            //         // for rendering vue tables
            //         rex[key].forEach(entity => {
            //             entity.visits = entity.searchElement.visitCount
            //             entity.lastVisitTime = moment(entity.searchElement.lastVisitTime).format("MMM Do YY")
            //         })
            //     }
            //     return rex
            // }, {})

            var dt = Object.keys(temp1).reduce((rex, key) => { // temp 1 - project without branching
                
                // if (Object.keys(this.projects).includes(key)) {
                //     console.log("Filtered", key)}
                
	        // if (!Object.keys(this.projects).includes(key)) {
                
	            rex[key] = temp1[key]
                    // extracting visits per entity
                    // need to be consistent with the template
                    // for rendering vue tables
                    rex[key].forEach(entity => {
                        entity.visits = entity.searchElement.visitCount
                        entity.lastVisitTime = moment(entity.searchElement.lastVisitTime).format("MMM Do YY")
                    })
                // }
                return rex
            }, {})
            
            this.finestHistory = dt
            console.log("Simple project space", dt)
        }
    },
    methods: {
        redirect: function(link, entityCheck) {
            if (link == null) {
                console.error("Link is null for this entity: ", entityCheck)
            } else {
                console.log(link)
                // window.open(link, '_blank')
                // window.location.replace(link)

                if (document.getElementById("rtmframe")) {
                    document.getElementById("rtmframe").remove()
                }
                
                var frame = document.createElement('iframe');
                
	        frame.setAttribute('width', '100%');
	        frame.setAttribute('height', '100%');
	        frame.setAttribute('frameborder', '0');
	        frame.setAttribute('id', 'rtmframe');
                
		frame.setAttribute('src', link);
                document.body.appendChild(frame)
                
            }
        },
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
         * @return - no return value, pushes to this.history
         */
        searchHistory: function(){
            chrome.history.search({text: "", maxResults: 0, startTime: 0}, (data) => {
                data.forEach((page) => {
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


            // used in order to create projects
            // localised into separate functions
            // because is used in two cases
            var prepareProjects = (inputStructures) => {

                var projects = this.uniteProjects(inputStructures),
                    ttprj = {};
                
                console.log("Accessing structure storage:", inputStructures)
                
                // assembling projects, while considering their structures
                projects.filter(el => { if (el.project) {return el}})
                    .forEach(el => {
                        ttprj[el.project] = this.finalHistory.filter(ws => ws.webstrateId == el.project || ws.webstrateId == el.wsId)
                        ttprj[el.project].forEach(entity => entity.lastVisitTime = moment(entity.searchElement.lastVisitTime).format("MMM Do YY"))
                    })
                
                this.projects = ttprj
                console.log("Projects with branching structure", this.projects)

            }

            
            
            
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

                            // TODO: make this a function
                            prepareProjects(result["structures"])
                            
                            // var projects = this.uniteProjects(result["structures"]),
                            //     ttprj = {};
                            // console.log("Accessing structure storage:", result["structures"])
                            // // assembling projects, while considering their structures
                            // projects.filter(el => { if (el.project) {return el}})
                            //     .forEach(el => {
                            //         ttprj[el.project] = this.finalHistory.filter(ws => ws.webstrateId == el.project || ws.webstrateId == el.wsId)
                            //         ttprj[el.project].forEach(entity => entity.lastVisitTime = moment(entity.searchElement.lastVisitTime).format("MMM Do YY"))
                            //     })
                            // this.projects = ttprj
                            // console.log("Projects with branching structure", this.projects)


                        } else { // structure storage is empty
                            
                            flag = true;
                            console.log("Structure storage is empty")

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

                                prepareProjects(responseStr)

                                
                            }
                        );
                        
                        });
                            }
                            
                        }
                    });
                    
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


            var processedHistoryMutated,
                fnl,
                grpProjects;
                
            
            // FIXME:
            processedHistoryMutated = groupBy(processedHistory, "webstrateId")
            Object.keys(processedHistoryMutated).forEach(el => processedHistoryMutated[el].arr = null) //
            fnl = Object.keys(processedHistoryMutated).map(el => { try { return processedHistoryMutated[el] } catch(error) { return null} });
            grpProjects = groupByProjects(processedHistory, "webstrateId");
            
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

        this.searchHistory()

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

            // FIXME: interfering with old ways of making projects
            this.finalHistory = projectsOld

            // filtering those projects, which webstrate server is
            // not in the list
            // projectsNew

            // FIXME: fetch from any server - API limitation
            
            // TODO: list of servers
            // TODO: update list of servers to vue globals
            console.log("List of servers in Popup", this.server)
            var projectsNewFiltered = Object.keys(projectsNew).map(el => {
	        if (projectsNew[el].some(ar => this.server.includes(ar.server))) {return el}
            })
                .filter(el => el != undefined)
                .reduce((res, key) => (res[key] = projectsNew[key], res), {} );

            projectsNew = projectsNewFiltered

            // filtering duplicates within projects by a composite key
            Object.keys(projectsNew).forEach(el1 => {
	        projectsNew[el1] = projectsNew[el1].filter((el, index, self) => 
                                                           self.findIndex(t => t.webstrateId === el.webstrateId &&
                                                                          t.server === el.server &&
                                                                          t.version == el.version &&
                                                                          t.bookmark == el.bookmark) === index)
            })

            // INFO: from here goes to watcher
            // waiting for both work spaces to be prepared in
            // order to synchronise them
            
            this.simpleProjects = projectsNew
            // this.finestHistory = projectsNew
            
            // TODO: group entities with equal webstrateId in together
            // TODO: except those with structure Projects

            // console.log(this.finestHistory, "Finest History")
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
