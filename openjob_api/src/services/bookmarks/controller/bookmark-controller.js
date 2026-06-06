import BookmarkRepositories from '../repositories/bookmark-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import { getCached, setCached, invalidateCache } from '../../../middleware/cache.js';

export const createBookmark = async (req, res, next) => {
  const { id: job_id } = req.params;
  const { id: user_id } = req.user;

  const bookmark = await BookmarkRepositories.createBookmark({ user_id, job_id });

  if (!bookmark) {
    return next(new InvariantError('Gagal menambahkan bookmark'));
  }

  await invalidateCache(`bookmarks:user:${user_id}`);

  return response(res, 201, 'Bookmark berhasil ditambahkan', { id: bookmark.id });
};

export const getBookmarks = async (req, res, next) => {
  const { id: user_id } = req.user;

  const cacheKey = `bookmarks:user:${user_id}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    res.setHeader('X-Data-Source', 'cache');
    return res.status(200).json(cached);
  }

  const bookmarks = await BookmarkRepositories.getBookmarksByUserId(user_id);
  const responseBody = {
    code: 200,
    status: 'success',
    message: 'Daftar bookmark',
    data: { bookmarks },
  };

  await setCached(cacheKey, responseBody);
  res.setHeader('X-Data-Source', 'database');
  return res.status(200).json(responseBody);
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

  await invalidateCache(`bookmarks:user:${user_id}`);

  return response(res, 200, 'Bookmark berhasil dihapus', { id: bookmark.id });
};
