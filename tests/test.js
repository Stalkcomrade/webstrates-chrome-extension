const chrome = require('sinon-chrome/extensions');

const chai = require("chai")
const assert = chai.assert

const config = require("./config.js")
const navigate = config.navigate,
      navigationTarget = config.navigationTarget



describe('navigate.js', function() {

    const url = 'chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/options.html';

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
