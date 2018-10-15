var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/some', function(req, res, next){
	res.send('thi is /users/some');
});
module.exports = router;
