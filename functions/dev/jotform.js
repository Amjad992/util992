const generalFuncs = require('../general');
const generalDev = require('../dev');

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
