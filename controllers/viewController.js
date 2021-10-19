const catchAsync = require('../utils/catchAsync');
const { default: slugify } = require('slugify');
const User = require('../models/UserModel');

exports.getIndex = catchAsync(async (req, res) => {
    //1)Get audio data from collection
    const audios = await Audio.find({});
    //2)Build template
    //3)Render that template using audio data 
    res.status(200).render('index', {
        title: 'All songs',
         audios 
    })
})

exports.getTour = catchAsync( async (req, res ) => {
    // const tour = await slugify(req.slugify);
    res.status(200).render('slug', {
        title:'slug'
    })
})

exports.getLoginForm = (req, res) => {

    res.status(200).render('login', {
        title:'Login',
    
    });
};

exports.getAccountForm = (req, res) => {
    
    res.status(200).render('account', {
        title: 'your account'

    })
}

exports.updateUserData  =  catchAsync( async (req, res, next) => {
  
    const updatedUser = await User.findByIdAndUpdate(req.user.id, 
        {
            name: req.body.name,
            email: req.body.email
        },
        {
        new: true,
        runValidators: true
    })

    if(!user) {
        return next(new AppError('No User found with that ID', 404))
    }
    

    res.status(200).render('account', {
        title: 'your account',
        user: updatedUser
    });

  })
