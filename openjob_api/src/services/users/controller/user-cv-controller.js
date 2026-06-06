import UserCVRepositories from '../repositories/user-cv-repositories.js';
import response from '../../../utils/response.js';
import path from 'path';

export const uploadCV = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const file = req.file;
    if (!file) {
      return next(new Error('File tidak ditemukan!'));
    }
    const result = await UserCVRepositories.addUserCV({ user_id, filename: file.filename });
    return response(res, 201, 'CV berhasil diupload', { filename: result.filename });
  } catch (err) {
    next(err);
  }
};

export const getCV = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const cv = await UserCVRepositories.getUserCVByFilename(filename);
    if (!cv) {
      return res.status(404).send('File tidak ditemukan');
    }
    return res.sendFile(path.resolve('uploads', filename));
  } catch (err) {
    next(err);
  }
};