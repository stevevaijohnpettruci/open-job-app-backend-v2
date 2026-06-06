import DocumentRepositories from '../repositories/document-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import path from 'path';
import fs from 'fs';

export const uploadDocument = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new InvariantError('File is required'));
  }

  const user_id = req.user.id;
  const doc = await DocumentRepositories.addDocument({
    user_id,
    filename: file.filename,
    original_name: file.originalname,
    size: file.size,
  });

  return response(res, 201, 'Dokumen berhasil diupload', {
    documentId: doc.id,
    filename: doc.filename,
    originalName: doc.original_name,
    size: doc.size,
  });
};

export const getAllDocuments = async (req, res, next) => {
  const documents = await DocumentRepositories.getDocuments();
  return response(res, 200, 'Dokumen berhasil ditampilkan', { documents });
};

export const getDocumentById = async (req, res, next) => {
  const { id } = req.params;
  const doc = await DocumentRepositories.getDocumentById(id);
  if (!doc) {
    return next(new NotFoundError('Dokumen tidak ditemukan.'));
  }

  const filePath = path.resolve('src', 'uploads', doc.filename);
  if (!fs.existsSync(filePath)) {
    return next(new NotFoundError('File tidak ditemukan di server.'));
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${doc.original_name}"`);
  return res.sendFile(filePath);
};

export const deleteDocument = async (req, res, next) => {
  const { id } = req.params;
  const doc = await DocumentRepositories.deleteDocument(id);
  if (!doc) {
    return next(new NotFoundError('Dokumen tidak ditemukan.'));
  }

  const filePath = path.resolve('src', 'uploads', doc.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  return response(res, 200, 'Dokumen berhasil dihapus', { id: doc.id });
};
