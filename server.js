const mongoose = require('mongoose'); 
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');


// // const index = require();

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
     process.env.DATABASE_PASSWORD);
//mongoose.connect(proccess.env.DATABASE_LOCAL,{})

mongoose.connect(DB, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(
    console.log("DB connection is successfull..."));


    module.exports = {
        User: require('./models/UserModel'),
        RefreshToken: require('./refresh-token.model'),
        isValidId
    };
    
    function isValidId(id) {
        return mongoose.Types.ObjectId.isValid(id);
    }
// console.log(process.env);


//Start Server 
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,() => {
    console.log(`App running on port ${PORT}......`);
});

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REGECTION...Shutting down....');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION...Shutting down....');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
})
