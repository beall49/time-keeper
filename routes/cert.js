let express = require('express');
let router  = express.Router();

/* GET cert  page.
 *  remove ensureSecure
 *  make sure you can hit both timecard and www.timecard
 *  then update config vars
 *  sudo certbot certonly  --force-renew -a manual -d www.timecard.ryanbeall.com -d timecard.ryanbeall.com
 *  sudo heroku certs:update /etc/letsencrypt/live/timecard.ryanbeall.com/fullchain.pem /etc/letsencrypt/live/timecard.ryanbeall.com/privkey.pem --app timecard-ryan-beall
 */

if (process.env.hasOwnProperty("LETS_ENCRYPT_URL")) {
    router.get(process.env.LETS_ENCRYPT_URL, function(req, res, next){
        res.send(process.env.LETS_ENCRYPT_KEY)
    });
}

module.exports = router;