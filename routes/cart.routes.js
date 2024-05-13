const router = require("express").Router();
const Cart = require ("../models/Cart.model");
const Product = require ("../models/Product.model");
const User = require ("../models/User.model")

//GET all carts
router.get("/", (req, res, next) => {
    Cart.findOne({$and : [{user: req.session.currentUser._id}, {isClosed: false}]}).populate("user").populate("products")
    .then((cart)=> {
      res.json({success: true, data: cart})
    })
    .catch((err) => {
      res.json({success: false, data: err})
    })
});
  

//POST add cart
router.post("/",  (req, res, next) => {
    User.findOne({email: req.body.email})
    .then((user) => {
        Cart.create({user: user._id, isClosed: false})
        .then((cartAdded)=> {
            res.json({success: true, data: cartAdded})
        })
        .catch((err) => {
            res.json({success: false, data: err})
        })
    });

});


// UPDATE cart 
router.put("/:productId", (req, res) => {
	Cart.findOne({$and : [{user: req.session.currentUser._id}, {isClosed: false}]}).populate("user").populate("products")
    .then((cart) => {
        // console.log({body: req.body});

		if(!!req.body.removeContent) {
			cart.products.pull(req.params.productId)
		} else {
			cart.products.push(req.params.productId)
		}

		cart.save()
        .then((updatedCart) => {
            console.log({updatedCart})
			res.json({success: true, data: updatedCart});
		})
        .catch((err) => {
            res.json({success: false, error: err})
        });

	}).catch(err => res.json({success: false, error: err}));
})


module.exports = router;

