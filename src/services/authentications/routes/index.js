import { Router } from 'express';
import {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSchema,
} from '../validator/schema.js';
import { validate } from '../../../middleware/validate.js';
import authenticateToken from '../../../middleware/auth.js';
import {
  login,
  refreshToken,
  logout,
} from '../controller/authentication-controller.js';

const router = Router();

router.post(
  '/authentications',
  validate(postAuthenticationPayloadSchema),
  login,
);
router.put(
  '/authentications',
  validate(putAuthenticationPayloadSchema),
  refreshToken,
);

router.delete(
  '/authentications',
  authenticateToken,
  validate(deleteAuthenticationPayloadSchema),
  logout,
);

export default router;
