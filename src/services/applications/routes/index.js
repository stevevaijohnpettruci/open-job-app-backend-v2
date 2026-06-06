import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import { CreateApplicationSchema, UpdateApplicationSchema } from '../validator/schema.js';
import authenticateToken from '../../../middleware/auth.js';
import {
  createApplication,
  getApplications,
  getApplicationById,
  getApplicationsByUserId,
  getApplicationsByJobId,
  updateApplication,
  deleteApplication,
} from '../controller/application-controller.js';

const router = Router();

router.post('/applications', authenticateToken, validate(CreateApplicationSchema), createApplication);
router.get('/applications', authenticateToken, getApplications);
router.get('/applications/user/:id', authenticateToken, getApplicationsByUserId);
router.get('/applications/job/:id', authenticateToken, getApplicationsByJobId);
router.get('/applications/:id', authenticateToken, getApplicationById);
router.put('/applications/:id', authenticateToken, validate(UpdateApplicationSchema), updateApplication);
router.delete('/applications/:id', authenticateToken, deleteApplication);

export default router;
