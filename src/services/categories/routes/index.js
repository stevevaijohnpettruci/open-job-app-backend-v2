import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  editCategoryById,
  deleteCategory,
} from '../controller/category-controller.js';
import {
  CategoryPayloadSchema,
  UpdateCategoryPayloadSchema,
} from '../validator/schema.js';
import { validate } from '../../../middleware/validate.js';
import authenticateToken from '../../../middleware/auth.js';

const router = Router();

router.post(
  '/categories',
  authenticateToken,
  validate(CategoryPayloadSchema),
  createCategory,
);
router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.put(
  '/categories/:id',
  authenticateToken,
  validate(UpdateCategoryPayloadSchema),
  editCategoryById,
);
router.delete('/categories/:id', authenticateToken, deleteCategory);

export default router;
