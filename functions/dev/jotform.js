const axios = require('axios');

const generalFuncs = require('../general');
const generalDev = require('../dev');

const v = require(`../../values`);

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Filter submissions with specific flag value
 * @async
 * @param {object} submissionsArr - the array of submissions to filter
 * @param {string} value - the value to check the flag for
 * @param {string} flag - The flag to check
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the submission filtered (Can be empty array)
 ** In case of error (error of execution), it will throw an exception with an object following the same format.
 */
module.exports.filterSubmissionsByFlag = async (
  submissionsArr,
  value,
  flag
) => {
  try {
    const filteredSubmissions = [];
    for (let i in submissionsArr) {
      const submission = submissionsArr[i];

      if (submission[flag] === value) filteredSubmissions.push(submission);
    }
    return generalFuncs.constructResponse(
      true,
      200,
      `Filtered the submissions array to only get the ones with the value ${value} in ${flag} flag.`,
      filteredSubmissions
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Filter submissions with specific flag value
 * @async
 * @param {object} submissionsArr - the array of submissions to filter
 * @param {string} value - the value to check the flag for
 * @param {string} id - The id to check
 * @param {string} subId - The subId to check (Optional - when some answers would have the answer as an object e.g. address question )
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will have an array with the submission filtered (Can be empty array)
 ** In case of error (error of execution), it will throw an exception with an object following the same format.
 */
module.exports.filterSubmissionsByAnswer = async (
  submissionsArr,
  value,
  id,
  subId
) => {
  try {
    const filteredSubmissions = [];
    for (let i in submissionsArr) {
      const submission = submissionsArr[i];
      const answers = submission.answers;

      if (answers[id].answer[subId] === value || answers[id].answer === value)
        filteredSubmissions.push(submission);
    }

    return generalFuncs.constructResponse(
      true,
      200,
      `Filtered the submissions array to only get the ones with the value ${value} in the field ${id}${
        subId ? ` and sub field ${subId}` : ``
      }`,
      filteredSubmissions
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
/** Prepare query parameters for the submission to be attached to a post url 
 * @async
 * @param {object} fieldsObj - an object of all the fields to include in the submission
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will the query parameters string created
 ** In case of error (error of execution), it will throw an exception with an object following the same format.
 */
module.exports.prepareFieldsQueryParameters = (fieldsObj) => {
  try {
    let queryParameters = '';
    for (let id in fieldsObj) {
      let value = fieldsObj[id];

      if (generalFuncs.isObject(value)) {
        for (let subId in value) {
          let subValue = value[subId];
          if (subId.includes('_'))
            queryParameters += `submission[${id}][${subId}]=${subValue}&`;
          else queryParameters += `submission[${id}_${subId}]=${subValue}&`;
        }
      } else {
        queryParameters += `submission[${id}]=${value}&`;
      }
    }

    return generalFuncs.constructResponse(
      true,
      200,
      `generated query parameters successfully`,
      queryParameters
    );
  } catch (err) {
    throw generalDev.formatError(err);
  }
};

/** DO NOT USE THIS FUNCTION, IT'S FOR INTERNAL USE ONLY
 * @param {number} numberOfSubmissions - an object of all the fields to include in the submission
 * @param {number} numberOfSubmissions - an object of all the fields to include in the submission
 * @param {string} formId - The form id// (Optional - configurable through the config.jotform object) //
 * @param {string} apiKey - The api key // (Optional - configurable through the config.jotform object) //
 * @param {boolean} isHipaa - Is Hipaa Account or Not // (Optional - configurable through the config.jotform object) //
 * @returns - Return a response following this module's format (Created using func.constructResponse functionality)
 ** The body will the query parameters string created
 ** In case of error (error of execution), it will throw an exception with an object following the same format.
 */

module.exports.getSubmissions = async (
  numberOfSubmissions,
  offset,
  formId,
  apiKey,
  isHipaa
) => {
  try {
    const baseURL = isHipaa ? 'hipaa-api' : 'api';
    let url = `https://${baseURL}.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`;

    if (numberOfSubmissions) url += `&limit=${numberOfSubmissions}`;

    if (offset) {
      url += `&offset=${offset}`;
    }

    const response = await axios({
      method: 'get',
      url,
      headers: {
        APIKEY: apiKey,
      },
    });

    const resData = response.data;
    const offsetObj = resData.resultSet;
    newOffset =
      offsetObj.limit === offsetObj.count
        ? offsetObj.offset + offsetObj.count
        : null;

    const submissions = resData.content;
    return generalFuncs.constructResponse(
      true,
      response.code,
      `Retrieved ${submissions.length} records from form with id ${formId}`,
      submissions,
      {offset: newOffset}
    );
  } catch (err) {
    throw err;
  }
};
