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

  const cacheKey = `user:${id}`;
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.setHeader('X-Data-Source', 'cache');
      return res.status(200).json(JSON.parse(cached));
    }
  } catch (_) {}

  const user = await UserRepositories.getUserById(id);
  if (!user) {
    return next(new NotFoundError('User tidak ditemukan.'));
  }

  const responseBody = {
    code: 200,
    status: 'success',
    message: 'User berhasil ditampilkan',
    data: { id: user.id, name: user.name },
  };

  try { await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseBody)); } catch (_) {}

  res.setHeader('X-Data-Source', 'database');
  return res.status(200).json(responseBody);
};
