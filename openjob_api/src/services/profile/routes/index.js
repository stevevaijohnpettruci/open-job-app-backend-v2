import { Router } from 'express';
import { getProfile, getProfileApplications, getProfileBookmarks } from '../controller/profile-controller.js';
import authenticateToken from '../../../middleware/auth.js';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/profile/applications', authenticateToken, getProfileApplications);
router.get('/profile/bookmarks', authenticateToken, getProfileBookmarks);

export default router;
