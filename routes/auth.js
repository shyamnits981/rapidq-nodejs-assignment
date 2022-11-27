const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const User = mongoose.model("User")
const Product = require('../models/product')
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin');
const { application } = require('express');



router.get("/protected", requireLogin, (req, res) => {
    res.send("hello")
})

router.post("/",(req,res)=>{
    res.send("hello");
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fild properly" })
    }
    User.findOne({ email: email }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "user alredy exits with that email" })
        }
        bcryptjs.hash(password, 12).then(hashedpassword => {
            const user = new User({
                name,
                email,
                password: hashedpassword,

            })
            user.save().then(user => {
                res.json({ message: "saved successfully" })
            }).catch((err) => {
                console.log(err);
            })
        })
    }).catch((err) => {
        console.log(err);
    })
})



router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" })
    }
    User.findOne({ email: email }).then(savedUser => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Password" })
        }
        bcryptjs.compare(password, savedUser.password).then(doMatch => {
            if (doMatch) {
                // res.json({ message: "successfully signed in" })
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const { _id, name, email } = savedUser
                res.json({ token, user: { _id, name, email } })
            }
            else {
                return res.status(422).json({ error: "Invalid Email or Password" })
            }
        }).catch(err => {
            console.log(err);
        })
    })
})


router.post("/add-product", async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
})


router.get("/products", async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products);
    } else {
        res.send({ result: "No result found" })
    }
})


// router.delete("/product/:id", async (req, res) => {
//     res.send(req.params.id);
//     const result = await Product.deleteOne({ _id: req.params.id });
//     res.send(result)
// })


router.get("/product/:id", async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result);
    }
    else {
        res.send({ result: "No record found" });
    }
})

router.put("/product/:id", async(req,res)=>{
   let result = await Product.updateOne(
    {_id:req.params.id},
    {
       $set:req.body 
    }
   )
   res.send(result);
})


router.get("/search/:key",async(req,res)=>{
  let result =await Product.find({
    "$or":[
        { name: { $regex:req.params.key } },
        { rollnumber: {$regex:req.params.key} },
        { collagename: {$regex:req.params.key} }
    ]
  })
  res.send(result)
})
module.exports = router;