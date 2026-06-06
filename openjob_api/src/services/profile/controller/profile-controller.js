import UserRepositories from '../../users/repositories/user-repositories.js';
import ApplicationRepositories from '../../applications/repositories/application-repositories.js';
import BookmarkRepositories from '../../bookmarks/repositories/bookmark-repositories.js';
import { Pool } from 'pg';
import response from '../../../utils/response.js';
import { NotFoundError } from '../../../exceptions/index.js';

const pool = new Pool();

export const getProfile = async (req, res, next) => {
  const { id } = req.user;
  const user = await UserRepositories.getUserById(id);
  if (!user) {
    return next(new NotFoundError('User tidak ditemukan.'));
  }
  return response(res, 200, 'Profile berhasil ditampilkan', {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const getProfileApplications = async (req, res, next) => {
  const { id: user_id } = req.user;

  // Join applications with jobs and companies for richer data (15 keys)
  const result = await pool.query(`
    SELECT
      a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
      j.title AS job_title, j.description AS job_description,
      j.job_type, j.experience_level, j.location_type,
      j.location_city, j.company_id, j.category_id, j.status AS job_status
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.user_id = $1
  `, [user_id]);

  return response(res, 200, 'Daftar lamaran profile', { applications: result.rows });
};

export const getProfileBookmarks = async (req, res, next) => {
  const { id: user_id } = req.user;
  const bookmarks = await BookmarkRepositories.getBookmarksByUserId(user_id);
  return response(res, 200, 'Daftar bookmark profile', { bookmarks });
};
