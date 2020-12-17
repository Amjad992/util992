const v = require('../values');
const {notSupportedMessage} = require('../values/general');

const dev = require('./dev');

// -------------------------- getNotSupported
module.exports.notSupportedKey = (key) => {
  try {
    dev.setValue(v.g, 'notSupportedKey', key);
  } catch (err) {
    throw err;
  }
};
module.exports.notSupportedMessage = (message) => {
  try {
    dev.setValue(v.g, 'notSupportedMessage', message);
  } catch (err) {
    throw err;
  }
};
// -------------------------- getNotSupported

// -------------------------- hitInHouseEndponint
/** Set the Base URL for this service to be used whenever in house endpoint needs to be hit for notification or activation of a process
 * @param  {} baseURL - The Base URL of the service (e.g. https://google.com)
 */
module.exports.hitInHouseEndponintBaseURL = (baseURL) => {
  try {
    // Remove the last character if the baseURL has / at the end (e.g. https://google.com/)
    if (baseURL[baseURL.length] == '/') baseURL.slice(0, -1);
    dev.setValue(v.g, 'hitInHouseEndponintBaseURL', baseURL);
  } catch (err) {
    throw err;
  }
};
// -------------------------- hitInHouseEndponint
