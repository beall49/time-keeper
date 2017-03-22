let express = require('express');
let mysql   = require('mysql');

let router = express.Router();

let connection;
/* GET users listing. */
router.get('/', function(req, res, next){
    connection.query(get_sql, function(err, rows, fields){
        if (err) {
            res.send('fail')
        } else {
            let mondays  = (new Date().getDay() == 1) ? 2 : 1;
            let _count   = 0;
            let response = rows[0];
            response.forEach(function(entry, index){
                if (_count > mondays) {
                    response[index].show = false;
                }
                _count = (entry.day_name == 'Monday') ? _count + 1 : _count;
            });
            res.send(response)
        }
    });
});

router.post('/insert', function(req, res, next){
    connection.query(insert_sql, function(err, rows, fields){
        if (err) {
            res.send('fail')
        } else {
            res.send(rows)
        }
    });
});

router.post('/insert-time-stamp', function(req, res){
    let insert_time = `INSERT INTO tbl_entries ( clock_time )  values ( CONVERT_TZ('${req.body.date_time}', '+00:00','-07:00') )`;
    connection.query(insert_time, function(err, rows){
        if (err) {
            res.send('fail')
        } else {
            res.send(rows)
        }
    });
});

router.post('/lunch', function(req, res, next){
    let lunch = req.body.lunch;
    let sql   = lunch_sql.replace("?", lunch);
    connection.query(sql, function(err, rows, fields){
        if (err) {
            res.send('fail')
        } else {
            res.send(rows)
        }
    });
});

function handleDisconnect(){
    let conn = (function(){
        if (process.env.hasOwnProperty("CLEARDB_DATABASE_URL")) {
            return process.env.CLEARDB_DATABASE_URL;
        } else {
            let db = require('./db_config');
            return db.db_config();
        }
    })();

    connection = mysql.createConnection(conn); // Recreate the connection, since
    // the old one cannot be reused.
    connection.connect(function(err){              	// The server is either down
        if (err) {                                  // or restarting (takes a while sometimes).
            console.log(err);                        // console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
        }                                     	    // to avoid a hot loop, and to allow our node script to
    });                                     	    // process asynchronous requests in the meantime.

    // If you're also serving http, display a 503 error.
    connection.on('error', function(err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();
let insert_sql = "INSERT INTO tbl_entries ( clock_time )  values ( CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00','-07:00') )";
let lunch_sql  = "INSERT INTO tbl_entries ( clock_time, lunch_punch )  values ( CONVERT_TZ(CURRENT_TIMESTAMP,'+00:00','-07:00'), ? )";
let get_sql    = "CALL GET_PUNCH_DATA()";
module.exports = router;