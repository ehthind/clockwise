var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const connection = require('./db');

router.get('/sections', (req, res, next) => {

	var courseID = req.query.courseID;
	var section = "section.courseID, section.crn, section.section, section.units, section.schedule_type, section.instructor, section.location, section.days, section.start_time, section.end_time,";
	var capacity = "capacity.capacity, capacity.actual, capacity.remaining";
	var sqlQuery = "SELECT " + section + capacity + " FROM section INNER JOIN capacity ON capacity.crn = section.crn WHERE section.courseID=" + "'" + courseID + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});

});

router.get('/courses', (req, res, next) => {
	
		var courseID = req.query.courseID;
		var course = "name, title";
		var sqlQuery = "SELECT " + course + " FROM course WHERE courseID=" + "'" + courseID + "'";
	
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
	let userId;

	if(Number.isInteger(req.session.passport.user.user_id)) {
		userId = req.session.passport.user.user_id;
		
	} else if(Number.isInteger(req.session.passport.user)) {
		userId = req.session.passport.user;		
	} else {
		console.error('User ID not found');
	}
	
	const post = {
		name: name,
		user_id: userId,
		term: term
	}
	const sqlQuery = 'INSERT INTO saved_schedules SET ?';

	connection.query(sqlQuery, post, function (error, result, fields) {
		if (error) throw error;
		return res.json(result.insertId);
	});

});

router.get('/savedCourses', (req, res, next) => {

	let scheduleId = req.query.scheduleId;
	let courses = "course_id, lec_crn, lab_crn";

	const sqlQuery = "SELECT " + courses + " FROM saved_courses WHERE schedule_id=" + "'" + scheduleId + "'";

	connection.query(sqlQuery, function (error, result, fields) {
		return res.json(result);
	});

});

router.post('/savedCourses', (req, res, next) => {

	console.log('req.body:', req.body);
	let schedule_id = req.body.scheduleId;
	let course_id = req.body.courseId
	let lec_crn = req.body.lec_crn;
	let lab_crn = req.body.lab_crn;
	let name = req.body.name;
	let title = req.body.title;
	
	const post = {
		schedule_id: schedule_id,
		course_id: course_id,
		lec_crn: lec_crn,
		lab_crn: lab_crn
	}
	const sqlQuery = 'INSERT INTO saved_courses SET ?';

	connection.query(sqlQuery, post, function (error, result, fields) {
		if (error) throw error;
		return res.json(result);
	});

});





module.exports = router;