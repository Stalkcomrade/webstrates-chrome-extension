// Instruction to ESLint that 'describe', 'before', 'after' and 'it' actually has been defined.
/* global describe before after it */

const {navigate, promiseState, navigationTarget, chrome} = require("./config.js");

const puppeteer = require("puppeteer")
const sinon = require('sinon');
const chai = require("chai")
const assert = chai.assert



const url = 'chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/popup.html',
    extensionPath = 'build';

let extensionPage = null;
let browser = null;


async function boot(extensionPopup) {
    browser = await puppeteer.launch({
        executablePath: "/bin/google-chrome",
        devtools: true,
        headless: false, // extension are allowed only in head-full mode
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`,
            `--remote-debugging-port=9229`
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



// only before vue
require('jsdom-global')() // for mocha + vue test utils


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
