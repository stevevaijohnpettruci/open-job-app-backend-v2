/src/services/users/repositories/user-cv-repositories.js
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class UserCVRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addUserCV({ user_id, filename }) {
    const id = nanoid(16);
    const uploaded_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO user_cvs (id, user_id, filename, uploaded_at) VALUES ($1, $2, $3, $4) RETURNING id, filename',
      values: [id, user_id, filename, uploaded_at],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getUserCVByFilename(filename) {
    const query = {
      text: 'SELECT * FROM user_cvs WHERE filename = $1',
      values: [filename],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new UserCVRepositories();