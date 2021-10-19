const AppError = require('./../utils/AppError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path} : ${err.value}.`
    return new AppError(message, 400);
}

const handleDupliateFieldDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);

     const message = `Duplicate field value: ${value}. please use another value!`
}

const handleValidationrrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);

    const message = `Invalid inpiut data. ${errors.join(', ')}`;
    return new AppError(message, 400);

}

const handleJwtError = err =>  new AppError('Invalid token. please logoin again!',401);
const handleJwtExpiredError = () =>
    new AppError(' your token has Expired. please logoin again!', 401);


const  sendErrorDev = (err, res) => {
    res.status(err.statusCode).json( {
        status: err.status,
        error: err,
        message:err.message,
        stack:err.stack
        
    });
};

const sendErrorProd = (err, res) => {
    //API
    //Operational, trusted error: send message to clict
    if(err.isOperational) {
        return res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
        //Programming or Other unknown error: don't leak error details
    }
        //1) Log error
        console.log('Errorrrrrrrrr', err );
        //2) Send generic message
    return res.status(500).json({
        status:'error',
        message: ' Something went very wrong'
    });
    
};


module.exports = (err, req, rs, next) => {
    err.statusCode =err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldDB(error);
        if(error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error);
        if(error.name === 'JwtExpiredError') error = handleJwtExpiredError(error);

        sendErrorProd(error, res);
        
    }
}