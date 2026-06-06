import { Router } from 'express';
import {
  addNewCompany,
  getAllCompanies,
  getCompaniesById,
  editCompany,
  removeCompany,
} from '../controller/company-controller.js';
import { validate } from '../../../middleware/validate.js';
import {
  CompanyPayloadSchema,
  UpdateCompanyPayloadSchema,
} from '../validator/schema.js';
import authenticateToken from '../../../middleware/auth.js';

const router = Router();

router.post(
  '/companies',
  authenticateToken,
  validate(CompanyPayloadSchema),
  addNewCompany,
);
router.get('/companies', getAllCompanies);
router.get('/companies/:id', getCompaniesById);
router.put(
  '/companies/:id',
  authenticateToken,
  validate(UpdateCompanyPayloadSchema),
  editCompany,
);
router.delete('/companies/:id', authenticateToken, removeCompany);

export default router;  
