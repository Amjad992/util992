const axios = require('axios');
const qs = require('qs');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');
const airtableGet = require('./get');

/** Remove all the records in a base from airtable
 * @async
 * @param {Array} tablesArray - An Array including the names of all the tables in the base
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have a JSON object with a key for each table, and each attribute value will be the response of deleting that table
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.base = async (
  tablesArray = v.airtable.tablesArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(
    tablesArray,
    'airtable',
    'tablesArray'
  );
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  try {
    let resCode;
    const baseIds = await airtableGet.baseRecoresIds(
      tablesArray,
      apiKey,
      baseURL,
      baseId
    );
    let base = {};
    for (table in tablesArray) {
      tableName = tablesArray[table];
      let tableRes;
      if (baseIds.body[tableName].length > 0)
        tableRes = await this.table(
          tableName,
          baseIds.body[tableName],
          apiKey,
          baseURL,
          baseId
        );
      else
        tableRes = generalFuncs.constructResponse(
          true,
          200,
          `Table ${tableName} was empty`
        );

      base[`${tableName}`] = tableRes;
      resCode = tableRes.code;
    }

    return generalFuncs.constructResponse(
      true,
      resCode,
      `Deleted ${tablesArray} tables records in airtable`,
      base
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Remove all the records in a table from airtable
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
module.exports.table = async (
  tableName,
  recordsIdsArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassed(tableName, 'tableName');
  dev.throwErrorIfValueNotPassed(recordsIdsArray, 'recordsIdsArray');

  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  try {
    let status;
    let responsesArray = [];

    await generalFuncs.performActionForSubArrays(
      async (chunk, {tableName, apiKey, baseURL, baseId}) => {
        const singleResponse = await this.nRecords(
          tableName,
          chunk,
          apiKey,
          baseURL,
          baseId
        );
        status = singleResponse.code;

        responsesArray.push(singleResponse);
      },
      recordsIdsArray,
      10,
      {tableName, apiKey, baseURL, baseId},
      v.airtable.waitBetweenRequestsInMilliSeconds
    );

    return generalFuncs.constructResponse(
      true,
      status,
      `Deleted all records of table ${tableName}`,
      responsesArray
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Remove a number of records from a table
 * @async
 * @param {string} tableName - The table name
 * @param {object} recordsIdsArray - an array of ids for fields that are supposed to be deleted
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the ids of the records deleted
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
      `Deleted ${recordsIdsArray.length} records from table ${tableName}`,
      records
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
