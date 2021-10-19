const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const userController = require('../controllers/userController');
const audioController = require('../controllers/audioController')

router
  .route('/')
  .get(audioController.getAllAudios)
  .post(audioController.createAudio);
    
   // AuthController.restrictTo('admin', 'la-guied')

   router
   .route('/:id')
   .get(audioController.getAudio)
   .patch(AuthController.protect,audioController.updateAudio)
   .delete(//AuthController.protect, 
     /*AuthController.restrictTo('admin'),*/
      audioController.deleteAudio);



  module.exports = router;