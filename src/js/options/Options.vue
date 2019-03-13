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

  <br>
  <br>
  
  <select v-model="selected">
    <option disabled value="">Select Groupping</option>
      <option v-for="option in options"> {{ option }} </option>
  </select>
  <span>Selected: {{ selected }}</span>
  
</div>
  
</template>


<script lang="js">

export default {

    data: () => ({
        server: [],
        status: "unsaved",
        options: ["by server", "by webstrate"]
    }),

    methods: {

        // Saves options to chrome.storage
        save_options: function() {
            
            var server = this.server
            
            chrome.storage.sync.set({
                server: server
            }, () => {
                
                // Update status to let user know options were saved.
                    this.status = 'Options saved'
                console.log(this.status)
                console.log("saved")
                
                  // setTimeout(() => {
                //     this.status = ''
                // }, 1000)
                
            })

        },
            
            mounted() {

            }
            
    }
}
        
</script>


<style>

  </style>
