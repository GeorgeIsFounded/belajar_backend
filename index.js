const http = require('http');
const express = require('express');
const { smk, cekBilangan } = require('./example');
const dayjs = require('dayjs');
const app = express();
const routers = require('./src/routes/index.js');
const authMiddleware = require('./src/controllers/authmidleware');
const notFound = require("./src/controllers/404");
require('dotenv').config()
const bodyParser = require("body-parser");

app.use(express.json()); // == == == == Middleware agar dapat menangkap JSON pada body request di postman
// app.use(authMiddleware)
// app.use(console2middleware);
// app.use(console1middleware);
// app.use(bodyParser.json()); // == == == == Middleware agar dapat menangkap JSON pada body request di postman
app.use(express.static("storage/uploads"))
app.use(routers);
app.use(notFound);


const server = http.createServer((req, res) => {
  res.statusCode = 200;

  // MENAMPILKAN RESPONSE PADA WEB BROWSER localhost:8080 ===========>

  //   res.setHeader('Content-type', 'text/plain');
  //   res.write(dayjs().format('2023-01-10 13-30-30 '));
  //   res.write('Hello Madinatul Quran ');
  //   res.write(cekBilangan(1));


  // MENAMPILKAN RESPONSE DENGAN DATA JSON =================>

  res.setHeader('Content-type', 'text/json');
  // res.write(
  //     JSON.stringify({
  //         status: "success",
  //         message: "response success",
  //         data: {
  //             bilangan: cekBilangan(3),
  //             smk: smk,
  //             hari: dayjs().startOf('January'),
  //         }
  //     })
  // )

  // MENGGUNAKAN ROUTING ==================>
  // const url = req.url;

  // if (url === '/sekolah'){
  //     res.write(
  //         JSON.stringify({
  //             status: "success",
  //             message: "kita tiba di sekolah",
  //         })
  //     )
  // } else {
  //     res.write(
  //         JSON.stringify({
  //             status: "success",
  //             message: "kita masih di rumah",
  //         })
  //     )
  // }

  res.end();
});

const hostname = '127.0.0.1';
const port = 8088;

// contoh menggunakankan variabel
// terdapat 3 variabel pada listen yaitu port, hostname dan callbacknya
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// contoh tidak menggunakan variabel
//   server.listen(8081, "localhost", () => {
//     console.log('Server berjalan di http://localhost:8080')
//   })

//=============================================================================\\
//================================( EXPRESS JS )================================>>
//=============================================================================//

// app.get('/', authMiddleware, (req, res) => {
//   res.send('Hello World');
// });

// app.post('/pengguna', authMiddleware, (req, res) => {
//   res.send({
//     status: 'success',
//     message: 'George',
//   });
// });

// CONTOH QUERY

// app.get('/siswa/:george', (req, res) => {
//   console.log('params', req.params)
//   console.log('params', req.query)
//   res.send({
//     status: 'success',
//     message: `siswa atas nama ${req.params.george}, kelas ${req.query.kelas}, dan angkatan ke-${req.query.angkatan} ditemukan`,
//   });
// });

app.listen(port, () =>
  console.log(`Server berjalan di http://localhost:${port}`)
);
