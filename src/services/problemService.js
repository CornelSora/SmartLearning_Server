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
          const responseProblem = new Problem(currProblem);
          problems.push(responseProblem);
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
        resolve(new Problem(problem));
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

/**
 * Save problem solution.
 *
 * @param  {Number}  problemID
 * @param  {Number}  userID
 * @param  {String}  solution
 * @return {Promise}
 */
export function saveProblemSolution(problemID, userID, solution) {
  return new Promise((resolve, reject) => {
    try {
      if (!problemID || !userID) {
        reject('Problem id and user id cannot be null');
      }
      //  const mySolution = new Solution(userID, problemID, solution);
      // ref
      // .orderBy('userID')
      // .equalTo(userID)
      // .on('child_added', function(snapshot) {
      //     console.log('found!!!')
      //     var problemSolutionBD = snapshot.val();
      //     if (!problemSolutionBD) {
      //       reject('No problems saved');
      //       return;
      //     }

      //     let problemIds = Object.keys(problemSolutionBD);
      //     for (let i = 0; i < problemIds.length; i++) {
      //       let currProblem = problemSolutionBD[problemIds[i]];
      //       console.log(currProblem)
      //     }
      // });

      // var query = ref("problemSolutions").orderByChild("solution").equalTo("test");
      // query.once("child_added", function(snapshot) {
      //   //  snapshot.ref.update({ displayName: "New trainer" })
      //   console.log('found it')
      // });
      const problemSolution = JSON.parse(`{"${userID}": "${solution}"}`);
      database.ref(`problems/${problemID}/solutions`).update(problemSolution);

      // database
      // .ref('problemSolutions')
      // .push()
      // .set(mySolution);
      //  resolve(problem);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @param  {Nmber}  userID
 * @param  {Nmber}  problemID
 * @return {Promise}
 */
export function getSolution(userID, problemID) {
  let problemsData = database.ref(`problems/${problemID}`);

  return new Promise((resolve, reject) => {
    try {
      problemsData.once('value', snapshot => {
        let problem = {};
        problem = snapshot.val();
        let returnSolution = { solution: problem.solutions[userID] };
        resolve(returnSolution);
      });
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
