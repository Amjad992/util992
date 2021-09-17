const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');

/** Return a Jotform submission
 * @async
 * @param {string} submissionId - the submission Id to be retrieved
 * @param {string} apiKey - The api key // (Optional - configurable through the config.jotform object) //
 * @param {string} isHipaa - Is Hipaa Account or Not // (Optional - configurable through the config.jotform object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have the records array (Can be empty array [] if no records found and the request will still be success)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */
module.exports.submission = async (
  submissionId,
  apiKey = v.jotform.apiKey,
  isHipaa = v.jotform.isHipaa
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'jotform', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(isHipaa, 'jotform', 'isHipaa');

  dev.throwErrorIfValueNotPassed(submissionId, 'submissionId');

  try {
    const baseURL = isHipaa ? 'hipaa-api' : 'api';
    const url = `https://${baseURL}.jotform.com/submission/${submissionId}?apiKey=${apiKey}`;

    const response = await axios({
      method: 'get',
      url,
    });

    const resData = response.data;

    if (resData.responseCode < 300)
      return generalFuncs.constructResponse(
        true,
        resData.responseCode,
        `Retrieved submission ${submissionId} of Jotform form ${resData.content.form_id}`,
        resData.content
      );
    else throw resData;
  } catch (err) {
    throw dev.formatError(err);
  }
};
