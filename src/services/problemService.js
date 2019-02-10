import firebase from '../firebase/firebase.js';
const database = firebase.database;

/**
 * Get all problems.
 *
 * @return {Promise}
 */
export function getAllProblems() {
  let problemsData = database.ref('problems');
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
        resolve(problems);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @param  {Nmber}  problemUID
 * @return {Promise}
 */
export function getProblem(id) {
  let problemsData = database.ref(`problems/${id}`);

  return new Promise((resolve, reject) => {
    try {
      problemsData.once('value', snapshot => {
        let problem = {};
        problem = snapshot.val();
        problem ? (problem.id = snapshot.key) : null;
        resolve(problem);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Create new problem.
 *
 * @param  {Object}  problem
 * @return {Promise}
 */
export function createProblem(problem) {
  return new Promise((resolve, reject) => {
    try {
      if (!problem['name']) {
        reject('It must contain the name');

        return;
      }
      if (!problem['content']) {
        reject('It must contain the content');

        return;
      }
      if (!problem['difficulty']) {
        reject('It must contain the difficulty');

        return;
      }
      if (!problem['addedBy']) {
        reject('It must contain the addedBy');

        return;
      }
      database
        .ref('problems')
        .push()
        .set(problem);
      resolve(problem);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Delete a problem.
 *
 * @param  {Object}  problemID
 * @return {Promise}
 */
export function deleteProblem(problemID) {
  return new Promise((resolve, reject) => {
    try {
      database.ref('problems/' + problemID).remove();
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

// /**
//  * Update a problem.
//  *
//  * @param  {Object}  problemID
//  * @return {Promise}
//  */
// export function updateProblem(problemID, problem) {
//   // return new Promise((resolve, reject) => {
//   //   try {
//   //     database.ref('problems/' + problemID).remove();
//   //     resolve();
//   //   } catch (e) {
//   //     reject(e);
//   //   }
//   // });
// }
