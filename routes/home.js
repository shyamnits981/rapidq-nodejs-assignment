const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const details = mongoose.model("details")

router.get('/',(req,res,next)=>{
    res.send("hello")
})


router.post('/add', (req,res,next)=>{
  const student = req.body.student;
  const collage = req.body.collage;
  const rollnumber = req.body.rollnumber;

  console.log(student, collage, rollnumber);
 })

module.exports = router;