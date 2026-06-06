import { Router } from 'express';
import {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from '../controller/document-controller.js';
import authenticateToken from '../../../middleware/auth.js';
import upload from '../../../middleware/multer.js';
import { InvariantError } from '../../../exceptions/index.js';

const router = Router();

// multer error → 400 with "File is required" for non-PDF
const handleUpload = (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      return next(new InvariantError('File is required'));
    }
    next();
  });
};

router.post('/documents', authenticateToken, handleUpload, uploadDocument);
router.get('/documents', getAllDocuments);
router.get('/documents/:id', getDocumentById);
router.delete('/documents/:id', authenticateToken, deleteDocument);

export default router;
