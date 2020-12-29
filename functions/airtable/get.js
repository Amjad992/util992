const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');

/** Return a number of records from a table
 * @async
 * @param {string} table - The table name
 * @param {number} numberOfRecords = The number of records to be retrieved // (Optional - Default value is 100) //
 * @param {string} offset - The offset string provided by airtable response on the previous get records process // (Optional - Default undefined) //
 * @param {string} formula - The formula used to filter the arrays (This follows airtable format) // (Optional - Default undefined) //
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
    console.log(url);

    const response = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: 'Bearer ' + apiKey,
      },
    });

    const resData = response.data;
    const records = resData.records;
    console.log(resData);
    return generalFuncs.constructResponse(
      true,
      response.code,
      `Retrieved ${records.length} records from airtable`,
      records,
      resData.offset
    );
  } catch (err) {
    if (dev.isAxiosResponse(err)) {
      throw generalFuncs.constructResponse(
        false,
        err.response.status,
        err.message,
        err.response.data
      );
    } else {
      // if not axios then it's thrown because of an error in the parameters not provided or set
      throw err;
    }
  }
};
