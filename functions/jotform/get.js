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

/** Return all submission of a form
 * @async
 * @param {number} numberOfSubmissions - The number of submissions to retrieve// (Optional - Default value is the maximum limit in Jotform which is currently 1000) //
 * @param {string} offset - The offset of submissions required// (Optional - Default is 0) //
 * @param {string} formId - The form id// (Optional - configurable through the config.jotform object) //
 * @param {string} apiKey - The api key // (Optional - configurable through the config.jotform object) //
 * @param {boolean} isHipaa - Is Hipaa Account or Not // (Optional - configurable through the config.jotform object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** In case of error (error of execution e.g. no url provided, not url hit error response), it will throw an exception with an object following the same format, for the url hit error responses, they will be returned as success but full body will be in the body value
 */

module.exports.submissions = async (
  numberOfSubmissions = v.jotform.maximumLimitOfRetrievedSubmissions,
  offset = 0,
  formId = v.jotform.formId,
  apiKey = v.jotform.apiKey,
  isHipaa = v.jotform.isHipaa
) => {
  dev.throwErrorIfValueNotPassedAndNotSet(formId, 'jotform', 'formId');
  dev.throwErrorIfValueNotPassedAndNotSet(apiKey, 'jotform', 'apiKey');
  dev.throwErrorIfValueNotPassedAndNotSet(isHipaa, 'jotform', 'isHipaa');

  if (numberOfSubmissions === 0) {
    return generalFuncs.constructResponse(
      true,
      200,
      `numberOfSubmission passed is 0`,
      []
    );
  }

  try {
    let statusCode;
    let submissionsRetrievedArray = [];

    let singleResponse = await jotformDev.getSubmissions(
      numberOfSubmissions,
      offset,
      formId,
      apiKey,
      isHipaa
    );

    statusCode = singleResponse.code;

    submissionsRetrievedArray = singleResponse.body;
    offset = singleResponse.offset;

    if (await generalFuncs.isEmptyArray(submissionsRetrievedArray)) {
      return generalFuncs.constructResponse(
        true,
        200,
        `Form with id ${formId} has no submissions yet`,
        []
      );
    }

    while (offset && submissionsRetrievedArray.length < numberOfSubmissions) {
      singleResponse = await jotformDev.getSubmissions(
        numberOfSubmissions,
        offset,
        formId,
        apiKey,
        isHipaa
      );

      statusCode = singleResponse.code;

      submissionsRetrievedArray = [
        ...submissionsRetrievedArray,
        ...singleResponse.body,
      ];

      offset = singleResponse.offset;
    }

    if (submissionsRetrievedArray.length > numberOfSubmissions)
      submissionsRetrievedArray = submissionsRetrievedArray.slice(
        0,
        numberOfSubmissions
      );

    if (singleResponse.code < 300)
      return generalFuncs.constructResponse(
        true,
        statusCode,
        `Retrieved all submissions for form with id ${formId}`,
        submissionsRetrievedArray,
        {offset: singleResponse.offset}
      );
    else throw singleResponse;
  } catch (err) {
    throw dev.formatError(err);
  }
};

/** Return a Jotform submissions that have a specific value
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
    const allSubmissions = await this.submissions(
      undefined,
      undefined,
      formId,
      apiKey,
      isHipaa
    );

    const activeSubmissionsRes = await jotformDev.filterSubmissionsByFlag(
      allSubmissions.body,
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

    if (allSubmissions.code < 300)
      return generalFuncs.constructResponse(
        true,
        allSubmissions.code,
        `Retrieved submissions with value ${fieldValue} with field id ${fieldId} ${
          subFieldId ? ` and sub field id ${subFieldId}` : ``
        }`,
        filteredSubmissions
      );
    else throw err;
  } catch (err) {
    throw dev.formatError(err);
  }
};
