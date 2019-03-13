<template>
  <div id="app">
      <header class="header">
        <h1> Webstrates Bookmarks </h1>
        <p> </p>
        <div v-for="bk in config">
          <p> {{ bk.title }} : {{  bk.url }} </p>
          <img src="ws.png"/>
        </div>
      </header>
  </div>
</template>


<script lang="js">
export default {
    methods: {
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

console.log("vue")
 this.$nextTick(function () {
chrome.storage.sync.get(['config'], this.setConfig)
  })

setTimeout(() => {
console.log(this.config)
}, 3000)

          
      }
      
  }
</script>
