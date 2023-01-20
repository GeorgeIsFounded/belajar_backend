const express = require('express');
const routers = express.Router();
const uploadSingle = require('../storage/fileUploadSingle');
const uploadMulti = require('../storage/fileUploadMulti');

//=============== ROUTING DASAR =================

// routers.get('/user', (req, res) => {
//   res.send({
//     status: 'success',
//     message: 'Request dengan menggunakan method GET',
//   });
// });

// routers.put('/user', (req, res) => {
//   res.send({
//     status: 'success',
//     message: 'Request dengan menggunakan method PUT',
//   });
// });

// routers.post('/user', (req, res) => {
//   res.send({
//     status: 'success',
//     message: 'Request dengan menggunakan method POST',
//   });
// });

// routers.patch('/user', (req, res) => {
//   res.send({
//     status: 'success',
//     message: 'Request dengan menggunakan method PATCH',
//   });
// });

// routers.delete('/user', (req, res) => {
//   res.send({
//     status: 'success',
//     message: 'Request dengan menggunakan method DELETE',
//   });
// });

// routers.get('/siswa/:nama', (req, res) => {
//   // let nama = req.params.nama;
//   // let sekolah = req.params.sekolah;

//   let { nama } = req.params // == menggunakan params == \\
//   let {  kelas = 'xi', sekolah = 'mq' } = req.query // == menggunakan query == \\
//   res.send({
//     status: 'success',
//     message: `Siswa atas nama ${nama} kelas ${kelas} ditemukan di sekolah ${sekolah}`,
//   });
// });

// routers.get('/', (req, res) => {
//   res.sdend({
//     status: "success",
//     message: "Berhasil"
//   })
// })

routers.post('/upload/single', uploadSingle, (req, res) => {
  res.send({
    status: 'success',
    msg: 'Uploaded',
    file: req.file,
    fileUrl: `${req.protocol}://${req.get('host')}/${req.file.filename}`,
  });
});

routers.post('/upload/multi', uploadMulti, (req, res) => {
  res.send({
    status: 'success',
    msg: 'Uploaded',
    file: req.file,
  });
});

routers.post('/user/create', (req, res) => {
  const payload = req.body;
  const { kelas, nama } = req.body;

  res.send({
    status: 'Success',
    message: 'Latihan Request body',
    nama: nama,
    kelas: kelas,
  });
});

// routers.get('/absensi/:nama', (req, res) => {
//   // let nama = req.params.nama;
//   // let sekolah = req.params.sekolah;

//   let { nama } = req.params // == menggunakan params == \\
//   let { dari_tanggal = '2023-01-02', sampai_tanggal = '2023-01-15', status = 'hadir' } = req.query // == menggunakan query == \\
//   res.send({
//     status: 'success',
//     data: {
//       nama : nama,
//       status : status,
//       dari_tanggal : dari_tanggal,
//       sampai_tanggal : sampai_tanggal
//     }
//   });
// });

routers.get('/:nama', (req, res) => {
  // let nama = req.params.nama;
  // let sekolah = req.params.sekolah;

  let { nama } = req.params;
  console.log(req.body);
  let {
    payload: { id },
  } = req.body;
  let {
    payload: { data },
  } = req.body;

  res.send({
    status: 'success',
    msg: 'Berhasil Perbaharui',
    data: {
      nama: nama,
      id: id,
      data: {
        ujian_ke_3: data[2].ujian,
        ujian_ke_3: data[2].mapel,
        ujian_ke_3: data[2].nilai
      }
    },
  });
});

module.exports = routers;
