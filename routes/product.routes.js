const express = require("express");
const router = express.Router();
const Store = require("../models/Store.model");
const Product = require("../models/Product.model")


//GET products
router.get("/", (req, res, next) => {
    Product.find({addedBy: req.session.currentUser._id}).populate("addedBy")
    .then((products)=> {
      res.json({success: true, data: products})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

//GET liked products
router.get("/liked-products", (req, res, next) => {
  Product.find({likes: req.session.currentUser._id })
  .then((likedProducts)=> {
    res.json({success: true, data: likedProducts})
  })
  .catch((err) => {
    res.json({success: false, data: err})
  })
});

//GET product details
router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id).populate("addedBy")
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
    .then((productAdded)=> {
      res.json({success: true, data: productAdded})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});


//DELETE product 
router.delete("/:id", async (req, res, next) => {
  try{
      const product = await Product.findById(req.params.id);
      const storeProductsDeleted = await Store.updateMany({ products : product._id}, {$pull: {products : product._id}}, {multi: true});
      const productsDeleted = await Product.findByIdAndDelete(req.params.id);
      
      res.json({success: true, data: "Product successfully removed."})

  } catch (err) { 
      res.json({success: false, data: err})
  }
});

//UPDATE product
router.put("/:id", (req, res, next) => {
  Product.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate("addedBy")
  .then((product)=> {
    res.json({success: true, data: product})
  })
  .catch((err) => {
    res.json({success: false, data: err})
  })
});



module.exports = router;