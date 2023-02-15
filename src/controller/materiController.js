const e = require('express');
const { decode } = require('jsonwebtoken');
const { Op } = require('sequelize');
const MateriModel = require('../models').materi;

async function createMateriMulti(req, res) {
  try {
    let { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;

    if (req.role === 'Guru') {
      await Promise.all(
        payload.map(async (item, index) => {
          try {
            await MateriModel.create({
              mapel: item.mapel,
              kelas: item.kelas,
              materi: item.materi,
              userId: req.id,
            });

            success = success + 1;
          } catch (err) {
            fail = fail + 1;
          }
        })
      );

      res.status(201).json({
        status: '201',
        msg: `Sukses menambahkan ${success} Materi dari total ${jumlah} Materi dan gagal ${fail} Materi`,
      });
    } else {
      res.status(403).json({
        status: 'error',
        msg: 'Anda tidak memiliki akses karena role anda adalah siswa',
      });
    }
  } catch (err) {
    res.status(403).json({
      status: 'error',
      msg: 'error creating',
    });
  }
}

async function updateMateri(req, res) {
  try {
    const payload = req.body;
    let { mapel, materi, kelas, id } = payload;
    const Materi = await MateriModel.findByPk(id);

    if (Materi === null) {
      return res.status(404).json({
        status: 404,
        msg: 'Materi not found',
      });
    }

    if (req.role === 'Guru') {
      if (req.id === Materi.userId) {
        await MateriModel.update(
          { mapel, materi, kelas },
          {
            where: {
              id: id,
            },
          }
        );
        res.json({
          status: '200 OK',
          msg: 'materi updated',
        });
      } else {
        res.status(403).json({
          status: 'error',
          msg: 'Anda tidak dapat update materi ini, karena materi ini ditulis oleh guru lain',
        });
      }
    } else {
      res.status(403).json({
        status: 'error',
        msg: 'Anda tidak dapat akses karena role anda adalah siswa',
      });
    }
  } catch (err) {
    res.status(403).json({
      status: 'failed',
      msg: 'Ada kesalahan update',
    });
  }
}

async function deleteMateri(req, res) {
  try {
    const { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    if (req.role === 'Guru') {
      await Promise.all(
        payload.map(async (items, index) => {
          try {
            const materi = await MateriModel.findOne({
              where: { id: items.id },
            });
            if (req.id === materi.userId) {
              await MateriModel.destroy({
                where: {
                  id: items.id,
                },
              });
              success = success + 1;
            } else {
              fail = fail + 1;
            }
          } catch (error) {
            console.log(error);
            fail = fail + 1;
          }
        })
      );
    } else {
      res.status(403).json({
        status: 'error',
        msg: 'Anda tidak dapat akses karena role anda adalah siswa',
      });
    }
    res.status(201).json({
      status: 'Success',
      msg: `Sukses menghapus ${success} materi dari ${jumlah} dengan ${fail} kesalahan`,
    });
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function listMateriGuru(req, res) {
  try {
    const {offset, kelas, page, pageSize } = req.query;
    if (req.role === 'Guru') {
      const materi = await MateriModel.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          userId: req.id,
        },
        limit: pageSize,
        offset: offset,
      });
      res.status(201).json({
        status: 'Success',
        msg: 'Succesfuly founded',
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalData: materi.count,
        },
        data: materi,
      });
    }
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

async function listMateriSiswa(req, res) {
  try {
    const { keyword, offset, page, pageSize } = req.query;
    if (req.role === 'Siswa') {
      const materi = await MateriModel.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          mapel: {
            [Op.substring]: keyword,
          },
        },
        limit: pageSize,
        offset: offset,
      });
      res.status(201).json({
        status: 'Success',
        msg: 'Succesfuly founded',
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalData: materi.count,
        },
        data: materi,
      });
    }
  } catch {
    res.status(403).json({
      status: 'failure',
      msg: 'Somthing went wrong',
    });
  }
}

module.exports = {
  createMateriMulti,
  updateMateri,
  deleteMateri,
  listMateriGuru,
  listMateriSiswa,
};
