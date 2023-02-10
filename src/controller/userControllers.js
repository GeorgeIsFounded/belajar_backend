const UserModel = require('../models').user;

async function getListUser(req, res) {
  try {
    const users = await UserModel.findAll();
    res.json({
      status: 'Succes',
      msg: 'Succesfuly founded',
      data: users,
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function createUser(req, res) {
  let payload = req.body;
  let { nama, email, tempatLahir, tanggalLahir } = payload;
  let user = await UserModel.create({
    nama: nama,
    email: email,
    isActive: true,
    tanggalLahir: tanggalLahir,
    tempatLahir: tempatLahir,
  });
  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly saved',
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function getDetailUserById(req, res) {
  const { id } = req.params;
  const user = await UserModel.findByPk(id);

  if (user === null) {
    res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly founded',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function getDetailUserByParams(req, res) {
  const { email } = req.params;

  const user = await UserModel.findOne({
    where: {
      email: email,
    },
  });

  if (user === null) {
    res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly founded',
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  const payload = req.body;
  let { nama, tempatLahir, tanggalLahir } = payload;
  const user = await UserModel.findByPk(id);

  if (user === null) {
    res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  await UserModel.update(
    {
      nama,
      tempatLahir,
      tanggalLahir,
    },
    {
      where: {
        id: id,
      },
    }
  );

  try {
    res.json({
      status: 'Success',
      msg: 'User Updated',
      id: id,
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await UserModel.findByPk(id);

  if (user === null) {
    return res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  await UserModel.destroy({
    where: {
      id: id,
    },
  });

  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly deleted',
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function updatePassword(req, res) {
  try {
    const payload = req.body;
    const { email, password, newPassword } = payload;
    const user = await UserModel.findOne({
      where: {
        email: req.email,
      },
    });

    const verify = await bcrypt.compareSync(password, user.password);

    if (user === null) {
      res.status(422).json({
        status: 'Failure',
        msg: 'email tidak ditemukan, silahkan register',
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: 'Failure',
        msg: 'email dan password tidak cocok',
      });
    }
    if (verify) {
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
    }
    res.json({
      status: 'Success',
      msg: 'Password Updated',
    });
  } catch (err) {
    res.status(403).json({
      status: 'Failure',
      msg: 'There s something wrong',
    });
  }
}

module.exports = {
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
  deleteUser,
  updatePassword,
};
