var express = require('express');
var router = express.Router();
/// REM1
/// router.use(express.static("jspublic"));
// router.use(express.static("stylesheets"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Trial pokeman page */
router.get('/pokemon1', function(req, res){
  res.render('pokemon1', {});
});

router.get('/pokemon1details', function(req, res) {
  res.render('pokemon1details', {});
})

module.exports = router;
