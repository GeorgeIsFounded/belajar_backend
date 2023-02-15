const UserModel = require('../models').users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password, role } = payload;

    await UserModel.create({
      nama,
      email,
      password,
      role,
    });
    res.json({
      status: 'Success',
      msg: 'Register Berhasil',
    });
  } catch (err) {
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { email, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: 'Failure',
        msg: 'Email Tidak ditemukan, Silahkan Register',
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: 'Fail',
        msg: 'Email dan Password Tidak Cocok',
      });
    }

    const token = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
        role: user?.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      status: 'Success',
      msg: 'Login Berhasil',
      user: user,
      token: token,
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
    });
  }
}


module.exports = { register, login };
