const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalThis = this;

/** Return a JSON object with a key and a message stating that the method endpoint is not supported
 * @param  {string} method - The HTTP method not supported (e.g. POST) // (Optional) //
 * @param  {string} key - The indicative property key (e.g. error) // (Optional - configurable through the config.g object) //
 * @param  {string} message - The indicative property message (e.g. Some error message) // (Optional - configurable through the config.g object) //
 * @returns {object} - A JSON object that has 2 keys, first is the method, and second is the indicative property
 **
 {
 method: 'POST',
 error: 'Some error message'
 }
 */
module.exports.endpointNotSupported = (
  method = null,
  key = v.g.notSupportedKey,
  message = v.g.notSupportedMessage
) => {
  return {
    method,
    [key]: message,
  };
};

/** Contstruct a unified response of success or failure, values not provided won't be included in the returned object
 * @param  {boolean} success - Is the response of success or failure // (Optional, default is true) //
 * @param  {boolean} code - The request code (can be used when it's a response of an API request)
 * @param  {string} message - Message of the response // (Optional, default is null) //
 * @param  {object} body - Body of the response or the error // (Optional, default is null) //
 * @param  {object} otherAttributes - Any extra attributes to be included in the response, this can be used if request is successful however it doesn't have data and need to point that out (e.g. Although the request was successful, contact wasn't find, so it success would be true however it will have an attribute that shows that no contact found) // (Optional, default is null) //
 * @returns - A JSON object holding four values indicating the status of the process, as well as provide more information if needed
  **
 {
   success: true,
   code: 200,
   message: 'Successfully retrived contacts data',
   body: {
    data: []
   },
   contactFound: false
 }
 **
 {
   success: false,
   code: 401,
   message: 'Unauthorized request'
   body: {
    error: 'API key is not authorized'
   }
 }
 */
module.exports.constructResponse = (
  success = true,
  code = 200,
  message = null,
  body = null,
  otherAttributesObj = null
) => {
  let resObj = {
    success,
    code,
  };

  message ? (resObj.message = message) : null;
  body ? (resObj.body = body) : null;

  for (key in otherAttributesObj) {
    resObj[key] = otherAttributesObj[key];
  }
  return resObj;
};

/** Halt execution of the program for some time
 * @async
 * @param  {Integer} milliseconds - Time in milliseconds to halt the execution (Optional - Default is 1000 millisecond) //
 * @returns - Returns nothing
 */
module.exports.sleep = async (milliseconds = 1000) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

/** Function used to hit an endpoint in this service to activate some actions (e.g. update, start scheduler ... etc)
 --- Before using this function, you would need to configure the base url using the function config.hitInHouseEndpointBaseURL
 * @async
 * @param  {String} endpoint - The endpoint to be hit (e.g. sample) // (Optional - Default is the empty string '') //
 * @param  {String} method - The method to be used (get, post, put, patch, delete) // (Optional - Default is get) //
 * @param  {Object} body - The body to include // (Optional - Default is empty object {}) //
 * @returns - Return a response following this module's format (response will be created using func.constructResponse functionality)
 ** In case of error, it will throw an exception with an object following the same format
 */
module.exports.hitInHouseEndpoint = async (
  endpoint = '',
  method = 'get',
  body = {}
) => {
  //
  if (endpoint[0] === '/') endpoint = endpoint.substring(1);
  const url = `${v.g.hitInHouseEndpointBaseURL}/${endpoint}`;

  try {
    dev.throwErrorIfValueNotSet('g', 'hitInHouseEndpointBaseURL');
    const response = await axios({
      method: method.toLowerCase(method),
      url,
      data: JSON.stringify(body),
    });

    const resData = response.data;

    if (!resData.success)
      throw generalThis.constructResponse(
        false,
        resData.code,
        `Error returned on hitting endpoint ${endpoint}`,
        resData
      );
    else
      return generalThis.constructResponse(
        true,
        resData.code,
        `Successfully hit the endpoint /${endpoint}`,
        resData
      );
  } catch (err) {
    throw err;
  }
};

/** Function used to hit a url in an outside service with a simple non authenicated request, this can be used for webhooks with non-sensitive data
 * @async
 * @param  {String} url - The url to hit with the request
 * @param  {String} method - The method to be used (get, post, put, patch, delete)
 * @param  {Object} body - The body to include  // (Optional - Default is empty object {}) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.hitURL = async (url, method = 'get', body = {}) => {
  try {
    dev.throwErrorIfValueNotPassed(url, 'url');

    const response = await axios({
      method: method.toLowerCase(method),
      url,
      data: JSON.stringify(body),
    });
    const resData = response.data;

    return generalThis.constructResponse(
      true,
      response.code,
      `Successfully hit ${url}`,
      resData
    );
  } catch (err) {
    throw generalFuncs.constructResponse(
      false,
      err.response.status,
      err.message,
      err.response.data
    );
  }
};
/** Splits an array into chunks then perform an action on all those chunks, it will perform all the
 * @param  {function} action - The action/function to be repeated on the array chunks
 * @param  {object} array - The array to split and perform action on
 * @param  {integer} desiredLength - The length of each chunk // (Optional - Default is 1) //
 * @param  {object} parameters - The parameters object to be passed to the action every time // (Optional - Default is empty object {}) //
 * @param  {integer} sleepPeriodInMilliseconds - The time to wait between each action performance // (Optional - Default is 1000 milliseconds) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error, it will throw an exception with an object following the same format
 */
module.exports.performActionForSubArrays = async (
  action,
  array,
  desiredLength = 1,
  parameters = null,
  sleepPeriodInMilliseconds = 1000
) => {
  dev.throwErrorIfValueNotPassed(action, 'action');
  dev.throwErrorIfValueNotPassed(array, 'array');

  let responsesArray = [];
  let iteration = 0;
  let arrayLength = array.length;

  while (arrayLength > 0) {
    try {
      chunk = array.splice(0, desiredLength);

      if (parameters)
        responsesArray[iteration] = await action(chunk, parameters);
      else responsesArray[iteration] = await action(chunk);

      iteration += 1;

      arrayLength = arrayLength - desiredLength;
    } catch (error) {
      const errorObj = generalThis.constructResponse(
        false,
        error.code,
        `Failed performing action in interation ${iteration}`,
        error
      );
      throw errorObj;
    }

    await this.sleep(sleepPeriodInMilliseconds);
  }

  return generalThis.constructResponse(
    true,
    `Successfully performed action $${iteration} times`
  );
};

/** Check if the object passed is an array or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is array
 */
module.exports.isArray = async (object) => {
  return object.constructor === Array;
};

/** Check if the object passed is an empty array or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is an empty array
 */
module.exports.isEmptyArray = async (object) => {
  return object.constructor === Array && object.length === 0;
};

/** Check if the object passed is an empty string
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is an empty string
 */
module.exports.isEmptyString = async (object) => {
  return object === '';
};
