/**
 * User model.
 */
class User {
  constructor(email, username, type, uid) {
    if (!type) {
      this.type = 'Basic';
    } else {
      this.type = type;
    }
    this.email = email;
    this.username = username;
    this.uid = uid;
  }
}

export default User;
