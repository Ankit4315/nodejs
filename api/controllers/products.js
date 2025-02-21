const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all = async (req, res, next) => {
  try {
    let products = await Product.find()
    .select("name price _id productImage");
    const response = {
      count: products.length,
      product: products.map((doc) => {
        return {
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + doc._id,
          },
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.products_created_product = async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      // productImage: req.file.path,
    });
    let result = await product.save();
    res.status(201).json({
      message: "created product successfully",
      createdProduct: {
        _id: result._id,
        name: result.name,
        price: result.price,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + result._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


exports.products_get_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    let product = await Product.findById(id).select(
      "name price _id productImage"
    );
    if (product) {
      res.status(200).json({
        product: product,
        request: {
          type: "GET",
          url: "http://localhost:3000/products",
        },
      });
    } else {
      res.status(404).json({
        message: "no valide id",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.products_update_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    let status = await Product.updateOne({ _id: id }, { $set: req.body });
    res.status(200).json({
      message: "product updated",
      request: {
        type: "GET",
        url: "http://localhost:3000/products/" + id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.products_delete_product = async (req, res, next) => {
  try {
    const id = req.params.productId;
    let status = await Product.deleteOne({ _id: id });
    res.status(200).json({
      message: "product deleted",
      request: {
        type: "POST",
        url: "http//localhost:3000/products",
        body: { name: "String", price: "Number" },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
