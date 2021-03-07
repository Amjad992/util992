const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');

/** Updates records passed inside airtable
 * @async
 * @param {string} tableName - The table name
 * @param {Array} recordsArray - An array of maximum 10 JSON elements that is following that specific airtable base fields nameing conventions, if column not needed then simply do not include it in the JSON object of that record
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the records updated
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.records = async (
  tableName,
  recordsArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassed(tableName, 'tableName');
  dev.throwErrorIfValueNotPassed(recordsArray, 'recordsArray');

  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  try {
    let toUpdateRecordsArray = [];
    for (i in recordsArray) {
      toUpdateRecordsArray.push(recordsArray[i]);
    }

    const url = `${baseURL}${baseId}/${tableName}`;
    const body = {
      records: toUpdateRecordsArray,
    };

    const response = await axios({
      method: 'patch',
      url,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      data: body,
    });
    const resData = response.data;
    const records = resData.records;

    return generalFuncs.constructResponse(
      true,
      response.code,
      `Successfully updated ${records.length} records in airtable`,
      records
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
