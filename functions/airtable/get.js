const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');
const airtableDev = require('../dev/airtable');

/** Return a number of records from a table
 * @async
 * @param {string} table - The table name
 * @param {number} numberOfRecords = The number of records to be retrieved, if not passed it will return all records of a table
 * @param {string} offset - The offset string provided by airtable response on the previous get records process // (Optional - Default null) //
 * @param {string} formula - The formula used to filter the records (This follows airtable format) // (Optional - Default null) //
 * @param {string[]} fieldsToIncludeArr - An array with names of the fields to include // (Optional - Default [])
 * @param {string[]} sortFieldsArr - An array of JSON objects with each having field key, and direction key (e.g. [{field: 'Text', direction: 'desc'}]) // (Optional - Default [])
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.records = async (
  tableName,
  numberOfRecords,
  offset = null,
  formula = null,
  fieldsToIncludeArr = [],
  sortFieldsArr = [],
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  if (numberOfRecords === 0) {
    return generalFuncs.constructResponse(
      true,
      200,
      `numberOfRecords passed is 0`,
      []
    );
  }

  try {
    let statusCode;
    let recordsRetrievedArray = [];

    let singleResponse = await airtableDev.getRecords(
      tableName,
      numberOfRecords,
      offset,
      formula,
      fieldsToIncludeArr,
      sortFieldsArr,
      apiKey,
      baseURL,
      baseId
    );
    statusCode = singleResponse.code;

    recordsRetrievedArray = singleResponse.body;
    offset = singleResponse.offset;

    if (await generalFuncs.isEmptyArray(recordsRetrievedArray)) {
      return generalFuncs.constructResponse(
        true,
        200,
        `Table ${tableName} is empty`,
        []
      );
    }

    while (offset) {
      singleResponse = await airtableDev.getRecords(
        tableName,
        numberOfRecords,
        offset,
        formula,
        fieldsToIncludeArr,
        sortFieldsArr,
        apiKey,
        baseURL,
        baseId
      );
      statusCode = singleResponse.code;

      recordsRetrievedArray = [
        ...recordsRetrievedArray,
        ...singleResponse.body,
      ];

      offset = singleResponse.offset;
    }

    return generalFuncs.constructResponse(
      true,
      statusCode,
      `Retrieved ${recordsRetrievedArray.length} records from table ${tableName} in airtable`,
      recordsRetrievedArray,
      {offset: singleResponse.offset}
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Return a table records from airtable
 * @async
 * @param {string} tableName - The table name
 * @param {string} formula - The formula used to filter the records (This follows airtable format) // (Optional - Default null) //
 * @param {string[]} fieldsToIncludeArr - An array with names of the fields to include // (Optional - Default [])
 * @param {string[]} sortFieldsArr - An array of JSON objects with each having field key, and direction key (e.g. [{field: 'Text', direction: 'desc'}]) // (Optional - Default [])
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.table = async (
  tableName,
  formula = null,
  fieldsToIncludeArr = [],
  sortFieldsArr = [],
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(baseURL, 'airtable', 'baseURL');
  dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

  dev.throwErrorIfValueNotPassed(tableName, 'tableName');

  try {
    const recordsRes = await this.records(
      tableName,
      undefined,
      undefined,
      formula,
      fieldsToIncludeArr,
      sortFieldsArr,
      apiKey,
      baseURL,
      baseId
    );
    const records = recordsRes.body;

    return generalFuncs.constructResponse(
      true,
      recordsRes.code,
      `Retrieved all ${records.length} records from table ${tableName} in airtable`,
      records
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Get a base records from multiple tables in airtable
 * @async
 * @param {Array} tablesArray - An Array including the names of all the tables in the base
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have a JSON object with a key for each table, and each attribute value will be an array of its records (Can be empty array [] if no records found and the request will still be success)
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
      const tableRes = await this.table(
        tableName,
        null,
        undefined,
        apiKey,
        baseURL,
        baseId
      );
      base[`${tableName}`] = tableRes.body;
      statusCode = tableRes.code;
    }

    return generalFuncs.constructResponse(
      true,
      statusCode,
      `Retrieved ${tablesArray} tables records from airtable`,
      base
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Return a record ids of base with multiple tables from airtable
 * @async
 * @param {Array} tablesArray - An Array including the names of all the tables in the base
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have a JSON object with a key for each table, and each attribute value will be an array of its records id (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.baseRecoresIds = async (
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
    const baseRes = await this.base(tablesArray, apiKey, baseURL, baseId);

    let idsObj = {};
    for (i in tablesArray) {
      const tableName = tablesArray[i];
      const records = baseRes.body[tableName];
      idsObj[tableName] = [];

      for (j in records) {
        idsObj[tableName].push(records[j].id);
      }
    }

    return generalFuncs.constructResponse(
      true,
      undefined,
      `Retrieved ${tablesArray} tables records ids from airtable`,
      idsObj
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
