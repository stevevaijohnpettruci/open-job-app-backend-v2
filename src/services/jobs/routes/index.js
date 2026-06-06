import { Router } from 'express';
import { validate } from '../../../middleware/validate.js';
import {
  CreateJobPayloadSchema,
  jobUpdatePayloadSchema,
} from '../validator/schema.js';
import authenticateToken from '../../../middleware/auth.js';
import {
  createJob,
  getJobs,
  getJobById,
  getJobByCompanyId,
  getJobByCategoryId,
  updateJob,
  deleteJob,
} from '../controller/job-controller.js';

const router = Router();

router.post(
  '/jobs',
  authenticateToken,
  validate(CreateJobPayloadSchema),
  createJob,
);
router.get('/jobs', getJobs);
router.get('/jobs/category/:id', getJobByCategoryId);
router.get('/jobs/company/:id', getJobByCompanyId);
router.get('/jobs/:id', getJobById);
router.put(
  '/jobs/:id',
  authenticateToken,
  validate(jobUpdatePayloadSchema),
  updateJob,
);
router.delete('/jobs/:id', authenticateToken, deleteJob);

export default router;
