const axios = require('axios');

const v = require(`../../values`);
const generalDev = require('../dev');

const generalThis = this;

axios.default.timeout = 3600000;

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
 * @param  {Object} body - The body to include, if the method is get, the body will be stringified before sending // (Optional - Default is empty object {}) //
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
  let url = `${v.g.hitInHouseEndpointBaseURL}/${endpoint}`;
  try {
    generalDev.throwErrorIfValueNotSet('g', 'hitInHouseEndpointBaseURL');
    const bodyToPass = method == 'get' ? JSON.stringify(body) : body;

    url = generalDev.cleanURL(url);
    const response = await axios({
      method: method.toLowerCase(method),
      url,
      data: bodyToPass,
    });

    if (response.status >= 200 && response.status < 300)
      return generalThis.constructResponse(
        true,
        response.status,
        `Successfully hit the endpoint /${endpoint}`,
        response.data
      );
    else {
      throw response;
    }
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

/** Function used to hit a url in an outside service with a simple non authenicated request, this can be used for webhooks with non-sensitive data
 * @async
 * @param  {String} url - The url to hit with the request
 * @param  {String} method - The method to be used (get, post, put, patch, delete)
 * @param  {Object} body - The body to include, if the method is get, the body will be stringified before sending // (Optional - Default is empty object {}) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.hitURL = async (url, method = 'get', body = {}) => {
  try {
    generalDev.throwErrorIfValueNotPassed(url, 'url');
    const bodyToPass = method == 'get' ? JSON.stringify(body) : body;
    url = generalDev.cleanURL(url);
    const response = await axios({
      method: method.toLowerCase(method),
      url,
      data: bodyToPass,
    });

    if (response.status >= 200 && response.status < 300)
      return generalThis.constructResponse(
        true,
        response.code,
        `Successfully hit ${url}`,
        response.data
      );
    else throw response;
  } catch (err) {
    throw generalDev.formatError(err);
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
  generalDev.throwErrorIfValueNotPassed(action, 'action');
  generalDev.throwErrorIfValueNotPassed(array, 'array');

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

/** Repeat an action repeatedly until either the successCheck function, which this function pass the response to, return true, or the numberOfTries passed is reached in case that was passed any value
 * @param  {function} action - The action/function to be performed until it succeed
 * @param  {function} checkFunction - The function that will receive the action response to decide if success or fail (Should be returning boolean, True if action succeeded, or False if action failed)
 * @param  {integer} attempts - The number of attempts to try the action before quitting, if number is not passed then it will keep trying the action until it's success, it won't stop without success  // (Optional - Default is null) //
 * @param  {object} parameters - The parameters object to be passed to the action every time // (Optional - Default is empty object {}) //
 * @param  {integer} sleepPeriodInMilliseconds - The time to wait between each action performance // (Optional - Default is 1000 milliseconds) //
 * @returns Return undefined if action started performing, or throws an error if no value passed
 ** In case of error, it will throw an exception with an object following the same format
 */
module.exports.performActionRepeatedly = async (
  action,
  checkFunction,
  attempts = null,
  parameters = null,
  sleepPeriodInMilliseconds = 1000
) => {
  generalDev.throwErrorIfValueNotPassed(action, 'action');
  generalDev.throwErrorIfValueNotPassed(checkFunction, 'checkFunction');

  try {
    return await repeatAction(
      action,
      checkFunction,
      attempts,
      parameters,
      sleepPeriodInMilliseconds,
      undefined
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

repeatAction = async (
  action,
  checkFunction,
  attempts = null,
  parameters = null,
  sleepPeriodInMilliseconds = 1000,
  lastResponse = null
) => {
  return new Promise(async (resolve, reject) => {
    if (attempts === 0) resolve(lastResponse);
    else {
      let actionResponse;
      if (parameters) actionResponse = await action(parameters);
      else actionResponse = await action();
      if (await checkFunction(actionResponse)) resolve(actionResponse);
      else {
        setTimeout(async () => {
          actionResponse = await repeatAction(
            action,
            checkFunction,
            attempts - 1,
            parameters,
            sleepPeriodInMilliseconds,
            actionResponse
          );
          resolve(actionResponse);
        }, sleepPeriodInMilliseconds);
      }
    }
  });
};

/** Check if the object passed is an array or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is array
 */
module.exports.isArray = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Array;
};

/** Check if the object passed is an object or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is an object
 */
module.exports.isObject = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Object;
};

/** Check if the object passed is a function or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is a function
 */
module.exports.isFunction = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Function;
};

/** Check if the object passed is a number or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is a number
 */
module.exports.isNumber = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Number;
};

