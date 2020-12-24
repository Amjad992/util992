const v = require('../../values');
const dev = require('../dev');

/** Set a specific key inside values of airtable object with a value
 * @param  {string} key - The key string
 * @param  {object} value - The value
 * @returns Return undefined if set successfully set, or throws an error if no value passed
 */
function setValue(key, value) {
  dev.setValue(v.airtable, key, value);
}

// -------------------------- baseId // --------------------------
/** Set the key to be used on the baseId for airtable
 * @param  {string} baseId - The base id
 */
module.exports.baseId = (baseId) => setValue('baseId', baseId);
