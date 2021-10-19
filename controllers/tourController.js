const express = require('express');
// const fs = require('fs');
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const Tour = require('./../models/tourModel');
const AppError = require('../utils/AppError');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../tours.json`)
// );

exports.getAllTours = catchAsync( async (req, res) => {
  
       
        //BUILD QUERY
       //FILTRING
    //    const query = Tour.find(queryObj);
      

       //Execute query
       const features = new APIFeatures(Tour.find(), req.query)
       .filter()
       .sort()
       .limitFields()
       .paginating();
       const tours = await features.query;
      
       res.status(200).json({
           status: 'success',
           results: tours.length,
         data :{
         tours
        }
     });
    }
  
 )      
       //SORTING
    //    if(req.query.sort) {
    //        const sortBy = req.query.sort.split(',').join(' ');
    //        query = query.sort(sortBy);
    //    } else {
    //        query =query.sort('-id');
    //    }

      // const tours = await Tour.find();
        //const tour = await Tour.find()
        //.where()
        //.equals() or // lte(),lt()



    //FIELD Limiting
    //    if(req.query.fields) {
    //        const fields = req.query.fields.split(',').join(' ');
    //        query = query.select(fields);
    //    } else {
    //        query = query.select('- __v');
    //    }


    //PAGINATION
    //    const page = req.query.page*1 || 1;
    //    const limit = req.query.limit*1 || 100;
    //    const skip = (page - 1) * limit;

    //    query = query.skip(skip).limit(limit);


    //    if(req.query.page) {
    //        const numTours = await Tour.countDocuments();
    //        if(skip > numTours) throw new Error('This page does not exist');
    //    }


    //SEND RESPONSE 
    

    exports.getTour =  catchAsync( async (req, res) => {
        // const id = req.params.id ;
        // const tour = tours.find(el => el.id === id);
        const tour = await Tour.findById(req.params.id);
       
        if(!tour) {
            return next(new AppError('No tour found with that ID', 404))
         }
         
       
       res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    }); 
    }
    )


    exports.createTour = catchAsync ( async (req, res) => {
        const newTour = await Tour.create(req.body);
  
        res.status(201).json({
          status: 'success',
          data: {
             tour: newTour
          }
      }); 
        // res.status(200).JSON({
        //     status:'success',
        //     data: {
        //         tour:newTour
        //     }
        // });
        // try{
        //     console.log(req.query);    
        // }catch(err) {
        //    res.status(404).json({
        //     status:'fail',
        //     message:err
        // })
       //}
       
})



 
exports.updateTour  =  catchAsync( async (req, res) => {
  
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
     }
     

    res.status(200).json({
        status: 'success',
        data: {
            tours: '<update tour here...>'
        }
    });
  })



  exports.deleteTour  =  catchAsync( async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour) {
        return next(new AppError('No tour found with that ID', 404))
     }
     
    res.status(204).json({
        status: 'success',
        data:null,
        message:"successfully deleted"
    });

})



/*AGGREGATION __PIPLINING...by using this we can 
    we can calculate averages time and minimum,
     maximum calculations.  */
//it's just like regular query...but here we can manipulate the datq

/*
express.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                //Query in aggregation
                $match: { ex: ratingsAvg: {$gte:4.5} }
            },
            {
                $group: {
                    _id: null,
                    newField: { ($avg)mongodb operator: '$ratingAverage'},
                    avgPrice: { $avg: '$price'},
                    minPrice: { $min: $price'},
                    maxPrice: { $max: $price'}
                }
            },
            {
                $sort: { avgPrice:1 }
            },
            {
                $match: { _id: { $ne:'easy' } }
            }
        ]);
     res.status(200).json({
        status: 'success',
        data:stats
    });   
    }catch(err) {
        res.status(404).json({
            status:'fail',
            message:'Invalid'
        })
      }
}
*/