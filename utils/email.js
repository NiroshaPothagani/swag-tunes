// //first install nodemailer{ npm i nodemailer}

// const nodemailer = require('nodemailer');
// const catchAsync = require('./catchAsync');


// const sendEmail = options => {
//     //1) Create a transporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth:{
//             user:process.env.EMAIL_USERNAME,
//             pass:process.env.EMAIL_PASSWORD
//         }
//         //Activate in gmail "less secure app "option
//    //...........mail trap............
//     })
//     //2)Define the email options
// //     const mailOptions = catchAsync(async ({
// //         from: 'park jimin <parkjimin@gmail.com>',
// //         to:options.email,
// //         subject:options.subject,
// //         text:options.message
// //     })  
// //     //3)Actually send the email
// //     await transporter.sendEmail(mailOptions);
// // });

// // module.exports = sendEmail;