<template>

<div id="options">
  <header class="header">
    <h1> Options </h1>
      <svg width="12" height="12" id="icn" :ref="icn"></svg>
  </header>
  <span>Add New Webstrate Server</span>
  <br>
  <textarea v-model="serverAdd" placeholder="add server"></textarea>
  <br>
  <p style="white-space: pre-line;"> {{ status }} </p>
  
  <br>
  <button @click="saveOptions">Save Server</button>
  <button @click="restore_options">Load Saved Servers</button>
  <button @click="deleteOptions">Delete Saved Servers</button>

  <br>
  
  <ul v-for="srv in server">
    <li> {{ srv }} </li>
  </ul>
  </div> 
  
</template>


<script lang="js">

import * as d3 from 'd3';
import {
   storageMixin
} from '../../mixin'

export default {
    mixins: [storageMixin],
    data: () => ({
        selected: "",
        status: "unsaved",
        icon: '',
        server: [],
        serverAdd: '',
    }),
    // computed: {
        // server() {return serverReact}
    // },
    methods: {
         // deletes existing servers 
        deleteOptions: function() {
            var jsObj = {}
            jsObj["server"] = []
            chrome.storage.sync.set(jsObj, () =>  {
                this.status = 'Options Deleted'
                this.server = ''
            });
        },
        saveOptions: function() {
            try {
                chrome.storage.sync.get(null, (result) =>  {
                    if (typeof result["server"] !== undefined) {
                        
                        // INFO: if results are not in array, make them
                        var array = Array.isArray(result["server"]) ? result["server"] : [result["server"]],
                            jsObj = {};
                        jsObj["server"] = array
                        jsObj["server"].push(this.serverAdd) // adding new server
                        
                        this.server = jsObj["server"] // FIXME: react server
                        
                        chrome.storage.sync.set(jsObj, () =>  {
                            console.log("Saved a new array item", jsObj);
                            this.status = 'Options saved'
                        });
                    } else {
                        console.log("Servers are not defined")
                    }
                })
            } catch(error) {
                console.log("Issue with Saving Servers", error)
            }
        }
        },
        
    mounted() {

        this.icon = "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"

        d3.select("#icn")
            .append("g")
	    .attr("transform", (d) => { return "translate(" + (10) + ",2)";})
	    .append("path")
	    .attr("d", this.icon)
            
            }
            
    }
        
</script>


<style>

</style>
