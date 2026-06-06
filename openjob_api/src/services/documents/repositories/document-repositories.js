import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class DocumentRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addDocument({ user_id, filename, original_name, size }) {
    const id = nanoid(16);
    const uploaded_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO documents (id, user_id, filename, original_name, size, uploaded_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, filename, original_name, size',
      values: [id, user_id, filename, original_name, size, uploaded_at],
    };
    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getDocuments() {
    const result = await this.pool.query('SELECT * FROM documents ORDER BY uploaded_at DESC');
    return result.rows;
  }

  async getDocumentById(id) {
    const query = { text: 'SELECT * FROM documents WHERE id = $1', values: [id] };
    const result = await this.pool.query(query);
    return result.rows[0] || null;
  }

  async deleteDocument(id) {
    const query = { text: 'DELETE FROM documents WHERE id = $1 RETURNING *', values: [id] };
    const result = await this.pool.query(query);
    return result.rows[0] || null;
  }
}

export default new DocumentRepositories();
