const express = require("express");
const router = express.Router();
// const Store = require("../models/Store.model");
const Product = require("../models/Product.model")


//GET products
router.get("/", (req, res, next) => {
    Product.find().populate("manager")
    .then((products)=> {
      res.json({success: true, data: products})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});


//GET product
router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id)
  .then((product)=> {
    res.json({success: true, data: product})
  })
  .catch((err) => {
    res.json({success: false, data: err})
  })
});


//POST add product
router.post("/", (req, res, next) => {
    Product.create({...req.body, addedBy: req.session.currentUser._id})
    .then((product)=> {
      res.json({success: true, data: product})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

module.exports = router;