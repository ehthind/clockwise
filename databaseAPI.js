var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const connection = require('./db');

router.get('/courses', (req, res, next) => {

	var courseID = req.query.courseID;
	var section = "section.courseID, section.crn, section.section, section.units, section.schedule_type, section.instructor, section.location, section.days, section.start_time, section.end_time,";
	var capacity = "capacity.capacity, capacity.actual, capacity.remaining";
	var sqlQuery = "SELECT " + section + capacity + " FROM section INNER JOIN capacity ON capacity.crn = section.crn WHERE section.courseID=" + "'" + courseID + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});

});

router.get('/savedSchedules', (req, res, next) => {

	let userId = req.session.passport.user;
	let schedule = "schedule_id, name, term";
	
	const sqlQuery = "SELECT " + schedule + " FROM saved_schedules WHERE user_id=" + "'" + userId + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});
});

router.post('/savedSchedules', (req, res, next) => {

	let name = req.body.name;
	let term = req.body.term;
	let userId = req.session.passport.user;
	
	const post = {name: name, user_id: userId, term: term}
	const sqlQuery = 'INSERT INTO saved_schedules SET ?';

	connection.query(sqlQuery, post, function (error, result, fields) {
		if(error) throw error;
		return res.json(result.insertId);
	});

});

router.route('/savedCourses').get(function (req, res, next) {

	let scheduleId = req.query.scheduleId;
	let courses = "course_id, name, title, lec_crn, lab_crn";
	
	const sqlQuery = "SELECT " + courses + " FROM saved_courses WHERE schedule_id=" + "'" + scheduleId + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});

});





module.exports = router;