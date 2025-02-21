const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_get_all = async (req, res, next) => {
  try {
    let orders = await Order.find()
      .select("product quantity _id")
      .populate("product", "name");
    res.status(200).json({
      count: orders.length,
      orders: orders.map((doc) => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders" + doc._id,
          },
        };
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.orders_create_order = async (req, res, next) => {
  try {
    let product = await Product.findById(req.body.productId);
    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      quantity: req.body.quantity,
      product: req.body.productId,
    });

    let result = await order.save(); // return order.save()

    console.log(result);
    res.status(201).json({
      message: "Order is Stored",
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: "GET",
        url: "http://localhost:3000/orders" + result._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.orders_get_orders = async(req, res, next) => {

  try {
    let order = await  Order.findById(req.params.orderId)
    .populate("product")
    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: "GET",
        url: "http://localhost:3000/orders",
      },
    });
  } catch (err) {
    console.log(err);
      res.status(500).json({
        error: err.message,
      });
  }
};

exports.orders_delete_order = async(req, res, next) => {
  try {
    let result = await Order.deleteOne({ _id: req.params.orderId })
    res.status(200).json({
      message: "Order was deleted",
      request: {
        type: "POST",
        url: "http://localhost:3000/orders",
        body: { productId: "ID", quantity: "Number" },
      },
    });
  } catch (err) {
    console(err);
      res.status(500).json({
        error: err,
      });
  }
};
