const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');

/** Return a base with multiple tables from airtable
 * @async
 * @param {Array} tablesArray - An Array including the names of all the tables in the base
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.base = async (
  tablesArray = v.airtable.tablesArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  try {
    let resCode;
    dev.throwErrorIfValueNotPassedAndNotSet(
      tablesArray,
      'airtable',
      'tablesArray'
    );

    let base = {};
    for (table in tablesArray) {
      tableName = tablesArray[table];
      const tableRes = await this.table(
        tableName,
        undefined,
        apiKey,
        baseURL,
        baseId
      );
      base[`${tableName}`] = tableRes.body;
      resCode = tableRes.code;
    }

    return generalFuncs.constructResponse(
      true,
      resCode,
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
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.baseRecoresIds = async (
  tablesArray = v.airtable.tablesArray,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
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

/** Return a table records from airtable
 * @async
 * @param {string} tableName - The table name
 * @param {string} formula - The formula used to filter the records (This follows airtable format) // (Optional - Default undefined) //
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.table = async (
  tableName,
  formula = undefined,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  let iterationCounter = 1;

  try {
    let airtableResponse = await this.nRecords(
      tableName,
      undefined,
      undefined,
      formula,
      apiKey,
      baseURL,
      baseId
    );
    offset = airtableResponse.offset;

    while (offset) {
      ++iterationCounter;

      airtableSingleResponse = await this.nRecords(
        tableName,
        undefined,
        offset,
        formula,
        apiKey,
        baseURL,
        baseId
      );

      offset = airtableSingleResponse.offset;

      airtableResponse.body = [
        ...airtableResponse.body,
        ...airtableSingleResponse.body,
      ];
    }

    airtableResponse.message = `Retrieved ${airtableResponse.body.length} records from airtable`;
    return airtableResponse;
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Return a number of records from a table
 * @async
 * @param {string} table - The table name
 * @param {number} numberOfRecords = The number of records to be retrieved // (Optional - Default value is 100) //
 * @param {string} offset - The offset string provided by airtable response on the previous get records process // (Optional - Default undefined) //
 * @param {string} formula - The formula used to filter the records (This follows airtable format) // (Optional - Default undefined) //
 * @param {string} apiKey - The api key // (Optional - configurable through the config.airtable object) //
 * @param {string} baseURL - The base url // (Optional - Default is 'https://api.airtable.com/v0/' - configurable through the config.airtable object) //
 * @param {string} baseId - The base id // (Optional - configurable through the config.airtable object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.nRecords = async (
  table,
  numberOfRecords = 100,
  offset = undefined,
  formula = undefined,
  apiKey = v.airtable.apiKey,
  baseURL = v.airtable.baseURL,
  baseId = v.airtable.baseId
) => {
  try {
    dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'airtable', 'apiKey');
    dev.throwErrorIfValueNotSet('airtable', 'baseURL');
    dev.throwErrorIfValueNotPassedAndNotSet(baseId, 'airtable', 'baseId');

    dev.throwErrorIfValueNotPassed(table, 'table');

    let url = `${baseURL}${baseId}/${table}?`;
    if (formula) url += `&filterByFormula=${formula}`;

    if (offset) {
      url += `&offset=${offset}`;
    }

    const response = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: 'Bearer ' + apiKey,
      },
    });

    const resData = response.data;
    const records = resData.records;

    return generalFuncs.constructResponse(
      true,
      response.code,
      `Retrieved ${records.length} records from airtable`,
      records,
      {offset: resData.offset}
    );
  } catch (err) {
    throw dev.formatError(err);
  }
};
