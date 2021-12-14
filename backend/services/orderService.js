const db = require("../database/db");
const uuid = require('uuid');

exports.createOrder = async (params) => {
  const { userId, cart } = params;
  let order_id=0;
  let p_id=0;
  let newOrderId=uuid.v1(); 
  if (!cart) throw { message: "cart was not provided", statusCode: 400 };
  if (!userId) throw { message: "userId was not provided", statusCode: 400 };
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO orders (o_id,user_id) VALUES (?,?)`,
      [newOrderId,userId],
      (err, result) => {
        console.log("CreateOrderResult",result);
        if (err) reject({ message: err, statusCode: 500 });
        if (result) {
          console.log("Result for the create order",result);
          console.log("neworderid",newOrderId);
          cart.products.forEach(async (prod) => {
            db.query(
              `SELECT p.quantity FROM products p WHERE p.p_id = ?`,
              [prod.id],
              (err, result) => {
                console.log(result);
                console.log("Check product query",[prod.id]);
                if (err) reject({ message: err, statusCode: 500 });
                console.log("PROD DATA",prod);
                let productQuantity = prod.maxQuantity; // db product
                console.log("Result",result);
                console.log("Product Qty",productQuantity);
                order_id=newOrderId;
                p_id=prod.id;
                console.log("Order_id",order_id);
                console.log("p_id",p_id);
                // deduct the quantity from products that were ordered in db
                let updatedQuantity = productQuantity - prod.quantity;
                console.log("Updated quantity",updatedQuantity);
                if (updatedQuantity > 0) {
                  productQuantity = updatedQuantity;
                } else productQuantity = 0;
                db.query(
                  `INSERT INTO order_details (order_id, p_id, quantity) VALUES (?,?,?)`,
                  [newOrderId, prod.id, prod.quantity],
                  (err, result) => {
                    if (err) reject({ message: err, statusCode: 500 });
                    console.log("err result",result);
                    db.query(
                      `UPDATE products SET quantity = ${productQuantity} WHERE p_id = ${prod.id}`,
                      (err, result) => {
                        if (err) reject({ message: err, statusCode: 500 });
                        console.log(result);
                      }
                    );
                  }
                );
              }
            );
          });

          resolve({
            message: `Order was successfully placed with order id ${newOrderId}`,
            orderId: newOrderId,
            products: cart.products,
            statusCode: 201,
          });
        } else {
          reject({
            message: "New order failed while adding order details",
            statusCode: 500,
          });
        }
      }
    );
  });
};

exports.getSingleOrder = async (params) => {
  const { orderId, userId } = params;

  if (!orderId) throw { message: "orderId was not provided", statusCode: 400 };
  if (!userId) throw { message: "userId was not provided", statusCode: 400 };

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM orders INNER JOIN orders_details ON ( orders.o_id = orders_details.order_id ) WHERE orders.o_id = ? AND orders.user_id = ?`,
      [orderId, userId],
      (err, result) => {
        if (err) reject({ message: err, statusCode: 500 });

        if (result.length === 0)
          reject({ message: "order was not found", statusCode: 400 });

        resolve({
          statusCode: 200,
          message: `Order was found`,
          data: result,
        });
      }
    );
  });
};

exports.getOrders = async (params) => {
  const { userId } = params;

  if (!userId) throw { message: "userId was not provided", statusCode: 400 };

  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM orders INNER JOIN order_details ON ( orders.o_id = order_details.order_id ) WHERE user_id = ?`,
      [userId],
      (err, result) => {
        if (err) reject({ message: err, statusCode: 500 });
        console.log(result);
        if (result.length === 0)
       
          reject({ message: "No order were found", statusCode: 400 });

        resolve({
          statusCode: 200,
          message: `${result.length} orders were found`,
          data: result,
        });
      }
    );
  });
};
