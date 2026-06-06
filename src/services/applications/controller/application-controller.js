import ApplicationRepositories from '../repositories/application-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const createApplication = async (req, res, next) => {
  const { user_id, job_id, status } = req.validated;

  const application = await ApplicationRepositories.createApplication({ user_id, job_id, status });

  if (!application) {
    return next(new InvariantError('Gagal menambahkan lamaran'));
  }

  return response(res, 201, 'Lamaran berhasil ditambahkan', { id: application.id });
};

export const getApplications = async (req, res, next) => {
  const applications = await ApplicationRepositories.getApplications();
  return response(res, 200, 'Daftar lamaran', { applications });
};

export const getApplicationById = async (req, res, next) => {
  const { id } = req.params;
  const application = await ApplicationRepositories.getApplicationById(id);

  if (!application) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  return response(res, 200, 'Detail lamaran', { ...application });
};

export const getApplicationsByUserId = async (req, res, next) => {
  const { id } = req.params;
  const applications = await ApplicationRepositories.getApplicationsByUserId(id);
  return response(res, 200, 'Daftar lamaran berdasarkan user', { applications });
};

export const getApplicationsByJobId = async (req, res, next) => {
  const { id } = req.params;
  const applications = await ApplicationRepositories.getApplicationsByJobId(id);
  return response(res, 200, 'Daftar lamaran berdasarkan job', { applications });
};

export const updateApplication = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.validated;

  const application = await ApplicationRepositories.updateApplication(id, { status });

  if (!application) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  return response(res, 200, 'Lamaran berhasil diperbarui', { id: application.id });
};

export const deleteApplication = async (req, res, next) => {
  const { id } = req.params;
  const application = await ApplicationRepositories.deleteApplication(id);

  if (!application) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  return response(res, 200, 'Lamaran berhasil dihapus', { id: application.id });
};
