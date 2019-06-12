/* global describe beforeEach afterEach after it mocha */


const chai = require("chai");
const sinon = require('sinon');


mocha.setup('bdd'); 

const assert = chai.assert,
    expect = chai.expect;


import { mount } from '@vue/test-utils';
import Vue from 'vue';
import PopupTest from '../src/js/popup/Popup.vue';
const mixin = require('../src/mixin.js').storageMixin;


Vue.config.devtools = true;

var tsp = sinon.spy(mixin.methods, 'restore_options')
let mountWrapper;

mountWrapper = mount(PopupTest, {
    mixins: [mixin]
})
mountWrapper.setData({ test: "test1" })

describe('vue test utils', function() {
    
    // Inspect the component instance on mount
    it('correctly sets the message when created', function() {
        assert.equal(mountWrapper.vm.test, 'test1')
    })

    it('restore options is called without error', function(done) {

        setTimeout(function() {
            assert.notEqual(tsp.returnValue, undefined)
            done()
        }, 5000)
        
    }).timeout(7000)
    
})


mocha.run();


// new Vue({
//     el: '#tests',
//     render: c => c(Popup)
// });

// Here are some Jasmine 2.0 tests, though you can
// use any test runner / assertion library combo you prefer

// var Popup = mount(PopupTest).vm
// describe('Popup', () => {

//     // Evaluate the results of functions in
//     // the raw component options
//     // it('sets the correct default data', () => {
//     //     assert.equal(typeof Popup.data, 'function')
//     //     const defaultData = Popup.data()
//     //     assert.equal(defaultData.test, 'test')
//     // })


//     // Inspect the component instance on mount
//     it('correctly sets the message when created', () => {
//         // const vm = new Vue(Popup).$mount()
//         assert.equal(Popup.test, 'test')
//     })

//     // // Mount an instance and inspect the render output
//     // it('renders the correct message', () => {
//     //     const Constructor = Vue.extend(Popup)
//     //     const vm = new Constructor().$mount()
//     //     expect(vm.$el.textContent).toBe('bye!')

//     // })
// })
