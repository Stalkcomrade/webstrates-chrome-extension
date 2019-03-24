import Vue from 'vue';
import Popup from './popup/Popup.vue';

Vue.config.devtools = true;

new Vue({
    el: '#app',
    render: c => c(Popup)
});