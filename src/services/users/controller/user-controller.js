import UserRepositories from '../repositories/user-repositories.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';
import response from '../../../utils/response.js';
import redisClient from '../../../utils/redis.js';

export const addNewUser = async (req, res, next) => {
  const { name, email, password, role } = req.validated;
  
  const isEmailExist = await UserRepositories.verifyNewEmail(email);
  if (isEmailExist) {
    return next(
      new InvariantError('Gagal menambahkan user. Email sudah digunakan.'),
    );
  }

  const user = await UserRepositories.createUser({
    name,
    email,
    password,
    role,
  });

  if (!user) {
    return next(new InvariantError('Gagal menambahkan user.'));
  }

  return response(res, 201, 'User berhasil ditambahkan', { id: user.id });
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserRepositories.getUserById(id);
  if (!user) {
    return next(new NotFoundError('User tidak ditemukan.'));
  }

  return response(res, 200, 'User berhasil ditampilkan', { name: user.name });
};
