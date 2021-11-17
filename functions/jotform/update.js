const axios = require('axios');

const v = require(`../../values`);
const generalDev = require('../dev');

const generalFuncs = require('../general');
const jotformDev = require('../dev/jotform');

axios.default.timeout = 3600000;

/** Return a Jotform submission
 * @async
 * @param {object} submissionFieldsObj - A JSON object that has all the fields to add, each field will be a key of the json, and if the field has sub fields, the value would be itself another JSON object (e.g. {4: {addr_line1: '7th avenue'}} OR {3: 'contact@amjadmajed.com})
 * @param {string} submissionId - The submission id to be updated
 * @param {string} apiKey - The api key // (Optional - configurable through the config.jotform object) //
 * @param {boolean} isHipaa - Is Hipaa Account or Not // (Optional - configurable through the config.jotform object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.submission = async (
  submissionFieldsObj,
  submissionId,
  apiKey = v.jotform.apiKey,
  isHipaa = v.jotform.isHipaa
) => {
  generalDev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'jotform', 'apiKey');
  generalDev.throwErrorIfValueNotPassedAndNotSet(isHipaa, 'jotform', 'isHipaa');

  generalDev.throwErrorIfValueNotPassed(
    submissionFieldsObj,
    'submissionFieldsObj'
  );
  generalDev.throwErrorIfValueNotPassed(submissionId, 'submissionId');

  try {
    const baseURL = isHipaa ? 'hipaa-api' : 'api';
    let url = `https://${baseURL}.jotform.com/submission/${submissionId}`;

    const fieldsQueryParameters =
      jotformDev.prepareFieldsQueryParameters(submissionFieldsObj);
    url = `${url}?${fieldsQueryParameters.body}`;

    url = generalDev.cleanURL(url);
    const response = await axios({
      method: 'post',
      url,
      headers: {
        APIKEY: apiKey,
      },
    });

    const resData = response.data;
    if (resData.responseCode < 300)
      return generalFuncs.constructResponse(
        true,
        resData.responseCode,
        `Updated submission ${submissionId} successfully`,
        {
          submissionId: resData.content.submissionID,
        }
      );
    else throw resData;
  } catch (err) {
    throw generalDev.formatError(err);
  }
};
