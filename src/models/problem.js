/**
 * User model.
 */
class Problem {
  constructor(problem) {
    if (problem.addedBy !== undefined) {
      this.addedBy = problem.addedBy;
    }
    if (problem.content !== undefined) {
      this.content = problem.content;
    }
    if (problem.difficulty !== undefined) {
      this.difficulty = problem.difficulty;
    }
    if (problem.UID !== undefined) {
      this.UID = problem.UID;
    }
    if (problem.name !== undefined) {
      this.name = problem.name;
    }
  }
}

export default Problem;
