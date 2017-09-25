var mysql = require('mysql');

var connection;

if (process.env.JAWSDB_URL) {
	//Heroku deployment
	connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
	connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});
}

connection.connect((error) => {
	if (error) {
		console.log(connection);
		console.error(error);
		console.log('Error connecting to db');
	} else {
		connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
			if (error) throw error;
			console.log('Connection to Database successful');
		});
	}
});

module.exports = connection;