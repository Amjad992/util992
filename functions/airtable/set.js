const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');

/** Return a base with multiple tables from airtable
 * @async
 * @param {string} tableName - The table name
 * @param {Array} recordsArray - An array of maximum 10 JSON elements that is following that specific airtable base fields nameing conventions, if column not needed then simply do not include it in the JSON object of that record
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the records created
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.records = async (
  tableName,
  recordsArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotSet('airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  dev.throwErrorIfValueNotPassed(tableName, 'tableName');
  dev.throwErrorIfValueNotPassed(recordsArray, 'recordsArray');

  try {
    let toCreateRecordsArray = [];
    for (i in recordsArray) {
      toCreateRecordsArray.push({
        fields: recordsArray[i],
      });
    }

    const url = `${baseURL}${baseId}/${tableName}`;
    const body = {
      records: toCreateRecordsArray,
    };

    const response = await axios({
      method: 'post',
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
      `Retrieved ${records.length} records from airtable`,
      records
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
