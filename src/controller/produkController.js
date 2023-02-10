const ProdukModel = require('../models').produk;

async function getListProduk(req, res) {
  try {
    const produk = await ProdukModel.findAll();
    res.json({
      status: 'Succes',
      msg: 'Succesfuly founded',
      data: produk,
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Something went wrong',
    });
  }
}

async function tambahProduk(req, res) {
  let payload = req.body;
  let { namaProduk, harga, deskripsi, brand, stok } = payload;
  let produk = await ProdukModel.create({
    namaProduk: namaProduk,
    brand: brand,
    harga: harga,
    isActive: true,
    deskripsi: deskripsi,
    stok: stok,
  });
  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly saved',
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Something went wrong',
    });
  }
}

async function getDetailProdukById(req, res) {
  const { id } = req.params;
  const produk = await ProdukModel.findByPk(id);

  if (produk === null) {
    res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly founded',
      data: produk,
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function getDetailProdukByParams(req, res) {
  const { namaProduk } = req.params;

  const produk = await ProdukModel.findOne({
    where: {
      namaProduk: namaProduk,
    },
  });

  if (produk === null) {
    res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  try {
    res.json({
      status: 'Succes',
      msg: 'Succesfuly founded',
      data: produk
    });
  } catch (err) {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}


async function updateProduk(req, res) {
  const { id } = req.params;
  const payload = req.body;
  let { namaProduk, stok, harga } = payload;
  const produk = await ProdukModel.findByPk(id);

  if (produk === null) {
    res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  await ProdukModel.update(
    {
      namaProduk,
      stok,
      harga,
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

async function deleteProduk(req, res) {
  const { id } = req.params;
  const produk = await ProdukModel.findByPk(id);

  if (produk === null) {
    return res.status(404).json({
      status: 'error 404',
      msg: 'Not Found',
    });
  }

  await ProdukModel.destroy({
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

module.exports = { getListProduk, tambahProduk, getDetailProdukById, getDetailProdukByParams, updateProduk, deleteProduk };
