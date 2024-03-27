const express = require("express");
const router = express.Router();
const Store = require("../models/Store.model")


//GET stores
router.get("/", (req, res, next) => {
    Store.find()
    .then((stores)=> {
    res.json({success: true, data: stores})
    })
    .catch((err) => {
    res.json({success: false, data: err})
    })
});

//POST add store
router.post("/", (req, res, next) => {
    Store.create(req.body.store)
    .then((store)=> {
      res.json({success: true, data: store})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

//GET store details
router.get("/:id", (req, res, next) => {
    Store.findById(req.params.id)
    .then((store)=> {
      res.json({success: true, data: store})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

//DELETE store 
router.delete("/:id", (req, res, next) => {
    Store.findByIdAndDelete(req.params.id)
    .then(()=> {
      res.json({success: true, data: "Store successfully removed."})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});

//UPDATE store
router.put("/:id", (req, res, next) => {
    Store.findByIdAndUpdate(req.params.id, req.params.id)
    .then((store)=> {
      res.json({success: true, data: store})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});


module.exports = router