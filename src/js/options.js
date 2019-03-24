import Vue from 'vue';
import Options from './options/Options.vue';

Vue.config.devtools = true;

new Vue({
    el: '#options',
    render: c => c(Options)
});