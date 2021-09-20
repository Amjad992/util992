const axios = require('axios');

const v = require(`../../values`);
const dev = require('../dev');

const generalFuncs = require('../general');
const jotformDev = require('../dev/jotform');

/** Return a Jotform submission
 * @async
 * @param {string} submissionId - the submission Id to be retrieved
 * @param {string} apiKey - The api key // (Optional - configurable through the config.jotform object) //
 * @param {boolean} isHipaa - Is Hipaa Account or Not // (Optional - configurable through the config.jotform object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
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
    const url = `https://${baseURL}.jotform.com/submission/${submissionId}`;

    const response = await axios({
      method: 'get',
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
        `Retrieved submission ${submissionId} of Jotform form ${resData.content.form_id}`,
        resData.content
      );
    else throw resData;
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Return a Jotform submission
 * @async
 * @param {string} fieldValue - the value needed to locate in submission (e.g. 7th avenue)
 * @param {number} fieldId - the id of the field needed to check (e.g. 5)
 * @param {string} subFieldId - the sub id of the field needed, (Optional - this is used in a field that contain other fields like address field for example (e.g. add_line1))
 * @param {string} formId - The form id// (Optional - configurable through the config.jotform object) //
 * @param {string} apiKey - The api key // (Optional - configurable through the config.jotform object) //
 * @param {boolean} isHipaa - Is Hipaa Account or Not // (Optional - configurable through the config.jotform object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */

module.exports.submissionsByFieldValue = async (
  fieldValue,
  fieldId,
  subFieldId = null,
  formId = v.jotform.formId,
  apiKey = v.jotform.apiKey,
  isHipaa = v.jotform.isHipaa
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(formId, 'jotform', 'formId');
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'jotform', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(isHipaa, 'jotform', 'isHipaa');

  dev.throwErrorIfValueNotPassed(fieldValue, 'fieldValue');
  dev.throwErrorIfValueNotPassed(fieldId, 'fieldId');

  try {
    const baseURL = isHipaa ? 'hipaa-api' : 'api';
    const url = `https://${baseURL}.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`;

    const response = await axios({
      method: 'get',
      url,
      headers: {
        APIKEY: apiKey,
      },
    });
    const resData = response.data;

    const activeSubmissionsRes = await jotformDev.filterSubmissionsByFlag(
      resData.content,
      v.jotform.submissionActiveStatusFlag,
      'status'
    );
    const activeSubmissions = activeSubmissionsRes.body;

    const filteredSubmissionsRes = await jotformDev.filterSubmissionsByAnswer(
      activeSubmissions,
      fieldValue,
      fieldId,
      subFieldId
    );
    const filteredSubmissions = filteredSubmissionsRes.body;

    if (resData.responseCode < 300)
      return generalFuncs.constructResponse(
        true,
        resData.responseCode,
        `Retrieved submissions with value ${fieldValue} in filed with id ${fieldId} ${
          subFieldId ? ` and sub field id ${subFieldId}` : ``
        }`,
        filteredSubmissions
      );
    else throw resData;
  } catch (err) {
    throw dev.formatError(err);
  }
};
