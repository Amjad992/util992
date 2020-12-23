/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Set a specific key inside a an object with a value
 * @param  {object} object - The parent object of the key
 * @param  {string} key - The key string
 * @param  {object} value - The value
 * @returns Return undefined if set successfully set, or throws an error if no value passed
 */
module.exports.setValue = (object, key, value) => {
  if (value) object[key] = value;
  else
    throw `parameter passed has no value! If you need to keep the current value, then you don't need to call this function.\nCurrent Value is: ${object[key]}`;
};
