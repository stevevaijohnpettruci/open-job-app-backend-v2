import { Router } from 'express';
import authenticateToken from '../../../middleware/auth.js';
import {
  createBookmark,
  getBookmarks,
  getBookmarkById,
  deleteBookmark,
} from '../controller/bookmark-controller.js';

const router = Router();

router.post('/jobs/:id/bookmark', authenticateToken, createBookmark);
router.get('/bookmarks', authenticateToken, getBookmarks);
router.get('/jobs/:id/bookmark/:bookmarkId', authenticateToken, getBookmarkById);
router.delete('/jobs/:id/bookmark', authenticateToken, deleteBookmark);

export default router;
