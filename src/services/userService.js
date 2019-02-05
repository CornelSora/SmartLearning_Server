import Boom from 'boom';
import User from '../models/user';
import firebase from '../firebase/firebase.js'
const database = firebase.database
const auth = firebase.auth
/**
 * Get all users.
 *
 * @return {Promise}
 */
export function getAllUsers() {
  var usersData = database.ref("users");
  var users = [];
  return new Promise((resolve, reject) => {
  usersData.once("value", (snapshot) => {
    var usersBD = snapshot.val();
    var usersIds = Object.keys(usersBD);
    for (var i = 0; i < usersIds.length; i++) {
      var currUser = usersBD[usersIds[i]];
      currUser.UID = usersIds[i];
      users.push(currUser);
    }
    resolve(users)
    })
  })
  
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
  var usersData = database.ref(`users/${id}`);
  return new Promise((resolve, reject) => {
    usersData.once("value", (snapshot) => {
      var user = {}
      user = snapshot.val()
      user ? user.id = snapshot.key : null
      resolve(user)
    })
  });
}

/**
 * Create new user.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function createUser(user) {
  console.log('creating...')
  return new Promise((resolve, reject) => {
    try {
      if (!user.username || !user.password) {
        reject()
      }
      auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(r => {
        console.log('here')
        if (!user.type) {
          user.type = "Student"
        }
        console.log(user)
        database.ref("users").push().set(user)
        resolve(user)
      })
      .catch(e => {
        reject(e)
      })
    } catch (e) {
      console.log(e)
    }
  })
}

/**
 * Update a user.
 *
 * @param  {Number|String}  id
 * @param  {Object}         user
 * @return {Promise}
 */
export function updateUser(id, user) {
  return new User({ id }).save({ name: user.name });
}

/**
 * Delete a user.
 *
 * @param  {Number|String}  id
 * @return {Promise}
 */
export function deleteUser(id) {
  return new User({ id }).fetch().then(user => user.destroy());
}
