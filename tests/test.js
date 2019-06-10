// Instruction to ESLint that 'describe', 'before', 'after' and 'it' actually has been defined.
/* global describe before after it */

const puppeteer = require("puppeteer-core")
const chrome = require('sinon-chrome/extensions');

const chai = require("chai")
const assert = chai.assert

const config = require("./config.js")
const navigate = config.navigate,
      navigationTarget = config.navigationTarget


const url = 'chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/popup.html';

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

var FILENAME = '../src/popup.html';
    // extensionPath = "";

// TODO: try change extensionPath from src to build
const extensionPath = 'build';
let extensionPage = null;
let browser = null;


async function boot(extensionPopup) {
    browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium-browser",
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


// TODO: for this test I need to compile mocha to 
describe("Test Vue Component", function() {
    this.timeout(20000);

    before(async function() {
        await boot("tests.html")
    })

})


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



// describe('DOM Stress Test', function() {
//     this.timeout(10000);
//     let browserA, browserB, pages, pageA;
//     before(async () => {
// 	browserA = await puppeteer.launch({
//             executablePath: "/usr/bin/chromium-browser",
//             headless: false,
//             args: [
//                 `--disable-extensions-except=${extensionPath}`,
//                 `--load-extension=${extensionPath}`
//             ]
//         });
// 	pages = await Promise.all([
// 	    browserA.newPage(), browserA.newPage(), browserA.newPage(),
// 	]);
// 	pageA = pages[0];
// 	await Promise.all(pages.map(page =>
// 			            page.goto(url, { waitUntil: 'networkidle2' })));
// 	// await Promise.all(pages.map(page =>
// 	// 		            util.waitForFunction(page, () =>
// 	// 			                         window.webstrate &&
// 	// 			                         window.webstrate.loaded &&
// 	// 			                         document.body)));
//     });
//     after(async () => {
// 	await browserA.close();
//     });
//     it('body should initially be empty', async () => {
// 	const innerHTML = await pageA.evaluate(() => document.body);
//         const nt = innerHTML.getElmentById("__BVID__3");
// 	assert.isEmpty(nt);
//     });
// });
