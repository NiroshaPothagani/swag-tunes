const crypto = require('crypto');
const {promisify} = require('util');
const cookies = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const User = require('./../models/UserModel');
const catchAsync = require('./../utils/catchAsync');
// const songs = require('./audioController');
const AppError  = require('./../utils/AppError');
const { request } = require('http');
const { collection } = require('./../models/UserModel');
const { token } = require('morgan');


const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}; 

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user.id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN *7*24*60*60*1000
        ),
       // secure:true,
        httpOnly:true
    };

    if(process.env.NODE_ENV === 'devlopment')
        cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({ 
        status: 'success',
        token,
        data: {
            user
        }
    }); 
    
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        emailid: req.body.emailid,
        password:req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(newUser,201, res) ;
     const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
     expiresIn:process.env.JWT_EXPIRES_IN
     
 });
});


exports.login = catchAsync(async(req, res, next) => {
    const {emailid, password} = req.body;

    //1) Check if email and password exist
    if(!emailid || !password){
        return next(new AppError('please provide email and password'));
    }

    //2)check if user exists and password is correct
    const user = await User.findOne({ emailid }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password',401));
    }

    //3)if everithing is ok send token to the client
    createSendToken(User, 200, res);

 });



 
exports.protect = catchAsync(async(req, res, next) => {
    //1)GEt token and check of its there
    let token;
    if(
        req.headers.Authorization &&
        req.headers.Authorization.startsWith('Bearer')
    ) {
       token = req.header.Authorization.split(' ')[1];
     
    }else if(req.cookies.jwt) {
        token =req.cookies.jwt;
    }
    // // console.log(token)
     if(!token) {
         return next(
              new AppError(
             'you are not logged in !please log in and get access',
             401)
             );
     }

    //2)Validation token symmtric

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //3)Check if user still exists
    const { emailid } = req.body;
    const currentUser = await User.findOne(decoded.id).select(+'emailid');
      if(!currentUser) {
          return next(
            new AppError(
                'The user belonging to this token does no longer exist.',
                401
            )
          )
      }
      
    //4)Check if user changed password aafter the token was issued
    
     if(currentUser.changePasswordAfter(decoded.iat)) {
         return next(new AppError('user recently changed password ! Please login again', 401))
     }
     //Grant Access to protected route
     req.user = currentUser;
     res.locals.user = currentUser;

    next();
});
//only the rendered pages, no errors!
// jwtClient = new google.google.auth.JWT
exports.isLoggedIn = async (req, res, next) => {

    try{
    if(req.cookies.jwt) {
        
        //1) verify token
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt, 
            process.env.JWT_SECRET
        );

        //2)check if user still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return next();
        }

        //3) Check if user changed password after the token issued
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
        }

        res.locals.user = currentUser;
        return next();
         } 
    }catch(err) {
        return next();
    }
    next();

};

exports.forgotPassword =catchAsync (async (req, res, next) => {
    //1)Get user based on posted email
    const user = await User.findOne({ emailid: req.body.emailid});
    if(!user) {
        return next(new AppError('There is no user with this email address', 404))
    }

    //2) Generate the random reset token
    const resetToken = await User.createPassWordResetToken();
    await user.save({valiateBeforeSave: false});

    //3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
        )}/users/resetpassword/${resetToken}`;

        const message = `Forgot your paswsword? Submit a PATCH request with your new password and
        passwordonfirm to: ${resetURL}.\nIf you idn't forget your password pls ignor this email`;
        try {
        await sendEmail({
            emailid:user.emailid,
            subject:'your password reset tokn (valid only 10mins)',
            message
        });

        res.status(200).json({
            status: 'success',
            message:'Token sent to email'
        });

    }catch(err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({valiateBeforeSave: false});
            return next(new AppError('There was an error sending the email. Try Again',500))
        }
    
        
});
//RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on th token
       const hashedToken = crypto
       .createHash('sha256')
       .update(req.params.token)
       .digest('hex');
   
       const user = await User.findOne({
           passwordResetToken:hashedToken,
           passwordResetExpires: {$gt: Date.now() }
           
        });

 //2)If token has not expired, and there is user, set the new password
        if(!user) {
            return next(new AppError('Token is invalid or expired'));
        }
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

 //3)Update changedPasswordAt property for the user

 //4)Log the user in, send JWT
 const token = signToken(user._id);

 res.status(200).json({
     status: 'success',
     token
    });


});
exports.updatePassword = catchAsync(async (req, res,next) => {
    //1)Get user from collection
    const user = await User.findOne(req.body).select('+password');
    //2)Check if Posted current password is correct
    if(!(await User.correctPassword(req.body.passwordConfirm, user.password))) {
        return next(new AppError('Your urrent password is wrong', 401))
    }
    //3)if so, update password
     user.password = req.body.password;
     user.passwordConfirm = req.body.passwordConfirm;
     await user.save();

    //4)Log user in, send jwt
    createSendToken(newUser, 200, res);
    res.status(200).json({
        status: 'success',
        message: 'succussefuly updated...'
    })
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires:new Date(Date.now() +10 +1000),
        httpOnly:true
    });
    res.status(200).json({
        status:'success',
        message:'LogOut Successfully'
    });
}


exports.getCurrentUserData =  catchAsync( async (req, res, next) => {
   
    const {emailid, password} = req.body;
    const user = await User.findOne(req.body).select('+emailid');

  
    if(!user) {
        return next(new AppError('No User found with that ID', 404))
     }
     
   
   res.status(200).json({
    status: 'success',
    data: {
        user
    }
}); 
    }
    
)


