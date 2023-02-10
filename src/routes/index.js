const express = require('express');
const routers = express.Router();
const uploadSingle = require('../storage/fileUploadSingle');
const uploadMulti = require('../storage/fileUploadMulti');
const {
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
  deleteUser,
  updatePassword,
} = require('../controller/userControllers');
const {
  getListProduk,
  tambahProduk,
  getDetailProdukById,
  getDetailProdukByParams,
  updateProduk,
  deleteProduk,
} = require('../controller/produkController');
const userValidator = require('../validators/userValidator');
const validationResultMiddleware = require('../middleware/validationResultMiddleware');
const createUserValidator = require('../validators/userValidator');
const tambahProdukValidator = require('../validators/produkValidator');
const { register, login, lupaPassword, resetPassword } = require('../controller/AuthControllers');
const {
  jwtValidateMiddleware,
} = require('../middleware/JwtValidateMiddleware');
const {
  createArtikel,
  listArtikel,
  updateArtikel,
  deleteArtikel,
  createArtikelBulk,
  createArtikelMulti,
  deleteArtikelBulk,
} = require('../controller/ArtikelControllers');

//auth
routers.post('/login', login);
routers.post('/register', register);
routers.post('/lupa-password', lupaPassword);
routers.post('/reset-password/:userId/:token', resetPassword);

// JWT MIDDLEWARE
routers.use(jwtValidateMiddleware);

//user
routers.get('/user/list', getListUser);
routers.post('/user/create', validationResultMiddleware, createUser);
routers.get('/user/detail/:id', getDetailUserById);
routers.get('/user/list/:email', getDetailUserByParams);
routers.delete('/user/delete/:id', deleteUser);
routers.put('/user/update/:id', updateUser, validationResultMiddleware);
routers.put('/password/update/:id', updatePassword);

//artikel
routers.post('/artikel/create', createArtikel);
routers.get('/artikel/list', listArtikel);
// routers.delete('/artikel/delete/:id', deleteArtikel);
routers.post('/artikel/create/bulk', createArtikelBulk);
routers.post('/artikel/create/multi', createArtikelMulti);
routers.delete('/artikel/delete/multi', deleteArtikelBulk);

//produk
routers.get('/produk/list', getListProduk);
routers.post(
  '/produk/tambah',
  tambahProdukValidator,
  validationResultMiddleware,
  tambahProduk
);
routers.get('/produk/detail/:id', getDetailProdukById);
routers.get('/produk/list/:namaProduk', getDetailProdukByParams);
routers.put('/produk/update/:id', updateProduk);
routers.delete('/produk/delete/:id', deleteProduk);

module.exports = routers;
