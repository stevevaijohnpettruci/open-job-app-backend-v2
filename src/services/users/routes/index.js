import { addNewUser, getUserById } from '../controller/user-controller.js';
import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import authenticateToken from '../../../middleware/auth.js';
import upload from '../../../middleware/multer.js';
import { UserPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/users', validate(UserPayloadSchema), addNewUser);
router.get('/users/:id', getUserById);
router.post('/users/:id/cv', authenticateToken, upload.single('cv'), uploadCV);
router.get('/users/:id/cv/:filename', authenticateToken, getCV);

export default router;
