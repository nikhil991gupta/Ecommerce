const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const { page = 1, limit = 20} = req.query;

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit; // 0,10,20,30
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 20;
  }

  db.query(
    `SELECT p.p_id, p.title, p.image, p.price, p.short_desc, p.quantity,
        c.title as category FROM products p JOIN categories c ON
            c.c_id = p.p_id LIMIT ${startValue}, ${limit}`,
    (err, results) => {
      if (err) console.log(err);
      else {
        console.log("Get all backend",results);
        res.json(results);
      }
    }
  );
});

// GET SINGLE PRODUCT BY ID
router.get("/:productId", async (req, res) => {
  const { productId } = req.params;
  console.log("Params get sinle product",req.params);
  console.log("Pid zzzzzzzzzzz",productId);
  db.query(
    `SELECT p.p_id, p.title, p.image, p.images, p.price, p.quantity, p.short_desc,
        c.title as category FROM products p JOIN categories c ON
            c.c_id = p.p_id WHERE p.p_id = ${productId}`,
    (err, results) => {
      if (err) console.log(err);
      else res.json(results[0]);
    }
  );
});

module.exports = router;
