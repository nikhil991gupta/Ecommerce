const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// connection.connect((err) => {
//   if (err) console.log(err);
//   else console.log("MySQL is connected...");
// }); 

// module.exports = connection;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database:"TestShop"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("MySQL is connected...!");
});
module.exports = connection;