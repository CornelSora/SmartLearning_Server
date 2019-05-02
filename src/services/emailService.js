import { hashCode } from 'hashcode';

console.log('* [example 1.1] sending test email');

// Require'ing module and setting default options

export function sendEmailTo(email) {
  console.log(email);

  return new Promise((resolve, reject) => {
    try {
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
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
