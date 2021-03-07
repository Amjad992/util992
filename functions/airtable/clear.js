const axios = require('axios');
const qs = require('qs');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');

/** Return a number of records from a table
 * @async
 * @param {string} tableName - The table name
 * @param {object} recordsIdsArray - an array of ids for fields that are supposed to be deleted
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.nRecords = async (
  tableName,
  recordsIdsArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  try {
    dev.throwErrorIfValueNotPassed(tableName, 'tableName');
    dev.throwErrorIfValueNotPassed(recordsIdsArray, 'recordsIdsArray');

    dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
    dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
    dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

    let url = `${baseURL}${baseId}/${tableName}?`;

    let recordsString = '';
    recordsIdsArray.forEach((id) => {
      recordsString += `&records[]=${id}`;
    });
    url += `${recordsString}`;
    console.log(url);
    const y = {
      method: 'delete',
      url,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const response = await axios(y);

    const resData = response.data;
    const records = resData.records;

    return generalFuncs.constructResponse(
      true,
      response.code,
      `Deleted ${recordsIdsArray.length} records from airtable`,
      records
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
