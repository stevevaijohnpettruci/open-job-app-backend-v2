import CategoryRepositories from '../repositories/category-repositories.js';
import { InvariantError, NotFoundError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const createCategory = async (req, res, next) => {
  const { name } = req.validated;
  const category = await CategoryRepositories.createCategory(name);

  if (!category) {
    return next(new InvariantError('Gagal menambahkan kategori.'));
  }

  return response(res, 201, 'Kategori berhasil ditambahkan', {
    id: category.id,
    name: category.name,
  });
};

export const getCategories = async (req, res, next) => {
  const categories = await CategoryRepositories.getCategories();

  return response(res, 200, 'Kategori berhasil ditampilkan', { categories });
};

export const getCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryRepositories.getCategoryById(id);

  if (!category) {
    return next(new NotFoundError('Kategori tidak ditemukan.'));
  }

  return response(res, 200, 'Kategori berhasil ditampilkan', {
    id: category.id,
    name: category.name,
  });
};

export const editCategoryById = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.validated;
  const category = await CategoryRepositories.editCategory({
    id,
    name,
  });

  if (!category) {
    return next(new NotFoundError('Kategori tidak ditemukan.'));
  }

  return response(res, 200, 'Kategori berhasil diedit', {
    id: category.id,
    name: category.name,
  });
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryRepositories.deleteCategory(id);

  if (!category) {
    return next(new NotFoundError('Kategori tidak ditemukan.'));
  }

  return response(res, 200, 'Kategori berhasil dihapus', {
    id: category.id,
  });
};