import BookmarkRepositories from '../repositories/bookmark-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const createBookmark = async (req, res, next) => {
  const { id: job_id } = req.params;
  const { id: user_id } = req.user;

  const bookmark = await BookmarkRepositories.createBookmark({ user_id, job_id });

  if (!bookmark) {
    return next(new InvariantError('Gagal menambahkan bookmark'));
  }

  return response(res, 201, 'Bookmark berhasil ditambahkan', { id: bookmark.id });
};

export const getBookmarks = async (req, res, next) => {
  const { id: user_id } = req.user;
  const bookmarks = await BookmarkRepositories.getBookmarksByUserId(user_id);
  return response(res, 200, 'Daftar bookmark', { bookmarks });
};

export const getBookmarkById = async (req, res, next) => {
  const { bookmarkId } = req.params;
  const bookmark = await BookmarkRepositories.getBookmarkById(bookmarkId);

  if (!bookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  return response(res, 200, 'Detail bookmark', { ...bookmark });
};

export const deleteBookmark = async (req, res, next) => {
  const { id: job_id } = req.params;
  const { id: user_id } = req.user;

  const bookmark = await BookmarkRepositories.deleteBookmarkByJobId({ user_id, job_id });

  if (!bookmark) {
    return next(new NotFoundError('Bookmark tidak ditemukan'));
  }

  return response(res, 200, 'Bookmark berhasil dihapus', { id: bookmark.id });
};
