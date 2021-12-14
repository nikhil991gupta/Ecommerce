const {
  loginValidation,
  registerValidation,
} = require("../middleware/validation");
const db = require("../database/db");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

exports.loginUser = async (params) => {
  const { error } = loginValidation(params);
  if (error) throw { message: error.details[0].message, statusCode: 400 };

  const { email, password } = params;
  const hashedPassword = md5(password.toString());

  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, hashedPassword],
      (err, result) => {
        console.log("Login check",result);
        if (err) {
          reject({
            data: err,
            message: "Something went wrong, please try again",
            statusCode: 400,
          });
        }

        if (result.length === 0) {
          reject({
            message: "Wrong credentials, please try again",
            statusCode: 400,
          });
        }

        if (result.length > 0) {
          const token = jwt.sign({ data: result }, "secret");
          resolve({
            message: "Logged in successfully",
            data: result,
            token,
          });
        }
      }
    );
  });
};

exports.registerUser = async (params) => {
  console.log("params register user Checkig params",params);
  const { error } = registerValidation(params);
  if (error) throw { message: error.details[0].message, statusCode: 400 };

  const { fullName, email, password,user_id } = params;
  const hashedPassword = md5(password.toString());
  console.log("params register user",params);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT email FROM users WHERE email = ?`,
      [email],
      (err, result) => {
        if (result.length > 0) {
          reject({
            message: "Email address is in use, please try a different one",
            statusCode: 400,
          });
        } else if (result.length === 0) {
          console.log("ELIF");
          db.query(
            `INSERT INTO users (full_name, email, password,user_id) VALUES (?,?,?,?)`,
            [fullName, email,hashedPassword,user_id],
            (err, result) => {
              if (err) {
                console.log("ELIF nnnnnnnnnnnn");
                reject({
                  message: "Something went wrong, please try again",
                  statusCode: 400,
                  data: err,
                });
              } else {
                const token = jwt.sign({ data: result }, "secret");
                resolve({
                  data: result,
                  message: "You have successfully registered.",
                  token: token,
                  statusCode: 200,
                });
              }
            }
          );
        }
      }
    );
  });
};