/** Check if the object passed is a string or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is a string
 */
module.exports.isString = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === String;
};

/** Check if the object passed is a boolean or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is a boolean
 */
module.exports.isBoolean = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Boolean;
};

/** Check if the object passed is an empty array or not
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is an empty array
 */
module.exports.isEmptyArray = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Array && object.length === 0;
};

/** Check if the object passed is an empty string
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is an empty object
 */
module.exports.isEmptyObject = (object) => {
  if (object === null || object === undefined) return false;
  return object.constructor === Object && Object.keys(object).length === 0;
};

/** Check if the object passed is an empty string
 * @param  {object} object - The object to be checked
 * @returns - Return a true if the object is an empty string
 */
module.exports.isEmptyString = (object) => {
  if (object === null || object === undefined) return false;
  return object === '';
};

/** Generate a string with variable parts inside it
 * @param  {string} string - The base string to be returned after replacing the variables in it (e.g. 'My Name is {firstName} {lastName}' )
 * @param  {string[]} variables - An array of the variables names (e.g. ['firstName', 'lastName'])
 * @param  {string[]} values - An array of the values to replace (e.g. ['John', 'Doe'])
 * @returns - Return the base string after replacing all the values in their supposed place
 */
module.exports.generateString = (string, variables, values) => {
  variables.forEach((item, index) => {
    string = string.replace(`{${item}}`, values[index]);
  });
  return string;
};

/** Filter the elements of a nested JSON object or array that includes a specific value for an element
 * @param  {object} object - The nested JSON object or array to filter
 * @param  {string} key - The key to check its value
 * @param  {string|number|boolean|null|undefined} value - The value to filter upon
 * @returns - Return an array of JSON objects, each object has a key and element, key will include the key of the object filtered in case of Nested Object OR the index of the object filtered in case of Array of Objects, and the element will have the actual JSON object filtered
 */
module.exports.filterJSONElementsByKeyValue = async (object, key, value) => {
  const isArray = object instanceof Array;
  let returnedArr = [];
  let returnedObj = {};
  for (let i in object) {
    const element = object[i];

    if (element[key] === value)
      if (isArray) returnedArr.push(element);
      else returnedObj[i] = element;
  }

  if (isArray) return returnedArr;
  else return returnedObj;
};

/** Filter the elements of a nested JSON object or array by the values of a specific key inside each element
 * @param  {object} object - The nested JSON object or array to filter for unique values
 * @param  {string} key - The key to check its value
 * @returns - Return an array of JSON objects, each object has a key and element, key will include the key of the object filtered in case of Nested Object OR the index of the object filtered in case of Array of Objects, and the element will have the actual JSON object filtered
 */
module.exports.filterUniqueJSONElementsByKey = async (object, key) => {
  const isArray = object instanceof Array;
  let returnedArr = [];
  let returnedObj = {};

  let valuesArr = [];
  let indexesArr = [];
  for (let i in object) {
    const item = object[i];
    valuesArr.push([item[key], item]);
    if (!isArray) indexesArr.push([item[key], i]);
  }

  valuesArr = [...new Map(valuesArr).values()];
  if (isArray) {
    returnedArr = valuesArr;
    return returnedArr;
  } else {
    const tempObjArr = valuesArr;
    const tempIndexesArr = [...new Map(indexesArr).values()];

    for (let i = 0; i < tempObjArr.length; ++i) {
      returnedObj[tempIndexesArr[i]] = tempObjArr[i];
    }
  }

  if (isArray) return returnedArr;
  else return returnedObj;
};
