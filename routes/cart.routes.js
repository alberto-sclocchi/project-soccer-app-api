const router = require("express").Router();
const Cart = require ("../models/Cart.model");
const Product = require ("../models/Product.model");
const User = require ("../models/User.model")

//GET all carts
router.get("/", (req, res, next) => {
    if(req.session.currentUser){
        Cart.findOne({$and : [{user: req.session.currentUser._id}, {isClosed: false}]}).populate("user").populate("products")
        .then((cart)=> {
          res.json({success: true, data: cart})
        })
        .catch((err) => {
          res.json({success: false, data: err})
        })
    }
});
  

//POST add cart
router.post("/",  (req, res, next) => {
    User.findOne({email: req.body.email})
    .then((user) => {
        Cart.create({user: user._id, isClosed: false, totalPrice: 0})
        .then((cartAdded)=> {
            res.json({success: true, data: cartAdded})
        })
        .catch((err) => {
            res.json({success: false, data: err})
        })
    });

});

//UPDATE cart (close)
router.put("/close/:cartId", (req,res) => {
    Cart.findByIdAndUpdate(req.params.cartId, req.body, {new: true}).populate("products").populate("user")
    .then((cartUpdate)=> {
        res.json({success: true, data: cartUpdate})
    })
    .catch((err) => {
        res.json({success: false, data: err})
    })
})

// UPDATE cart (product)
router.put("/:productId", (req, res) => {
	Cart.findOne({$and : [{user: req.session.currentUser._id}, {isClosed: false}]}).populate("user").populate("products")
    .then((cart) => {
        // console.log({body: req.body});
        Product.findById(req.params.productId)
        .then((product) => {
            if(!!req.body.removeContent) {
                cart.products.pull(product._id)
                cart.totalPrice -= product.price;
            } else {
                cart.products.push(product._id)
                cart.totalPrice += product.price;
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
    }).catch(err => res.json({success: false, error: err}));
})



module.exports = router;

