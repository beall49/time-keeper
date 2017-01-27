var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection;
/* GET users listing. */
router.get('/', function(req, res, next) {
    connection.query(get_sql, function(err, rows, fields) {
        if (err) {
            res.send('fail')
        } else {
            res.send(rows[0])
        }
    });
});

router.post('/insert', function(req, res, next) {
    connection.query(insert_sql, function(err, rows, fields) {
        if (err) {
            res.send('fail')
        } else {
            res.send(rows)
        }
    });
});

router.post('/lunch', function(req, res, next) {
    var lunch = req.body.lunch;
    var sql = lunch_sql.replace("?", lunch);
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            res.send('fail')
        } else {
            res.send(rows)
        }
    });
});



//process.env.CLEARDB_DATABASE_URL
function handleDisconnect() {
    connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL); // Recreate the connection, since
                                                    // the old one cannot be reused.
    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            //console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.

    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();
var insert_sql = "INSERT INTO tbl_entries ( clock_time )  values ( CONVERT_TZ(CURRENT_TIMESTAMP(),'+08:00','-00:00'))";
var lunch_sql = "INSERT INTO tbl_entries ( clock_time, lunch_punch )  values ( CONVERT_TZ(CURRENT_TIMESTAMP(),'+08:00','-00:00'), ? )";
var get_sql =  "CALL GET_PUNCH_DATA()";
module.exports = router;
