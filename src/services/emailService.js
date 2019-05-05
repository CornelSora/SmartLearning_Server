import { hashCode } from 'hashcode';
import CryptoJS from 'crypto-js';
const key = '1@!~abc';
// Decrypt
var ciphertext = 'U2FsdGVkX1%20t82dSTmNSHgQ00qECwo3mMlx0xad%2FEoTXCxdOeUjd21e0tHGzhCwh5scQB1fbuL3ZN8%20f8dkks1pQArLA%2FSyTXGBCQYS0WJY%3D'
var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
var plaintext = bytes.toString(CryptoJS.enc.Utf8);
console.log(plaintext);

// Require'ing module and setting default options

export function sendEmailTo(email) {
  return new Promise((resolve, reject) => {
    try {
      var objToken = {
        emailHash: hashCode().value(email),
        date: new Date()
      }
      const token = CryptoJS.AES.encrypt(JSON.stringify(objToken), key);
      objToken.token = token.toString();
      var bytes  = CryptoJS.AES.decrypt(token.toString(), key);
      var plaintext = bytes.toString(CryptoJS.enc.Utf8);
      console.log('decrypted')
      console.log(plaintext);

      let send = require('gmail-send')({
        // var send = require('../index.js')({
        user: 'codetestercrn@gmail.com',
        // user: credentials.user,                  // Your GMail account used to send emails
        pass: 'Test1234!',
        // pass: credentials.pass,                  // Application-specific password
        to: email,
        // to:   credentials.user,                  // Send to yourself
        // you also may set array of recipients:
        // [ 'user1@gmail.com', 'user2@gmail.com' ]
        // from:    credentials.user,            // from: by default equals to user
        // replyTo: credentials.user,            // replyTo: by default undefined
        // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
        subject: 'Your online test is ready',
        html: `<b>Hi,</b><br/>
                          Access this <b>link</b> to connect to your code: <br/><br/> 
                          Best regards,<br/>
                          Testing team<br/>` // Plain text
        // html:    '<b>html text</b>'            // HTML
      });
      send();
      resolve(objToken);
    } catch (e) {
      console.error(e)
      reject(e);
    }
  });
}
