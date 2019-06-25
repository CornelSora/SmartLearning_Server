import firebase from '../firebase/firebase.js';
import { hashCode } from 'hashcode';
import CryptoJS from 'crypto-js';

const database = firebase.database;
const auth = firebase.auth;

export function getUserByFireabseUID(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let allUsers = await getAllUsers();
      for (let i = 0; i < allUsers.length; i++) {
        if (allUsers[i].uid === id) {
          resolve(allUsers[i]);
        }
      }
      resolve(null);
    } catch (e) {
      reject(e);
    }
  });
}

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
          try {
            let currUser = usersBD[usersIds[i]];
            currUser.key = usersIds[i];
            users.push(currUser);
          } catch (e) {
            // TO DO: ADD LOGGER
          }
        }
        resolve(users);
      });
    } catch (e) {
      reject(e);
    }
  });
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
            user.type = 'Basic';
          }
          user.password = null;
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

/**
 * Create new client.
 *
 * @param  {Object}  user
 * @return {Promise}
 */
export function addNewClient(reqBody) {
  return new Promise(async (resolve, reject) => {
    try {
      const userID = reqBody.userID;
      const clientInfo = reqBody.clientInfo;
      if (!userID || !clientInfo) {
        reject('User id and client info cannot be null');
      }
      const emailHash = hashCode().value(clientInfo.email);
      let client = {};
      client[emailHash] = clientInfo;
      //  const client = JSON.parse(`{"${emailHash}": "${JSON.stringify(clientInfo)}"}`);
      let user = await getUserByFireabseUID(userID);
      database.ref(`users/${user.key}/clients`).update(client);
      resolve('done');
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Get all clients.
 * @return {Promise}
 */
export function getClients(userID) {
  let clients = [];

  return new Promise(async (resolve, reject) => {
    let user = await getUserByFireabseUID(userID);
    let clientsData = database.ref(`users/${user.key}/clients`);
    try {
      clientsData.once('value', snapshot => {
        let usersBD = snapshot.val();
        if (!usersBD) {
          resolve(clients);

          return;
        }
        let usersIds = Object.keys(usersBD);
        for (let i = 0; i < usersIds.length; i++) {
          let currUser = usersBD[usersIds[i]];
          clients.push(currUser);
        }
        resolve(clients);
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

export function isTokenValid(token) {
  return new Promise((resolve, reject) => {
    try {
      let bytes = CryptoJS.AES.decrypt(token, '1@!~abc');
      let plainJSON = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      resolve(plainJSON.emailHash);
    } catch (e) {
      reject(e);
    }
  });
}

export function addInvitation(invitationInfo) {
  return new Promise((resolve, reject) => {
    try {
      let invitationRef = database.ref(`invitations/${invitationInfo.emailHash}`);
      getFromFirebase(invitationRef)
        .then(client => {
          invitationInfo.isAccepted = false;
          if (client) {
            if (client['invitations'].indexOf(invitationInfo) > -1) {
              resolve('done');
            }
            client['invitations'].push(invitationInfo);
          } else {
            client = {};
            let invitations = [];
            invitations.push(invitationInfo);
            client['invitations'] = invitations;
          }
          //  const client = JSON.parse(`{"${emailHash}": "${JSON.stringify(clientInfo)}"}`);
          database.ref(`invitations/${invitationInfo.emailHash}`).set(client);
          resolve('done');
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function getFromFirebase(databaseRef) {
  return new Promise((resolve, reject) => {
    try {
      databaseRef.once('value', snapshot => {
        let obj = {};
        obj = snapshot.val();
        resolve(obj);
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function updateUserPaymentID(userID, paymentID) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await this.getUserByFireabseUID(userID);
      user.paymentID = paymentID;
      let key = user.key;
      user.key = null;
      database.ref(`users/${key}`).set(user);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export function updateUserStatus(userID, paymentID) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await this.getUserByFireabseUID(userID);
      if (user.paymentID === paymentID) {
        user.type = 'premium';
      }
      let key = user.key;
      user.key = null;
      database.ref(`users/${key}`).set(user);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
