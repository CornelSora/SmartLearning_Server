import firebase from '../firebase/firebase.js';
const database = firebase.database;
const auth = firebase.auth;
/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers() {
  let usersData = database.ref('users');
  let users = [];

  return new Promise((resolve, reject) => {
    try {
      usersData.once('value', snapshot => {
        let usersBD = snapshot.val();
        let usersIds = Object.keys(usersBD);
        for (let i = 0; i < usersIds.length; i++) {
          let currUser = usersBD[usersIds[i]];
          currUser.UID = usersIds[i];
          users.push(currUser);
        }
        resolve(users);
      });
    } catch (e) {
      reject(e);
    }
  });

  // return new Promise((resolve, reject) => {
  //     usersData.once("value", (snapshot) => {
  //     var usersBD = snapshot.val();
  //     var usersIds = Object.keys(usersBD);
  //     for (var i = 0; i < usersIds.length; i++) {
  //       var currUser = usersBD[usersIds[i]];
  //       currUser.UID = usersIds[i];
  //       users.push(currUser);
  //     }
  //     resolve(users)
  //   })
  // });
  //  return User.fetchAll();
}

/**
 * Get a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function getUser(id) {
  let usersData = database.ref(`users/${id}`);

  return new Promise((resolve, reject) => {
    try {
      usersData.once('value', snapshot => {
        let user = {};
        user = snapshot.val();
        user ? (user.id = snapshot.key) : null;
        resolve(user);
      });
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function createUser(user) {
  return new Promise((resolve, reject) => {
    try {
      if (!user.username || !user.password) {
        reject();
      }
      auth
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(r => {
          if (!user.type) {
            user.type = 'Student';
          }
          user.uid = r.user.uid;
          database
            .ref('users')
            .push()
            .set(user);
          resolve(user);
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

// /**
//  * Update a user.
//  *
//  * @param  {Number|String}  id
//  * @param  {Object}         user
//  * @return {Promise}
//  */
// export function updateUser(id, user) {
//   return new User({ id }).save({ name: user.name });
// }

// /**
//  * Delete a user.
//  *
//  * @param  {Number|String}  id
//  * @return {Promise}
//  */
// export function deleteUser(id) {
//   return new User({ id }).fetch().then(user => user.destroy());
// }

/**
 * Login with email and password
 * @param  {String} email
 * @param  {String} password
 * @return {Promise}
 */
export function login(user) {
  return new Promise((resolve, reject) => {
    auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then(r => {
        resolve(r);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
