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

	var courseID = req.query.courseID;
	var section = "section.courseID, section.crn, section.section, section.units, section.schedule_type, section.instructor, section.location, section.days, section.start_time, section.end_time,";
	var capacity = "capacity.capacity, capacity.actual, capacity.remaining";
	var sqlQuery = "SELECT " + section + capacity + " FROM section INNER JOIN capacity ON capacity.crn = section.crn WHERE section.courseID=" + "'" + courseID + "'";


	connection.connect(function (error) {
		if (error) {
			console.log('Error');
		} else {
			connection.query(sqlQuery, function (error, result, fields) {
				return res.json(result);
			});
		}
	});

});

module.exports = router;