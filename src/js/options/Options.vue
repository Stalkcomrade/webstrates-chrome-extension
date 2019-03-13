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

  <br>
  <br>
  
  <select v-model="selected">
    <option disabled value="">Select Groupping</option>
      <option v-for="option in options"> {{ option }} </option>
  </select>
  <span>Selected: {{ selected }}</span>


  <br>

  <div v-for"serverinst in server">  
    <p> {{ serverinst }} </p>
      

  </div>
  
</template>


<script lang="js">

export default {
    
    data: () => ({
        selected: "",
        server: [],
        status: "unsaved",
        options: ["by server", "by webstrate"]
    }),

methods: {
    
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
restore_options: function() {
        
chrome.storage.sync.get(null, (servers) =>  {

    // debugger;


   console.log(servers)
 console.log(Object.keys(servers))

  this.server = Object.values(servers.server) // get array of values
  console.log(this.server)
})
},

        // Saves options to chrome.storage
save_options: function() {

// TODO: checking for existing settings in the beginning

var flag = false

try {

// chrome.storage.sync.get(["server"], (result) =>  {
chrome.storage.sync.get(null, (result) =>  {

if (typeof result["server"] !== undefined) {

console.log(result["server"])
var array = result["server"] // not sure it is needed

array.unshift(this.server)

var jsObj = {}
jsonObj["server"] = array

chrome.storage.sync.set(jsonObj, () =>  {

console.log("Saved a new array item", jsonObj);
// this.server = jsonObj
this.status = 'Options saved'

});


} else (flag = true)

})

} catch(error) {console.log("CAtched", error) }

if (flag === true) {

             var server = this.server
             chrome.storage.sync.set({
                // server
             }, () => {
                
                // Update status to let user know options were saved.
              this.status = 'Options saved'
              console.log(this.status)
                console.log("saved")
                
                  // setTimeout(() => {
                //     this.status = ''
                // }, 1000)
                
             })

// TODO: push new server or retrive from storage


}

        },
            
    mounted() {

        this.$nextTick(function () {
            this.restore_options()
  })

setTimeout(() => {
console.log(this.server)
}, 2000)

        

        

            }
            
    }
}
        
</script>


<style>

  </style>
