const express = require('express');
const AppError  = require('./../utils/AppError');
const User = require('./../models/UserModel');
const catchAsync = require('./../utils/catchAsync')
const APIFeatures = require('../utils/apiFeatures')
const mongoose = require('mongoose'); 

 
exports.getAllUsers = catchAsync( async (req, res) => {
       //Execute query
       const features = new APIFeatures(User.find(), req.query)
       .filter()
       .sort()
       .limitFields()
       .paginating();
       const users = await features.query;
      
       res.status(200).json({
           status: 'success',
           results: users.length,
         data :{
         users
        }
     });
    }
  
 )      
    

exports.getUser =  catchAsync( async (req, res, next) => {
        // const id = req.params.id ;
        // const User = Users.find(el => el.id === id);
            const user = await User.findById(mongoose.Types.ObjectId(req.params.id));          
            
        if(!user) {
            return next(new AppError('No User found with that ID', 404))
         }
         
       
       res.status(200).json({
        status: 'success',
        data: {
            user
        }
    }); 
})


exports.createUser = catchAsync ( async (req, res) => {
        const newUser = await User.create(req.body);
  
        res.status(201).json({
        status: 'success',
        message: 'successfully created',
          data: {
             user: newUser
          }
      }); 

})



 
exports.updateUser  =  catchAsync( async (req, res, next) => {
  
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!user) {
        return next(new AppError('No User found with that ID', 404))
     }
     

    res.status(200).json({
        status: 'success',
        message: 'successfully updated..',
        data: {
            user
        }
    });
  })



  exports.deleteUser  =  catchAsync( async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) {
        return next(new AppError('No User found with that ID', 404))
     }
     
    res.status(200).json({
        status: 'success',
        data:null,
        message:"successfully deleted"
    });

})

// ............................................................

exports.updateMe = catchAsync( async (req, res, next) => {
    //1)Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updatePassword',
                400
            )
        );
    }
    //2)filtered out unwanted fields names that are not allowed to be updated
   
        //1)Get user from collection
        const user = await User.findOne(req.body).select('+emailid');

  
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })
})


exports.deleteMe = catchAsync( async (req, res, next) => {
    //1)Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password deleting. Please use /deletePassword',
                400
            )
        );
    }
    //2)filtered out unwanted fields names that are not allowed to be updated
    const filterBody = filterObj(req.body,'emailid', 'password');
   
    //3)update user document
    const deleteUser = await User.findOneAndDelete(req.body);
        res.status(200).json({
            status: 'success',
            data: {
                user: deleteUser
            }
        })
})



