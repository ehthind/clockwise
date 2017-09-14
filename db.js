var mysql = require('mysql');

var connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
});

connection.connect((error) => {
	if (error) {
		console.log(connection);
		console.error(error);
	} else {
		connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
			if (error) throw error;
			console.log('Connection to Database successful');
		});
	}
});

module.exports = connection;