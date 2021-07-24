const axios = require('axios');

const generalFuncs = require('../general');
const generalDev = require('../dev');

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Remove a maximum 10 of records from a table
 * @async
 * @param {string} tableName - The table name
 * @param {object} recordsIdsArray - An array of maximum 10 ids for fields that are supposed to be deleted
 * @param {string} apiKey - The api key
 * @param {string} baseURL - The base url
 * @param {string} baseId - The base id
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the ids of the records deleted
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.removeMax10Records = async (
  tableName,
  recordsIdsArray,
  apiKey,
  baseURL,
  baseId
) => {
  try {
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
    throw generalDev.formatError(err);
  }
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Updates a maximum 10 of records inside table
 * @async
 * @param {string} tableName - The table name
 * @param {Array} recordsArray - An array of maximum 10 JSON elements that is following that specific airtable base fields naming conventions, if column not needed then simply do not include it in the JSON object of that record, each element should have id and fields values *
 * @param {string} apiKey - The api key
 * @param {string} baseURL - The base url
 * @param {string} baseId - The base id
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the records updated
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.updateMax10Records = async (
  tableName,
  recordsArray,
  apiKey,
  baseURL,
  baseId
) => {
  try {
    const url = `${baseURL}${baseId}/${tableName}`;
    const body = {
      records: recordsArray,
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
      `Successfully updated ${records.length} records in table ${tableName}`,
      records
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Creates a maximum 10 of records inside table
 * @async
 * @param {string} tableName - The table name
 * @param {Array} recordsArray - An array of maximum 10 JSON elements that is following that specific airtable base fields naming conventions, if column not needed then simply do not include it in the JSON object of that record
 * @param {string} apiKey - The api key
 * @param {string} baseURL - The base url
 * @param {string} baseId - The base id
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the records created
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.createMax10Records = async (
  tableName,
  recordsArray,
  apiKey,
  baseURL,
  baseId
) => {
  try {
    const url = `${baseURL}${baseId}/${tableName}`;

    let formattedRecords = [];
    recordsArray.forEach((record) => {
      formattedRecords.push({
        fields: record,
      });
    });

    const body = {
      records: formattedRecords,
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
      `Successfully created ${records.length} records in table ${tableName}`,
      records
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Return a number of records from a table
 * @async
 * @param {string} table - The table name
 * @param {number} numberOfRecords = The number of records to be retrieved, if not passed it will return all records of a table
 * @param {string} offset - The offset string provided by airtable response on the previous get records process // (Optional - Default null) //
 * @param {string} formula - The formula used to filter the records (This follows airtable format) // (Optional - Default null) //
 * @param {string} fieldsToIncludeArr - The fields of array to include // (Optional - Default [])
 * @param {string} apiKey - The api key
 * @param {string} baseURL - The base url
 * @param {string} baseId - The base id
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.getRecords = async (
  tableName,
  numberOfRecords,
  offset,
  formula,
  fieldsToIncludeArr,
  apiKey,
  baseURL,
  baseId
) => {
  try {
    let url = `${baseURL}${baseId}/${tableName}?`;
    if (numberOfRecords) url += `&maxRecords=${numberOfRecords}`;

    if (formula) url += `&filterByFormula=${formula}`;

    if (offset) {
      url += `&offset=${offset}`;
    }
    if (fieldsToIncludeArr.length > 0) {
      fieldsToIncludeArr.forEach((f) => {
        url += `&fields[]=${f}`;
      });
    }

    const response = await axios({
      method: 'get',
      url,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const resData = response.data;
    const records = resData.records;

    return generalFuncs.constructResponse(
      true,
      response.code,
      `Retrieved ${records.length} records from table ${tableName} in airtable`,
      records,
      {offset: resData.offset}
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};
