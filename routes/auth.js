const express = require( 'express' );
const controllers = require('../controllers/auth')

const router = express.Router();

router.post( '/regester',  controllers.regester) 


module.exports = router;