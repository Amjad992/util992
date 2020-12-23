//-- IMPORTANT - It's actually used in throwErrorIfValueNotSet function eval
const v = require('../values');
//-- IMPORTANT - so don't delete it under the impression that it's not used

const generalFuncs = require('./general');

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Check if the value is not set (Doesn't equal neither '' or null)
 * @param  {any} value - The value to check
 */
isValueNotSet = (value) => {
  if (value === '' || value === null) return true;
  else return false;
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Return an error response with a message to tell the user that the property is not set yet, and they have to set it using specific config function
 * @param  {string} propertyName - The property name not set
 * @param  {string} path - The path under which this property is
 * @returns - Return a response following this module's format (response will be created using func.constructResponse functionality)
 */
errorPropetryNotSet = (propertyName, path) => {
  return generalFuncs.constructResponse(
    false,
    400,
    `${propertyName} property is not set yet, please use the config.${path}.${propertyName} function to do that first.`
  );
};
/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Throws an error if a value is not set, and provide proper message for the error with instruction on how to configure the value
 * @param  {string} path
 * @param  {string} propertyName
 * @returns - Throws an error if not set, or return null if set
 */
module.exports.throwErrorIfValueNotSet = (path, propertyName) => {
  const value = eval(`v.${path}.${propertyName}`);
  if (isValueNotSet(value)) throw errorPropetryNotSet(propertyName, path);
  else return;
};
