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
          const responseProblem = new Problem(currProblem, false);
          problems.push(responseProblem);
        }
        let result = {};
        result.problems = problems;
        result.daily = getDailyProblem(problems);
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
  return new Promise((resolve, reject) => {
    try {
      if (!problemID || !userID) {
        reject('You must send problem id and user id');

        return;
      }

      let problemsData = database.ref(`problems/${problemID}`);
      problemsData.once('value', snapshot => {
        let problem = {};
        problem = snapshot.val();
        if (!problem) {
          reject(`No problems were found with the id: ${problemID}`);

          return;
        }
        problem ? (problem.id = snapshot.key) : null;
        let problemResponse = new Problem(problem);
        problemResponse.solution = problem.solutions ? problem.solutions[userID] : 'Enter your code here';
        resolve(problemResponse);
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
      const problemSolution = JSON.parse(`{"${userID}": "${solution}"}`);
      problemSolution.participants = problemSolution.participants ? problemSolution.participants + 1 : 1;
      database.ref(`problems/${problemID}/solutions`).update(problemSolution);
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
export function getSolution(userID, problemID, daily = false) {
  let problemsData = !daily ? database.ref(`problems/${problemID}`) : database.ref(`dailyProblems/${problemID}`);

  return new Promise((resolve, reject) => {
    try {
      problemsData.once('value', snapshot => {
        let problem = {};
        problem = snapshot.val();
        let returnSolution = { solution: '' };
        if (problem.solutions && problem.solutions[userID]) {
          returnSolution = problem.solutions[userID];
        } else {
          if (!problem.solutions) {
            problem.solutions = [];
          }
          problem.solutions[userID] = '';
        }
        if (daily) {
          returnSolution.participants = problem.participants;
        }
        resolve(returnSolution);
      });
    } catch (e) {
      reject(e);
    }
  });
}

let dailyProblems = {};
let generatedIndexes = [];

/**
 * GET random daily problem as recommendation
 * @return {Promise}
 */
export function getDailyProblem(problems) {
  const today = new Date()
    .toJSON()
    .slice(0, 10)
    .toString();

  if (dailyProblems[today]) {
    return dailyProblems[today];
  }
  let randomIndex = Math.floor(Math.random() * problems.length);
  while (generatedIndexes.indexOf(randomIndex) > -1 && generatedIndexes.length < problems.length) {
    randomIndex = Math.floor(Math.random() * problems.length);
  }
  if (generatedIndexes.length === problems.length) {
    generatedIndexes = [];
  }
  const randomProblemUID = problems[randomIndex].UID;
  dailyProblems[today] = randomProblemUID;
  let randomProblem = {};
  randomProblem.date = today;
  randomProblem.UID = randomProblemUID;
  try {
    database
      .ref(`dailyProblems/${randomProblemUID}`)
      .push()
      .set(randomProblem);
  } catch (e) {
  }

  return randomProblemUID;
}

// getAllProblems()
//       .then(problems => {
//         let randomIndex = Math.floor(Math.random() * problems.length);
//         while (generatedIndexes.indexOf(randomIndex) > -1 && generatedIndexes.length < problems.length) {
//           randomIndex = Math.floor(Math.random() * problems.length);
//         }
//         if (generatedIndexes.length == problems.length) {
//           generatedIndexes = [];
//         }
//         const randomProblemUID = problems[randomIndex].UID;
//         dailyProblems[today] = randomProblemUID;
//         let randomProblem = {};
//         randomProblem.date = today;
//         database
//           .ref(`dailyProblems/${randomProblemUID}`)
//           .set(randomProblem);
//         resolve(randomProblemUID);
//       })
//       .catch(err => {
//         console.log(err)
//         reject(err)
//       })

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
