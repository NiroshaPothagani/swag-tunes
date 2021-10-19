
const app = require('./../app');
const AppError  = require('../utils/AppError');
const Audio = require('./../models/audioModel');
const express = require('express');
// const fs = require('fs');
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')

// const filterObj = (obj, ...allowedFields) => {
//     const newObj = {};
//     Object.keys(obj).forEach(el => {
//      if(allowedFields.includes(el))
//      newObj[el] = obj[el];
//  });
 
//  }
exports.getAllAudios = catchAsync (async(req, res, next) => {

    //Execute query
    const features = new APIFeatures(Audio.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginating();
    const audios = await features.query;
   
    // const audio = await Tour.find();
    res.status(201).json({
        status: 'success',
        results: audios.length,
         data :{
           audios
        }
     });
}) 


exports.createAudio = catchAsync ( async (req, res, next) => {
    const newAudio = await Audio.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        newAudio
      }
  });
});

exports.getAudio =  catchAsync( async (req, res, next) => {
    const audio = await Audio.findById(req.params.id);
   
    if(!audio) {
        return next(new AppError('No tour found with that ID', 404))
     }
     
   
    res.status(200).json({
    status: 'success',
    data: {
       audio
    }
}); 
});


exports.updateAudio  =  catchAsync( async (req, res) => {
  
    const audio = await Audio.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!audio) {
        return next(new AppError('No tour found with that ID', 404))
     }
     

    res.status(200).json({
        status: 'success',
        data: {
            audios: 'audio file is updated!'
        }
    });
  })

  
exports.deleteAudio  =  catchAsync( async (req, res) => {
    const audio = await Audio.findByIdAndDelete(req.params.id);
    if(!audio) {
        return next(new AppError('No tour found with that ID', 404))
     }
     
    res.status(204).json({
        status: 'success',
        data:null,
        message:"successfully deleted"
    });

})


// exports.getAllAudios = (req, res) => {
//     res.status(500).json({
//         status:'fail',
//         message:'this route not yet defined'
//     })
// }
// exports.getAudio = (req, res) => {
//     res.status(500).json({
//         status:'fail',
//         message:'this route not yet defained'
//     })
// }
// exports.updateAudio = (req, res) => {
//     res.status(500).json({
//         status:'fail',
//         message:'this route not yet defined'
//     })
// }