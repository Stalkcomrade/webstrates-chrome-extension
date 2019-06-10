/* global describe before after it mocha */


const chai = require("chai");
mocha.setup('bdd'); 

const assert = chai.assert,
    expect = chai.expect;

import Vue from 'vue';
import Popup from '../src/js/popup/Popup.vue';

// SOLVED: change MyComponent to Popup
Vue.config.devtools = true;

new Vue({
    el: '#tests',
    render: c => c(Popup)
});

// Here are some Jasmine 2.0 tests, though you can
// use any test runner / assertion library combo you prefer
describe('Popup', () => {

    // Evaluate the results of functions in
    // the raw component options
    it('sets the correct default data', () => {
        
        assert.equal(typeof Popup.data, 'function')
        
        const defaultData = Popup.data()
        assert.equal(defaultData.test, 'test')
    })


    // Inspect the component instance on mount
    it('correctly sets the message when created', () => {
        
        const vm = new Vue(Popup).$mount()
        assert.equal(vm.test, 'test')
        
    })


    // Mount an instance and inspect the render output
    // it('renders the correct message', () => {
    //     const Constructor = Vue.extend(Popup)
    //     const vm = new Constructor().$mount()
    //     expect(vm.$el.textContent).toBe('bye!')

    // })
})


mocha.run();
