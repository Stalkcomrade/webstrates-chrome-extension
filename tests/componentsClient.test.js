/* global describe beforeEach afterEach after it mocha */

const chai = require("chai"),
      sinon = require('sinon');

const assert = chai.assert,
      expect = chai.expect;


mocha.setup('bdd');
mocha.growl(); // <-- Enables web notifications


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


// TODO: into utils
let promiseState = function(promise, callback) {
  // Symbols and RegExps are never content-equal
  var uniqueValue = window['Symbol'] ? Symbol('unique') : /unique/

  function notifyPendingOrResolved(value) {
    if (value === uniqueValue) {
      return callback('pending')
    } else {
      return callback('fulfilled')
    }
  }

  function notifyRejected(reason) {
    return callback('rejected')
  }
  
  var race = [promise, Promise.resolve(uniqueValue)]
  Promise.race(race).then(notifyPendingOrResolved, notifyRejected)
};

describe('vue test utils', function() {
    
    // Inspect the component instance on mount
    it('correctly sets the message when created', function() {
        assert.equal(mountWrapper.vm.test, 'test1')
    })

    it('restore options is called without error', function(done) {
        setTimeout(function() {
            console.log(tsp.getCall(0))
            done()
        }, 5000)
    }).timeout(7000)

    it('restore options return true', function(done) {

        setTimeout(function() {
            promiseState(tsp.getCall(0).returnValue, function(state) {
                assert.equal(state,'fulfilled');
                done()
            })
            
        }, 5000)
        
    }).timeout(10000)
})


mocha.run();
