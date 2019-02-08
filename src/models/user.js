/**
 * User model.
 */
class User {
  constructor(email, username, type, uid) {
    if (!type) {
      this.type = 'Student';
    } else {
      this.type = type;
    }
    this.email = email;
    this.username = username;
    this.uid = uid;
  }
}

export default User;
