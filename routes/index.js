var express = require('express');
var router = express.Router();
/// REM1
/// router.use(express.static("jspublic"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Trial pokeman page */
router.get('/pokemon1', function(req, res){
  res.render('pokemon1', {});
})

module.exports = router;
