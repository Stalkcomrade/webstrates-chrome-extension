// Instruction to ESLint that 'describe', 'before', 'after' and 'it' actually has been defined.
/* global describe before after it */

const puppeteer = require("puppeteer-core")
const chrome = require('sinon-chrome/extensions');

const sinon = require('sinon');
const chai = require("chai")
const assert = chai.assert


const config = require("./config.js")
const navigate = config.navigate,
      navigationTarget = config.navigationTarget

// var jsdom = require('mocha-jsdom')

const url = 'chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/popup.html';

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

describe('navigate.js', function() {

    before(function() {
        global.chrome = chrome;
    });

    it('should navigate to new window', function() {
        
        assert.ok(chrome.windows.create.notCalled, 'windows.create should not be called');
        
        navigate(url, navigationTarget.NEW_WINDOW);
        
        assert.ok(chrome.windows.create.calledOnce, 'windows.create should be called');
        
        assert.ok(
            chrome.windows.create.withArgs({
                url,
                focused: true,
                type: 'normal'
            }).calledOnce,
            'windows.create should be called with specified args'
        );
    });
});

// var FILENAME = '../src/popup.html';
// extensionPath = "";

// TODO: try change extensionPath from src to build
const extensionPath = 'build';
let extensionPage = null;
let browser = null;


async function boot(extensionPopup) {
    browser = await puppeteer.launch({
        executablePath: "/bin/google-chrome",
        headless: false, // extension are allowed only in head-full mode
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
        ]
    });

    const dummyPage = await browser.newPage();
    await dummyPage.waitFor(2000); // arbitrary wait time.

    const targets = await browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
        return _targetInfo.title === 'Vue.js Chrome Extension';
    });

    const extensionUrl = extensionTarget._targetInfo.url || '';
    const [,, extensionID] = extensionUrl.split('/');
    const extensionPopupHtml = extensionPopup

    extensionPage = await browser.newPage();
    await extensionPage.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);
}




// only before vue
require('jsdom-global')() // for mocha + vue test utils

const mount = require('@vue/test-utils').mount;
const shallowMount = require('@vue/test-utils').shallowMount;
const Vue = require("vue").Vue;
// import PopupTest from '../src/js/popup/Popup.vue';
import PopupTest from '../src/js/popup/Popup.vue';
// const PopupTest = require('../src/js/popup/Popup.vue');
// const PopupTest = require('../build/popupVue.bundle.js');
// const mixin = require('../src/mixin.js').storageMixin;

// Vue.config.devtools = true;

// var tsp = sinon.spy(mixin.methods, 'restore_options')


let mountWrapper;

debugger;

describe('Testing Testing', function() {
    
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    
    before(async function() {

        await boot("testPuppeteer.html");

        // mountWrapper = mount(PopupTest)
        debugger;
        mountWrapper = shallowMount(PopupTest)
        
        // mountWrapper = mount(PopupTest, {
        //     // mixins: [mixin]
        // })
        // mountWrapper.setData({ test: "test1" })

    
        
        var tsp = sinon.spy(mountWrapper.vm, 'restore_options')
        
    });

    describe('vue test utils', function() {
        
        // Inspect the component instance on mount
        it('correctly sets the message when created', function() {
            assert.equal(mountWrapper.vm.test, 'test1')
        })

        // it('restore options is called without error', function(done) {
        //     setTimeout(function() {
        //         console.log(tsp.getCall(0))
        //         done()
        //     }, 5000)
        // }).timeout(7000)

        // it('restore options return true', function(done) {

        //     setTimeout(function() {
        //         promiseState(tsp.getCall(0).returnValue, function(state) {
        //             assert.equal(state,'fulfilled');
        //             done()
        //         })
                
        //     }, 5000)
            
        // }).timeout(10000)
    })

    // describe('Home Page', async function() {
    //     // it('Greet Message', async function() {
    //     jsdom({
    //         url: "http://localhost"
    //     })

    //     it('restore options return true', function(done) {
    //         setTimeout(function() {
    //             promiseState(window.tsp.getCall(0).returnValue, function(state) {
    //                 assert.equal(state,'fulfilled');
    //                 done()
    //             })
                
    //         }, 5000)
            
    //     }).timeout(10000)
            
    //         // it('correctly sets the message when created', async function() {
    //         //     // const window = directJSHandle(page.evaluate(() => window))
    //         //     setTimeout(function() {
    //         //         // const windowObjectAvailable = function() {
    //         //             // if (tspsd != ) {return true} else {return false}
    //         //         // }

    //         //         var tt = windowObjectAvailable;
                    
    //         //         assert.isTruel(tt)
    //         //     }, 5000)
                
                      
    //         // })

    //     // it('restore options is called without error', function(done) {
    //     //         setTimeout(function() {
    //     //             console.log(window.tsp.getCall(0))
    //     //             done()
    //     //         }, 5000)
    //     //     }).timeout(7000)
            
    //     // })
    // });

    // after(async function() {
    //     await browser.close();
    // });
});


describe('Extension UI Testing', function() {
    
    this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
    before(async function() {
        await boot("popup.html");
    });

    describe('Home Page', async function() {
        it('Greet Message', async function() {
            
            const inputElement = await extensionPage.$("[id='test-title']");
            assert.ok(inputElement, 'Input is not rendered');
            
            // await extensionPage.type("[id='test-title']", 'Webstrates1');
            // await extensionPage.click('[data-test-greet-button]');
            
            const greetMessage  = await extensionPage.$eval('#test-title', element => element.textContent)
            assert.equal(greetMessage, 'Webstrates', 'Webstrates title is not shown');
        })
    });

    after(async function() {
        await browser.close();
    });
});
