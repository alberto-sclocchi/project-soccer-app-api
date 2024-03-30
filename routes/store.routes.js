const express = require("express");
const router = express.Router();
const Store = require("../models/Store.model");
const Product = require("../models/Product.model")


//GET stores
router.get("/", (req, res, next) => {
    Store.find().populate("manager")
    .then((stores)=> {
      res.json({success: true, data: stores})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});


//GET stores
router.get("/manager", (req, res, next) => {
  Store.find({ manager : req.session.currentUser._id}).populate("manager")
  .then((managerStores)=> {
    res.json({success: true, data: managerStores})
  })
  .catch((err) => {
    res.json({success: false, data: err})
  })
});


//POST add store
router.post("/", (req, res, next) => {
    Store.create({...req.body, manager: req.session.currentUser._id})
    .then((store)=> {
      res.json({success: true, data: store})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

//GET store details
router.get("/:id", (req, res, next) => {
    Store.findById(req.params.id).populate("manager")
    .then((store)=> {
      res.json({success: true, data: store})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

//DELETE store 
router.delete("/:id", async (req, res, next) => {
    try{
        const store = await Store.findById(req.params.id);
        const productsDeleted = await Product.deleteMany({ _id : {$in : [...store.products]}});
        const storeDeleted = await Store.findByIdAndDelete(req.params.id);
        
        res.json({success: true, data: "Store successfully removed."})

    } catch (err) { 
        res.json({success: false, data: err})
    }
});

//UPDATE store
router.put("/:id", (req, res, next) => {
    Store.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate("manager")
    .then((store)=> {
      res.json({success: true, data: store})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});


module.exports = router