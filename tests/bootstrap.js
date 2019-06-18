const {navigate, promiseState, navigationTarget, chrome} = require("./config.js");

const puppeteer = require("puppeteer")


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


(async function() {
    await boot("tests.html");
})()