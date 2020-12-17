// const request = require(`request`);

const axios = require('axios');
const v = require(`../values`);

const generalThis = this;

/**
 * Return a JSON object with a key and a message stating that the method endpoint is not supported
 * @param  {string} method - The HTTP method not supported (e.g. POST) // (Optional) //
 * @param  {string} key - The indicative property key (e.g. error) // (Optional) //
 * @param  {string} message - The indicative property message (e.g. Some error message) // (Optional) //
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
 * @param  {any} extraInfo - Any extra info to be included in the response, this can be used if request is successful however it doesn't have data and need to point that out (e.g. Although the request was successful, contact wasn't find, so it success would be true however extra info will say no contact found) // (Optional, default is null) //
 * @returns - A JSON object holding four values indicating the status of the process, as well as provide more information if needed
  **
 {
   success: true,
   code: 200,
   message: 'Successfully retrived contacts data',
   body: {
    data: []
   },
   extraInfo: 'No contact found with id 1'
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
  extraInfo = null
) => {
  let resObj = {
    success,
    code,
  };

  message ? (resObj.message = message) : null;
  body ? (resObj.body = body) : null;
  extraInfo ? (resObj.extraInfo = extraInfo) : null;

  return resObj;
};

/** Halt execution of the program for some time
 * @param  {Integer} milliseconds - Time in milliseconds to halt the execution
 * @returns - Returns nothing
 */
module.exports.sleep = async (milliseconds = 0) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

/** Function used to hit an endpoint in this service to activate some actions (e.g. update, start scheduler ... etc)
 --- Before using this function, you would need to configure the base url using the function config.hitInHouseEndponintBaseURL
 * @param  {String} endpoint - The endpoint to be hit (e.g. /sample) // (Optional) //
 * @param  {String} method - The method to be used (get, post, put, patch, delete) // (Optional) //
 * @param  {Object} body - The body to include // (Optional) //
 * @returns - Return a response following this module's format (response will be created using func.constructResponse functionality)
 ** In case of error, it will throw an exception with an object following the same format
 */
module.exports.hitInHouseEndponint = async (
  endpoint = '/',
  method = 'get',
  body = {}
) => {
  const url = `${v.g.hitInHouseEndponintBaseURL}/${endpoint}`;

  const baseURLNotSet = v.g.hitInHouseEndponintBaseURL === '';
  try {
    if (baseURLNotSet) {
      const errorObj = generalThis.constructResponse(
        false,
        400,
        'hitInHouseEndponintBaseURL property is not set yet, please use the config.hitInHouseEndponintBaseURL function to do that first.'
      );
      throw errorObj;
    }

    const response = await axios({
      method: method.toLowerCase(method),
      url,
      data: JSON.stringify(body),
    });
    const resData = response.data;

    if (!resData.success) {
      const errorObj = generalThis.constructResponse(
        false,
        resData.code,
        `Error returned on hitting endpoint ${endpoint}`,
        resData
      );
      throw errorObj;
    } else {
      const resObj = generalThis.constructResponse(
        true,
        resData.code,
        `Successfully hit the endpoint ${endpoint}`,
        resData
      );
      return resObj;
    }
  } catch (error) {
    throw error;
  }
};

/** Function used to hit a url in an outside service with a simple non authenicated request, this can be used for webhooks with non-sensitive data
 * @param  {String} url - The url to hit with the request
 * @param  {String} method - The method to be used (get, post, put, patch, delete)
 * @param  {Object} body - The body to include (Optional)
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.hitURL = async (url, method = 'get', body = {}) => {
  try {
    if (!url) {
      const errorObj = generalThis.constructResponse(
        false,
        400,
        'url parameter is not provided with the request'
      );
      throw errorObj;
    }

    const response = await axios({
      method: method.toLowerCase(method),
      url,
      data: JSON.stringify(body),
    });
    const resData = response.data;

    const resObj = generalThis.constructResponse(
      true,
      response.code,
      `Successfully hit ${url}`,
      resData
    );
    return resObj;
  } catch (error) {
    throw error;
  }
};
