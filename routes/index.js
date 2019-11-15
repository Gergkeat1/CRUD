var express = require('express');
var router = express.Router();
router.set('views', path.join(__dirname, 'views'));
router.set('view engine', 'ejs');
router.set('layout extractScripts', true)
router.set('layout extractStyles', true)
router.use(expressLayouts);


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
  });
});


module.exports = router;
