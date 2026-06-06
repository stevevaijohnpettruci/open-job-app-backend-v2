import CompanyRepositories from '../repositories/company-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const addNewCompany = async (req, res, next) => {
  const { name, location, description } = req.validated;
  const company = await CompanyRepositories.createCompany({
    name,
    location,
    description,
  });

  if (!company) {
    return next(new InvariantError('Gagal menambahkan perusahaan.'));
  }

  return response(res, 201, 'Perusahaan berhasil ditambahkan', {
    id: company.id,
  });
};

export const getAllCompanies = async (req, res, next) => {
  const companies = await CompanyRepositories.getCompanies();

  return response(res, 200, 'Perusahaan berhasil ditampilkan', { companies });
};

export const getCompaniesById = async (req, res, next) => {
  const { id } = req.params;
  const company = await CompanyRepositories.getCompanyById(id);

  if (!company) {
    return next(new NotFoundError('Perusahaan tidak ditemukan.'));
  }

  return response(res, 200, 'Perusahaan berhasil ditampilkan', {
    id: company.id,
    name: company.name,
    location: company.location,
    description: company.description,
  });
};

export const editCompany = async (req, res, next) => {
  const { id } = req.params;
  const { name, location, description } = req.validated;

  const company = await CompanyRepositories.editCompany({
    id,
    name,
    location,
    description,
  });

  if (!company) {
    return next(new NotFoundError('Perusahaan tidak ditemukan'));
  }

  return response(res, 200, 'Perusahaan berhasil diedit', {
    id: company.id,
  });
};

export const removeCompany = async (req, res, next) => {
  const { id } = req.params;
  const company = await CompanyRepositories.deleteCompany(id);

  if (!company) {
    return next(new NotFoundError('Perusahaan tidak ditemukan.'));
  }

  return response(res, 200, 'Perusahaan berhasil dihapus', {
    id: company.id,
  });
};


