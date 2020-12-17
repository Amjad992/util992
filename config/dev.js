/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * @param  {} object
 * @param  {} value
 */
module.exports.setValue = (object, key, value) => {
  if (value) object[key] = value;
  else
    throw `parameter has no value! If you need to keep the current value, then you don't need to call this function.\n Current Value is: ${v.g.notSupportedKey}`;
};
