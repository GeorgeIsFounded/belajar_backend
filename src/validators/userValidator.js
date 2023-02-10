const { check } = require('express-validator');
const UserModel = require('../models').user;

const createUserValidator = [
  check('nama')
    .isLength({
      min: 1,
    })
    .withMessage('Name must be fielded'),
  check('email')
    .isEmail()
    .withMessage('Use email formated')
    .custom((value) => {
      return UserModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
];

const updateUserValidator = [
  check('nama')
    .isLength({
      min: 1,
    })
    .withMessage('Name must be fielded'),
];

const updatePassword = [
  check("newPassword")
    .isLength({
      min: 8
    })
    .withMessage("Password Minimal 8 karakter")
]

module.exports = {createUserValidator, updatePassword};
