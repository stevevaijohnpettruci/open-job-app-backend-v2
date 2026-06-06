import { addNewUser, getUserById } from '../controller/user-controller.js';
import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import { UserPayloadSchema } from '../validator/schema.js';

const router = Router();

router.post('/users', validate(UserPayloadSchema), addNewUser);
router.get('/users/:id', getUserById);

export default router;
