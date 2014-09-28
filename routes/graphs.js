var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/force_graph', function(req, res) {
  res.render('force-graph');
});


module.exports = router;
