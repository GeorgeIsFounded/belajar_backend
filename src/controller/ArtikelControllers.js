const { decode } = require('jsonwebtoken');
const { Op } = require('sequelize');
const ArtikelModel = require('../models').artikel;

async function listArtikel(req, res) {
  const {
    keyword,
    year,
    offset,
    tittle,
    page,
    pageSize,
    sortBy = 'id',
    orderBy = 'desc',
  } = req.query;

  const artikel = await ArtikelModel.findAndCountAll({
    // EXCLUDE (Jika ada yg ingin tidak di tampilkan)
    // attributes: {exclude: ['year']}

    // (Jika hanya menampilkan yang diinginkan)
    // attributes: [
    //   'id',
    //   'userId',
    //   ['tittle', 'judul'], // (Mengaliaskan [[blabla, blabla], ['blbabla, blabla]])
    //   ['year', 'tahun'],
    //   ['description', 'deskripsi'],
    // ],

    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },

    // where: {
    //   [Op.or]: [
    //     {
    //       tittle: {
    //         [Op.substring] : keyword
    //       }
    //     },
    //     {
    //       description: {
    //         [Op.substring] : keyword
    //       }
    //     }
    //   ],
    //   year: {
    //     [Op.gte] : year
    //   }
    // }

    order: [[sortBy, orderBy]],
    limit: pageSize,
    offset: offset,
  });

  try {
    res.status(201).json({
      status: 'Success',
      msg: 'Succesfuly founded',
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: artikel.count,
      },
      data: artikel,
      query: {
        page,
        pageSize,
      },
    });
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function createArtikel(req, res) {
  const payload = req.body;
  const { userId, tittle, year, description } = payload;
  await ArtikelModel.create({
    userId: req.id,
    tittle,
    year,
    description,
  });
  try {
    res.status(201).json({
      status: 'Success',
      msg: 'Succesfuly founded',
    });
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function updateArtikel(req, res) {
  const { id } = req.params;
  const payload = req.body;
  const { userId, tittle, year, description } = payload;
  const artikel = await ArtikelModel.findByPk(id);

  await ArtikelModel.update(
    {
      tittle,
      year,
      description,
    },
    {
      where: {
        id: id,
      },
    }
  );

  try {
    res.status(201).json({
      status: 'Success',
      msg: 'Succesfuly updated',
      id: id,
    });
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function createArtikelBulk(req, res) {
  const payload = req.body.payload;
  payload.map((item, index) => {
    item.userId = req.id;
  });

  await ArtikelModel.bulkCreate(payload);

  try {
    res.status(201).json({
      status: 'Success',
      msg: 'Succesfuly Created bulk artikel',
      payload: payload,
    });
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

// async function deleteArtikel(req, res) {
//   const { id } = req.params;
//   const artikel = await ArtikelModel.findByPk(id);

//   // if (artikel === null) {
//   //   res.status(404).json({
//   //     status: 'error 404',
//   //     msg: 'Articel Not Found',
//   //   });
//   // }

//   // if (artikel.userId !== req.id) {
//   //   return res.status(400).json({
//   //     status: 'Fail',
//   //     msg: 'Artikel yang anda hapus bukan milik anda',
//   //   });
//   // }

//   await ArtikelModel.destroy({
//     where: {
//       id: id,
//     },
//   });

//   try {
//     res.status(201).json({
//       status: 'Success',
//       msg: 'Succesfuly deleted',
//       id: id,
//     });
//   } catch {
//     res.status(403).json({
//       status: 'failure',
//       msg: 'Somthing went wrong',
//     });
//   }
// }

async function createArtikelMulti(req, res) {
  try {
    const { payload } = req.body;
    let success = 0;
    let Fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (item) => {
        try {
          await ArtikelModel.create({
            tittle: item.tittle,
            year: item.year,
            description: item.description,
            userId: req.id,
          });
          success = success + 1;
        } catch (err) {
          Fail = Fail + 1;
        }
      })
    );

    res.status(201).json({
      status: 'Success',
      msg: `Succesfully added ${success} from ${jumlah} and Fail ${Fail}`,
    });
  } catch (err) {
    res.status(403).json({
      status: 'Fail',
      msg: 'something went wrong',
    });
  }
}

async function deleteArtikelBulk(req, res) {
  const { payload } = req.body;
  let success = 0;
  let fail = 0;
  let jumlah = payload.length;
  await Promise.all(
    payload.map(async (items, index) => {
      try {
        const title = await ArtikelModel.findOne({
          where: { id: items.id },
        });
        if (title.userId !== req.id) {
          return (fail = fail + 1);
        }
        await ArtikelModel.destroy({
          where: { id: items.id },
        });
        console.log(items.id);
        console.log(title);
        success = success + 1;
      } catch (error) {
        console.log(error);
      }
    })
  );

  try {
    res.status(201).json({
      status: 'Success',
      msg: `Succesfuly deleted ${success} articles from ${jumlah} with ${fail} fail`,
    });
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

module.exports = {
  deleteArtikelBulk,
  createArtikel,
  listArtikel,
  updateArtikel,
  createArtikelBulk,
  createArtikelMulti,
};

//======================get list artikel================\\
// async function listArtikel(req, res) {
//   const artikel = await ArtikelModel.findAll({
//     where: {
//       userId: req.id,
//     },
//   });

//   try {
//     res.status(201).json({
//       status: 'Success',
//       msg: 'Succesfuly founded',
//       data: artikel,
//     });
//   } catch {
//     res.status(403).json({
//       status: 'failure',
//       msg: 'Somthing went wrong',
//     });
//   }
// }

// async function listArtikel(req, res) {
//   const { tittle, dari_tahun, sampai_tahun } = req.query;

//   const artikel = await ArtikelModel.findAll({
//     // EXCLUDE (Jika ada yg ingin tidak di tampilkan)
//     // attributes: {exclude: ['year']}

//     // (Jika hanya menampilkan yang diinginkan)
//     // attributes: [
//     //   'id',
//     //   'userId',
//     //   ['tittle', 'judul'], // (Mengaliaskan [[blabla, blabla], ['blbabla, blabla]])
//     //   ['year', 'tahun'],
//     //   ['description', 'deskripsi'],
//     // ],
//     attributes: {
//       exclude: ['createdAt', 'updatedAt'],
//     },
//     where: {
//       tittle: {
//         [Op.substring]: tittle
//       },
//       year: {
//         [Op.between]: [dari_tahun, sampai_tahun]
//       }
//     }
//   });

//   try {
//     res.status(201).json({
//       status: 'Success',
//       msg: 'Succesfuly founded',
//       data: artikel,
//       query: {
//         tittle,
//         dari_tahun,
//         sampai_tahun
//       }
//     });
//   } catch {
//     res.status(403).json({
//       status: 'failure',
//       msg: 'Somthing went wrong',
//     });
//   }
// }
