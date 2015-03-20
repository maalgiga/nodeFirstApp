var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getTocken',function(req,res,next){
    res.status(200).json({tocken:"whenthecatgoesouthtemicepartyallnight"});
  });
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
