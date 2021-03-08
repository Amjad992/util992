const v = require('../../values');
const dev = require('../dev');

/** Set a specific key inside values general object with a value
 * @param  {string} key - The key string
 * @param  {object} value - The value
 * @returns Return undefined if set successfully set, or throws an error if no value passed
 */
function setValue(key, value) {
  dev.setValue(v.g, key, value);
}

// -------------------------- notSupported // --------------------------
/** Set the key to be used on the notSupported endpoint response
 * @param  {string} key - The key of the clarification message (e.g. description)
 */
module.exports.notSupportedKey = (key) => setValue('notSupportedKey', key);

/** Set the message to be used on the notSupported endpoint response
 * @param  {string} message - The message to clarify this endpoint not supported (e.g. This endpoint is not supported)
 */
module.exports.notSupportedMessage = (message) =>
  setValue('notSupportedMessage', message);
// -------------------------- notSupported // --------------------------

// -------------------------- hitInHouseEndpoint // --------------------------
/** Set the Base URL for this service to be used whenever in house endpoint needs to be hit for notification or activation of a process
 * @param  {string} baseURL - The Base URL of the service (e.g. https://google.com)
 */
module.exports.hitInHouseEndpointBaseURL = (baseURL) =>
  setValue('hitInHouseEndpointBaseURL', baseURL);

// -------------------------- hitInHouseEndpoint // --------------------------
