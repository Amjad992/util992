//-- IMPORTANT - It's actually used in throwErrorIfValueNotSet function eval
const v = require('../../values');
//-- IMPORTANT - so don't delete it under the impression that it's not used

const generalFuncs = require('../general');

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Check if the value is not set (This includes empty strings and arrays)
 * @param  {any} value - The value to check
 */
function isValueNotSet(value) {
  if (
    !generalFuncs.isFunction(value) &&
    (value === undefined ||
      value === null ||
      generalFuncs.isEmptyString(value) ||
      generalFuncs.isEmptyArray(value) ||
      generalFuncs.isEmptyObject(value))
  )
    return true;
  else return false;
}
/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Return an error response with a message to tell the user that the property is not set yet, and they have to set it using specific config function
 * @param  {string} path - The path under which this property is
 * @param  {string} propertyName - The property name that is not set
 * @param  {boolean} offerPassing - Flag used to decide either to tell user that they have the option to pass value instead of configuring it (Optional, default is false)
 * @returns - Return a response following this module's format (response will be created using func.constructResponse functionality)
 */
function errorPropertyNotSetNorPassed(path, propertyName, offerPassing) {
  let message = '';
  if (offerPassing)
    message = `${propertyName} property is not set yet nor passed, you either pass it or alternatively please use the config.${path}.${propertyName} function to do that first.`;
  else
    message = `${propertyName} property is not set yet, please use the config.${path}.${propertyName} function to do that first.`;

  return generalFuncs.constructResponse(false, 400, message);
}

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Throws an error if a value is not set, and provide proper message for the error with instruction on how to configure the value
 * @param  {string} path - The path under which this property is
 * @param  {string} propertyName - The property name that is not set
 * @returns - Throws an error if not set, or return undefined if set
 */
module.exports.throwErrorIfValueNotSet = (path, propertyName) => {
  const value = eval(`v.${path}.${propertyName}`);
  if (isValueNotSet(value))
    throw errorPropertyNotSetNorPassed(path, propertyName);
  else return;
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Throws an error if a value is not set and at the same time not passed in the function parameters, and provide proper message for the error with instruction on how to configure the value or pass it
 * @param  {string} path - The path under which this property is
 * @param  {string} propertyName - The property name that is not set
 * @returns - Throws an error if not set, or return undefined if set
 */
module.exports.throwErrorIfValueNotPassedAndNotSet = (
  passedValue,
  path,
  propertyName
) => {
  const value = eval(`v.${path}.${propertyName}`);

  if (isValueNotSet(passedValue) && isValueNotSet(value))
    throw errorPropertyNotSetNorPassed(path, propertyName, true);
  else return;
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Return an error response with a message to tell the user that the property is not passed while it should
 * @param  {string} propertyName - The property name that is not passed
 * @returns - Return a response following this module's format (response will be created using func.constructResponse functionality)
 */
function errorPropertyNotPassed(propertyName) {
  return generalFuncs.constructResponse(
    false,
    400,
    `${propertyName} parameter is not provided with the request.`
  );
}

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Throws an error if a parameters that is necessary to be passed is not passed to the function
 * @param  {any} value - The value to check if provided or not
 * @param  {string} propertyName - The property name that is not passed
 * @returns - Throws an error if not set, or return undefined if set
 */
module.exports.throwErrorIfValueNotPassed = (value, propertyName) => {
  if (isValueNotSet(value)) throw errorPropertyNotPassed(propertyName);
  else return;
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * Check if the error passed is set according to this module construct response function (that means it's thrown using function like the ones above this one), however, if it's not then that means Axios throw it and we'll have to format it for user before throw it
 * @param  {object} errOrRes - The error or repsonse to check if it comes from Axios error or internal error thrown
 */
module.exports.formatError = (error) => {
  if (error.response) {
    // It's an error coming from axios
    return generalFuncs.constructResponse(
      false,
      error.response.status,
      error.message,
      error.response.data
    );
  } else if (error.success === false && error.code) {
    // It's already formatted using this module construct response function so just return it
    return error;
  } else {
    // It's a another error thrown here directly
    return generalFuncs.constructResponse(
      false,
      400,
      error.message,
      undefined,
      {
        errorName: error.name,
      }
    );
  }
};
