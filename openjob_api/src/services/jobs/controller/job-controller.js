import JobRepositories from '../repositories/job-repositories.js';
import response from '../../../utils/response.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';

export const createJob = async (req, res, next) => {
  const userId = req.user?.id || req.userId || req.auth?.id; 

  const {
    title,
    description,
    job_type: jobType,
    experience_level: experienceLevel,
    location_type: locationType,
    location_city: locationCity,
    salary_min: salaryMin,
    salary_max: salaryMax,
    is_salary_visible: isSalaryVisible,
    status,
    company_id: companyId,
    category_id: categoryId,
  } = req.validated;

  const job = await JobRepositories.createJob({
    title,
    description,
    jobType,
    experienceLevel,
    locationType,
    locationCity,
    salaryMin,
    salaryMax,
    isSalaryVisible,
    status,
    companyId,
    categoryId,
    userId,
  });

  if (!job) {
    return next(new InvariantError('Gagal menambahkan lowongan kerja'));
  }

  return response(res, 201, 'Lowongan kerja berhasil ditambahkan', {
    id: job.id,
  });
};

export const getJobs = async (req, res, next) => {
  const { title } = req.query;
  const company_name = req.query['company-name'];
  const jobs = await JobRepositories.getJobs({
    title: title?.toLowerCase(),
    company_name: company_name?.toLowerCase(),
  });
  return response(res, 200, 'Daftar lowongan kerja', { jobs });
};

export const getJobById = async (req, res, next) => {
  const { id } = req.params;
  const job = await JobRepositories.getJobById(id);

  if (!job) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Detail lowongan kerja', { ...job });
};

export const getJobByCompanyId = async (req, res, next) => {
  const { id } = req.params;
  const jobs = await JobRepositories.getJobsByCompanyId(id);
  return response(res, 200, 'Daftar lowongan kerja', { jobs: jobs || [] });
};

export const getJobByCategoryId = async (req, res, next) => {
  const { id } = req.params;
  const jobs = await JobRepositories.getJobByCategoryId(id);
  return response(res, 200, 'Daftar lowongan kerja', { jobs: jobs || [] });
};

export const updateJob = async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    job_type: jobType,
    experience_level: experienceLevel,
    location_type: locationType,
    location_city: locationCity,
    salary_min: salaryMin,
    salary_max: salaryMax,
    is_salary_visible: isSalaryVisible,
    status,
    company_id: companyId,
    category_id: categoryId,
  } = req.validated;

  const job = await JobRepositories.updateJob(id, {
    title,
    description,
    jobType,
    experienceLevel,
    locationType,
    locationCity,
    salaryMin,
    salaryMax,
    isSalaryVisible,
    status,
    companyId,
    categoryId,
  });

  if (!job) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Lowongan kerja berhasil diedit', {
    id: job.id,
  });
};

export const deleteJob = async (req, res, next) => {
  const { id } = req.params;
  const job = await JobRepositories.deleteJob(id);

  if (!job) {
    return next(new NotFoundError('Lowongan kerja tidak ditemukan'));
  }

  return response(res, 200, 'Lowongan kerja berhasil dihapus', {
    id: job.id,
  });
};