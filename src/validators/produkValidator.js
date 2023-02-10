const { check } = require('express-validator');
const ProdukModel = require('../models').produk;
const tambahProdukValidator = [
  check('namaProduk')
    .isLength({
      min: 1,
    })
    .withMessage('Name Product must be fielded'),
  check('brand')
    .isLength({
      min: 1,
    })
    .withMessage('Brand name must be fielded'),
];

module.exports = tambahProdukValidator;
