const UserModel = require('../models').user;
const ForgotPasswordModel = require('../models').password;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmailHandle = require('../mail');
const crypto = require('crypto');
const dayjs = require('dayjs');
require('dotenv').config();

async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      email,
      password: hashPassword,
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
        status: 'Fail',
        msg: 'Email Tidak ditemukan, Silahkan Register',
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: 'Fail',
        msg: 'Email dan Password Tidak Cocok',
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
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
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      status: 'Success',
      msg: 'Login Berhasil',
      token: token,
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
    });
  }
}

async function updatePassword(req, res) {
  try {
    const payload = req.body;
    const { email, oldPassword, newPassword } = payload;
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: 'Fail',
        msg: 'Email Tidak ditemukan, Silahkan Register',
      });
    }

    const verify = await bcrypt.compareSync(oldPassword, user.password);
    if (verify === false) {
      return res.status(422).json({
        status: 'Fail',
        msg: 'Passwod saat ini tidak valid dengan password sebelumnya',
      });
    }

    let hashPassword = await bcrypt.hashSync(newPassword, 10);

    await UserModel.update(
      {
        password: hashPassword,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    res.json({
      status: 'Success',
      msg: 'Update Password Berhasil',
    });
  } catch (err) {
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
    });
  }
}

async function lupaPassword(req, res) {
  // let date = new Date()
  // // date.setHours(date.getHours() )
  // // date.setHours(date.getHours() + 1)
  // let date1 = dayjs(date);
  // let date2 = dayjs("2023-02-01 06:30:00");

  // let difference = date2.diff(date1, 'hour');
  // console.log(difference + " hours");

  try {
    const { email } = req.body;

    //cek apakah user dengan email tsb terdaftar
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    //jika tidak terdaftar berikan response dengan msg email tidak terdaftar
    if (user === null) {
      return res.status(422).json({
        status: 'Fail',
        msg: 'Email Tidak ditemukan, Silahkan gunakan email yang terdaftar',
      });
    }

    // cek apakah token sudah pernah dibuat pada user tsb di table forgot password
    const currenToken = await ForgotPasswordModel.findOne({
      where: {
        userId: user.id,
      },
    });

    // jika ada , hapus token laama
    if (currenToken !== null) {
      await ForgotPasswordModel.destroy({
        where: {
          userId: user.id,
        },
      });
    }

    // jika belum buat token
    const token = crypto.randomBytes(32).toString('hex'); //membuat token dengan string random
    const date = new Date();
    const expire = date.setHours(date.getHours() + 1);

    await ForgotPasswordModel.create({
      userId: user.id,
      token: token,
      expireDate: dayjs(expire).format('YYYY-MM-DD hh:mm:ss'),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`,
    };

    const sendEmail = await sendEmailHandle(
      email,
      'lupa password',
      'lupaPassword',
      context
    );

    if (sendEmail === 'Success') {
      res.json({
        status: 'Success',
        msg: 'Silahkan cek email',
      });
    } else {
      res.status(400).json({
        status: 'Fail',
        msg: 'Gunakan Email yang terdaftar',
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
      err,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { userId, token } = req.params;
    let { newPassword } = req.body;
    const user = await ForgotPasswordModel.findOne({
      where: {
        userId: userId,
        token: token,
      },
    });

    if (user === null) {
      return res.status(403).json({
        status: 'Fail',
        msg: 'Unvalid token',
      });
    }

    let userExpired = user.expiredDate;
    let expire = dayjs(Date());
    let difference = expire.diff(userExpired, 'hour');
    if (difference !== 0) {
      res.json({
        status: 'Fail',
        msg: 'Token has expired',
      });
    }

    let hashPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.update(
      { password: hashPassword },
      {
        where: {
          id: user.id,
        },
      }
    );
    await ForgotPasswordModel.destroy({ where: { token: token } });
    res.json({
      status: '200 OK',
      msg: 'password updated',
    });

    return res.json({
      status: 'Success',
      msg: 'berhasil reset password',
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: 'Fail',
      msg: 'Ada Kesalahan',
    });
  }
}

module.exports = {
  register,
  login,
  updatePassword,
  lupaPassword,
  resetPassword,
};
