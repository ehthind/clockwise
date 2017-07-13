var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.route('/').get(function (req, res, next) {

	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: 'Idontno1',
		database: 'clockwise'
	});

	connection.connect(function (error) {
		if (error) {
			console.log('Error');
		} else {
			connection.query("SELECT * FROM course", function (error, result, fields) {
				console.log(req.query);

				return res.json(result);
			});
		}
	});

});

module.exports = router;