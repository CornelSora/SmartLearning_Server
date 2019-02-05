import * as firebase from 'firebase';
import * as serviceAccount from './serviceAccountKey.json'

// const firebase = admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://nodelearning-4b086.firebaseio.com"
// });
firebase.initializeApp(serviceAccount)
const database = firebase.database();
const auth = firebase.auth();

export default { database, auth }
