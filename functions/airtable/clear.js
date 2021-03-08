const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');
const airtableGet = require('./get');
const airtableDev = require('../dev/airtable');

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
module.exports.records = async (
  tableName,
  recordsIdsArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  dev.throwErrorIfValueNotPassed(tableName, 'tableName');

  if (await generalFuncs.isEmptyArray(recordsIdsArray)) {
    return generalFuncs.constructResponse(
      true,
      200,
      `recordsIdsArray is empty`,
      []
    );
  }

  dev.throwErrorIfValueNotPassed(recordsIdsArray, 'recordsIdsArray');

  try {
    let statusCode;
    let recordsDeletedArray = [];

    await generalFuncs.performActionForSubArrays(
      async (chunk, {tableName, apiKey, baseURL, baseId}) => {
        const singleResponse = await airtableDev.removeMax10Records(
          tableName,
          chunk,
          apiKey,
          baseURL,
          baseId
        );
        statusCode = singleResponse.code;

        recordsDeletedArray = [...recordsDeletedArray, ...singleResponse.body];
      },
      recordsIdsArray,
      10,
      {tableName, apiKey, baseURL, baseId},
      v.airtable.waitBetweenRequestsInMilliSeconds
    );

    return generalFuncs.constructResponse(
      true,
      statusCode,
      `Deleted ${recordsDeletedArray.length} records from table ${tableName}`,
      recordsDeletedArray
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Remove all the records in a table from airtable
 * @async
 * @param {string} tableName - The table name
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.table = async (
  tableName,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  dev.throwErrorIfValueNotPassed(tableName, 'tableName');

  try {
    let statusCode;
    let recordsDeletedArray = [];

    // Get all the records ids for that table
    tablesIdsRes = await airtableGet.baseRecoresIds(
      [tableName],
      apiKey,
      baseURL,
      baseId
    );
    let recordsIdsArray = tablesIdsRes.body[tableName];

    if (await generalFuncs.isEmptyArray(recordsIdsArray))
      return generalFuncs.constructResponse(
        true,
        200,
        `Table ${tableName} is empty`,
        []
      );

    await generalFuncs.performActionForSubArrays(
      async (chunk, {tableName, apiKey, baseURL, baseId}) => {
        const singleResponse = await this.records(
          tableName,
          chunk,
          apiKey,
          baseURL,
          baseId
        );

        statusCode = singleResponse.code;
        recordsDeletedArray = [...recordsDeletedArray, ...singleResponse.body];
      },
      recordsIdsArray,
      10,
      {tableName, apiKey, baseURL, baseId},
      v.airtable.waitBetweenRequestsInMilliSeconds
    );

    return generalFuncs.constructResponse(
      true,
      statusCode,
      `Deleted all ${recordsDeletedArray.length} records of table ${tableName}`,
      recordsDeletedArray
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

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
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  dev.throwErrorIfValueNotPassedAndNotSet(
    tablesArray,
    'airtable',
    'tablesArray'
  );

  try {
    let statusCode;

    let base = {};
    for (table in tablesArray) {
      tableName = tablesArray[table];

      let tableRes = await this.table(tableName, apiKey, baseURL, baseId);
      base[tableName] = tableRes;
      statusCode = tableRes.code;
    }

    return generalFuncs.constructResponse(
      true,
      statusCode,
      `Deleted ${tablesArray} tables records in airtable`,
      base
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
