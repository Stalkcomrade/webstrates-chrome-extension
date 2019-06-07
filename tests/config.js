const chrome = require('sinon-chrome/extensions');

const navigationTarget = {
    NEW_WINDOW: 'new-window',
    NEW_TAB: 'new-tab',
    CURRENT_TAB: 'current-tab',
};

/**
 * Navigate user
 * @param {String} url
 * @param {String} [target]
 * @returns {*}
 */
function navigate(url, target = navigationTarget.NEW_TAB) {
    switch (target) {
        case navigationTarget.NEW_WINDOW:
            return chrome.windows.create({
                url: url,
                focused: true,
                type: 'normal'
            });
        case navigationTarget.CURRENT_TAB:
            return chrome.tabs.update({
                url: url,
                active: true
            });
        default:
            return chrome.tabs.create({
                url: url,
                active: true
            });
    }
}


module.exports = {
    navigationTarget: navigationTarget,
    navigate: navigate
}