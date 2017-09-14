var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const connection = require('./db');



router.route('/courses').get(function (req, res, next) {

	var courseID = req.query.courseID;
	var section = "section.courseID, section.crn, section.section, section.units, section.schedule_type, section.instructor, section.location, section.days, section.start_time, section.end_time,";
	var capacity = "capacity.capacity, capacity.actual, capacity.remaining";
	var sqlQuery = "SELECT " + section + capacity + " FROM section INNER JOIN capacity ON capacity.crn = section.crn WHERE section.courseID=" + "'" + courseID + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});

});

router.route('/schedules').get(function (req, res, next) {

	var userId = req.query.userId;
	var schedule = "schedule_id, name, term";
	var sqlQuery = "SELECT " + schedule + " FROM saved_schedules WHERE user_id=" + "'" + userId + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});

});




module.exports = router;