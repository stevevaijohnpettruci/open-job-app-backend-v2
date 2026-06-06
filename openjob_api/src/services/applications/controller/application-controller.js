import ApplicationRepositories from '../repositories/application-repositories.js';
import UserRepositories from '../../users/repositories/user-repositories.js';
import JobRepositories from '../../jobs/repositories/job-repositories.js';
import CompanyRepositories from '../../companies/repositories/company-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import {
  getCached,
  setCached,
  invalidateCache,
  invalidateMultipleCache,
} from '../../../middleware/cache.js';
import { publishMessage } from '../../../utils/rabbitmq.js';

export const createApplication = async (req, res, next) => {
  const { user_id, job_id, status } = req.validated;

  const existingApplications =
    await ApplicationRepositories.getApplicationsByUserId(user_id);
  const isAlreadyApplied = existingApplications.some(
    (app) => app.job_id === job_id,
  );

  if (isAlreadyApplied) {
    return next(new InvariantError('Lamaran sudah pernah dikirimkan'));
  }

  const application = await ApplicationRepositories.createApplication({
    user_id,
    job_id,
    status,
  });

  if (!application) {
    return next(new InvariantError('Gagal menambahkan lamaran'));
  }

  // Publish notification to RabbitMQ (non-blocking)
  try {
    const [user, job] = await Promise.all([
      UserRepositories.getUserById(user_id),
      JobRepositories.getJobById(job_id),
    ]);

    if (user && job) {
      let companyName = '';
      try {
        const company = await CompanyRepositories.getCompanyById(
          job.company_id,
        );
        companyName = company ? company.name : '';
      } catch (_) {}

      await publishMessage({
        application_id: application.id,
      });
    }
  } catch (err) {
    console.error(
      '[Application] Failed to publish RabbitMQ message:',
      err.message,
    );
  }

  await invalidateMultipleCache([
    `applications:user:${user_id}`,
    `applications:job:${job_id}`,
  ]);
  
  return response(res, 201, 'Lamaran berhasil ditambahkan', {
    id: application.id,
    user_id,
    job_id,
    status: status || 'pending',
  });
};

export const getApplications = async (req, res, next) => {
  const applications = await ApplicationRepositories.getApplications();
  return response(res, 200, 'Daftar lamaran', { applications });
};

export const getApplicationById = async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `application:${id}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    res.setHeader('X-Data-Source', 'cache');
    return res.status(200).json(cached);
  }

  const application = await ApplicationRepositories.getApplicationById(id);
  if (!application) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  const responseBody = {
    code: 200,
    status: 'success',
    message: 'Detail lamaran',
    data: { ...application },
  };

  await setCached(cacheKey, responseBody);
  res.setHeader('X-Data-Source', 'database');
  return res.status(200).json(responseBody);
};

export const getApplicationsByUserId = async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `applications:user:${id}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    res.setHeader('X-Data-Source', 'cache');
    return res.status(200).json(cached);
  }

  const applications =
    await ApplicationRepositories.getApplicationsByUserId(id);
  const responseBody = {
    code: 200,
    status: 'success',
    message: 'Daftar lamaran berdasarkan user',
    data: { applications },
  };

  await setCached(cacheKey, responseBody);
  res.setHeader('X-Data-Source', 'database');
  return res.status(200).json(responseBody);
};

export const getApplicationsByJobId = async (req, res, next) => {
  const { id } = req.params;

  const cacheKey = `applications:job:${id}`;
  const cached = await getCached(cacheKey);
  if (cached) {
    res.setHeader('X-Data-Source', 'cache');
    return res.status(200).json(cached);
  }

  const applications = await ApplicationRepositories.getApplicationsByJobId(id);
  const responseBody = {
    code: 200,
    status: 'success',
    message: 'Daftar lamaran berdasarkan job',
    data: { applications },
  };

  await setCached(cacheKey, responseBody);
  res.setHeader('X-Data-Source', 'database');
  return res.status(200).json(responseBody);
};

export const updateApplication = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.validated;

  const application = await ApplicationRepositories.updateApplication(id, {
    status,
  });

  if (!application) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  await invalidateCache(`application:${id}`);

  return response(res, 200, 'Lamaran berhasil diperbarui', {
    id: application.id,
  });
};

export const deleteApplication = async (req, res, next) => {
  const { id } = req.params;
  const application = await ApplicationRepositories.deleteApplication(id);

  if (!application) {
    return next(new NotFoundError('Lamaran tidak ditemukan'));
  }

  await invalidateCache(`application:${id}`);

  return response(res, 200, 'Lamaran berhasil dihapus', { id: application.id });
};
