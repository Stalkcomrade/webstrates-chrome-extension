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
var navigate = function(url, target = navigationTarget.NEW_TAB) {
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

var promiseState = function(promise, callback) {
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

module.exports = {
    navigate: navigate,
    promiseState: promiseState,
    navigationTarget: navigationTarget,
    chrome: chrome
}
