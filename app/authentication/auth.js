'use strict';

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


exports.register = function (req, res) {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
    });

    var user = req.query.username;
    var password = req.query.password;
    var hash_password = bcrypt.hashSync(password, 10);
    var name = req.query.name;

    var columns = '(name, username, password)';
    var values = str('(' + name + ',' + username + ',' + password + ')');

    var sqlQuery = "INSERT INTO users" + columns + " VALUES " + values;

    connection.connect(function (error) {
        if (error) {
            console.log('Error');
        } else {
            connection.query(sqlQuery, function (error, result, fields) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Registered user');
                }
            });
        }
    });

};

exports.sign_in = function (req, res) {

};

exports.loginRequired = function (req, res, next) {

};