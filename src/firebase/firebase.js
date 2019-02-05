import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import * as sak from './sak.json';
import * as serviceAccount from './serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(sak),
  databaseURL: "https://nodelearning-4b086.firebaseio.com"
});
firebase.initializeApp(serviceAccount)
const database = admin.database();
const auth = firebase.auth();

export default { database, auth }
