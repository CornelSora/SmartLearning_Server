import firebase from '../firebase/firebase.js';
import { hashCode } from 'hashcode';
import CryptoJS from 'crypto-js';
import * as userService from './userService';

const database = firebase.database;

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
  return new Promise(async (resolve, reject) => {
    try {
      invitationInfo.invitedByEmail = (await userService.getUserByFireabseUID(invitationInfo.invitedBy)).email;
      let invitationRef = database.ref(`invitations/${invitationInfo.emailHash}`);
      getFromFirebase(invitationRef)
        .then(client => {
          invitationInfo.isAccepted = false;
          if (client) {
            for (let i = 0; i < client['invitations'].length; i++) {
              if (
                client['invitations'][i].invitedBy == invitationInfo.invitedBy &&
                client['invitations'][i].problem == invitationInfo.problem
              ) {
                reject('Invitation for this user and the specified problem already sent');

                return;
              }
            }
            if (client['invitations'].indexOf(invitationInfo) > -1) {
              resolve('done');

              return;
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

// to do
export function getInvitations(email) {
  return new Promise((resolve, reject) => {
    try {
      const emailHash = hashCode().value(email);
      let invitationRef = database.ref(`invitations/${emailHash}`);
      getFromFirebase(invitationRef)
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
}

export function updateInvitation(invitationInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const emailHash = hashCode().value(invitationInfo.email);
      let invitationRef = database.ref(`invitations/${emailHash}`);
      let toUpdate = await getFromFirebase(invitationRef);
      console.log(toUpdate);
      toUpdate['invitations'] = invitationInfo.invitations;
      database.ref(`invitations/${emailHash}`).set(toUpdate);
      resolve('done');
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
