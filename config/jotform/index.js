const v = require('../../values');
const dev = require('../dev');

/** Set a specific key inside values of jotform object with a value
 * @param  {string} key - The key string
 * @param  {object} value - The value
 * @returns Return undefined if set successfully set, or throws an error if no value passed
 */
function setValue(key, value) {
  dev.setValue(v.jotform, key, value);
}

// -------------------------- apiKey // --------------------------
/** Set the key to be used on the apiKey for jotform
 * @param  {string} apiKey - The api key
 */
module.exports.apiKey = (apiKey) => setValue('apiKey', apiKey);

// -------------------------- apiKey // --------------------------
/** Set the key to be used on the formId for jotform
 * @param  {string} formId - The form id
 */
module.exports.formId = (formId) => setValue('formId', formId);

// -------------------------- apiKey // --------------------------
/** Set the key to be used on the isHipaa for jotform
 * @param  {string} isHipaa - The hipaa form flag
 */
module.exports.isHipaa = (isHipaa) => setValue('isHipaa', isHipaa);
