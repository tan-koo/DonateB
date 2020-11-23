const express = require('express');
const router = express.Router();
const User = require('../model/user');
const Post4selves = require('../model/post4selves');
const Commento = require('../model/comment');
var passport = require('passport');
var passportLocal= require('passport-local');
var passportLocalMongoose=require('passport-local-mongoose');


router.get("/",function(req,res){
        Post4selves.find({name : req.query.name},function(err,post4selves){
            if(err){
                console.log('asdasdas');
            }
            if(!post4selves.length){
                
                res.redirect('back');

            }
            else {
            Commento.find({},function(error,comment){
                if(error){
                  console.log(error);
                }else {
                    User.find({},function(err,user){
                      if(err) {console.log(err)}
                      else{
                       
                         res.render('public',{Post4selves:post4selves,Commento:comment,User:user})
                      }
                    })
                }
              });
            }
        })
})  
  module.exports = router;