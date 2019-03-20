<template>

<div id="options">
  <header class="header">
    <h1> Options </h1>
  </header>
  <span>Add New Webstrates Server</span>
  <br>
  <textarea v-model="server" placeholder="add server"></textarea>
  <br>
  <p style="white-space: pre-line;"> {{ status }} </p>
  
  <br>
  <button @click="save_options">Save Server</button>
  <button @click="restore_options">Load Saved Servers</button>
  <button @click="delete_options">Delete Saved Servers</button>

  <br>
  <ul v-for="srv in server">
    <li> {{ srv }} </li>
  </ul>
  
  <br>
  <br>
  
  <select v-model="selected">
    <option disabled value=""> Select Grouping </option>
      <option v-for="option in options"> {{ option }} </option>
  </select>
  <span> Selected: {{ selected }} </span>

  <svg width="120" height="120" id="icn" :ref="icn">
    <!-- <a :ref="ref"> -->
      </svg>

  <br>


  </div> 
  
</template>


<script lang="js">

import * as d3 from 'd3';

export default {
    
    data: () => ({
        selected: "",
        server: [],
        icon: '',
        // serverReact: [],
        status: "unsaved",
        options: ["by server", "by webstrate"]
    }),
    computed: {
        // server() {return serverReact}
    },
    methods: {

        delete_options: function() {

            var jsObj = {}
            jsObj["server"] = []
                        
            chrome.storage.sync.set(jsObj, () =>  {
                
                this.status = 'Options Deleted'
                this.server = ''
                
            });

        },
        // Restores select box and checkbox state using the preferences
        // stored in chrome.storage.
        restore_options: function() {
            
            chrome.storage.sync.get(null, (servers) => {
                
                this.server = Object.values(servers.server) // SOLVED: server is not really array get array of values
                console.log(this.server)

            })
        },
        
        // Saves options to chrome.storage
        save_options: function() {
            
            try {
                
                // chrome.storage.sync.get(["server"], (result) =>  {
                chrome.storage.sync.get(null, (result) =>  {
                    
                    if (typeof result["server"] !== undefined) {
                        
                        // INFO: if results are not in array, make them
                        var array = Array.isArray(result["server"]) ? result["server"] : [result["server"]]
                        this.server = array.unshift(this.server) // FIXME: react server
                        var jsObj = {}
                        jsObj["server"] = array
                        
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
