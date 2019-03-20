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
      </header>
  </div>
</template>


<script lang="js">

export default {
    methods: {
        searchHistory: function(text){
            chrome.history.search({text: text,
                                   maxResults: 1000}, (data) => {
                                       data.forEach((page) => {
                                           console.log(page.url);
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
  data: () => ({
      config: []
  }),
    mounted() {

        this.searchHistory("webstrates")
        
        this.$nextTick(() => {
            chrome.storage.sync.get(['config'], this.setConfig)
        })

        setTimeout(() => {
            console.log(this.config)
        }, 3000)
          
      }
      
  }
</script>
