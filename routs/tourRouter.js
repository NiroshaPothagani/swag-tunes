const express = require('express');
const router = express.Router();

const AuthController = require('./../controllers/authController'); 
const tourController = require('./../controllers/tourController');
// router.param('id', tourController.checkID);

//PARAM MIDDLEWARE INSTEAD OF repeating conde like below

/*router
  .route('/tour-stats')
  .get(tourController.getTourstats)
*/

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
    
   // AuthController.restrictTo('admin', 'la-guied')

   router
   .route('/:id')
   .get(tourController.getTour)
   .patch(AuthController.protect, tourController.updateTour)
   .delete(//AuthController.protect, 
     /*AuthController.restrictTo('admin'),*/
      tourController.deleteTour);



  module.exports = router;