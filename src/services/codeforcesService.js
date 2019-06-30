import firebase from '../firebase/firebase.js';
import Problem from '../models/problem';
// import Solution from '../models/solution.js';

const database = firebase.database;
/**
 * Get all problems.
 *
 * @return {Promise}
 */
export function getAllProblems() {
  let problemsData = database.ref('problems_test');
  let problems = [];

  return new Promise((resolve, reject) => {
    try {
      problemsData.once('value', snapshot => {
        let problemBD = snapshot.val();
        if (!problemBD) {
          reject('No problems saved');

          return;
        }
        let problemIds = Object.keys(problemBD);
        for (let i = 0; i < problemIds.length; i++) {
          let currProblem = problemBD[problemIds[i]];
          currProblem.UID = problemIds[i];
          problems.push(currProblem);
        }
        let result = {};
        result.problems = problems;
        resolve(result);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @param  {Number}  problemID
 * @param  {Number}  userID
 * @return {Promise}
 */
export function getProblem(problemID, userID) {
  return new Promise(async (resolve, reject) => {
    try {
      let problems = await getAllProblems();
      resolve(problems[problemID]);
    } catch (e) {
      reject(e);
    }
  });
}
