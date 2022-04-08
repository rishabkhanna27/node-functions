var fs = require('fs');
var _ = require('lodash');
var exec = require('child_process').exec;
const child_process = require("child_process");
var zl = require("zip-lib");

const functions = require("../common/functions")
const config = require("config")
const nodemailer = require("nodemailer");

var dbOptions =  {
host: 'localhost',
port: 27017,
database: 'cure_live',
autoBackup: true, 
removeOldBackup: true,
keepLastDaysBackup: 2,
autoBackupPath: './public/mongoDump/' // i.e. /var/database-backup/
};

	/* return date object */
exports.stringToDate = function (dateString) {
    return new Date(dateString);
};
	
	/* return if variable is empty or not. */
exports.empty = function(mixedVar) {
    var undef, key, i, len;
    var emptyValues = [undef, null, false, 0, '', '0'];
    for (i = 0, len = emptyValues.length; i < len; i++) {
        if (mixedVar === emptyValues[i]) {
        return true;
        }
    }
    if (typeof mixedVar === 'object') {
        for (key in mixedVar) {
return false;
        }
        return true;
    }
    return false;
};

	// Auto backup script
  exports.dbAutoBackUp = () => {
    console.log("running -------->")
// check for auto backup is enabled or disabled
    if (dbOptions.autoBackup == true) {
        var date = new Date();
        var beforeDate, oldBackupDir, oldBackupPath;
        currentDate = this.stringToDate(date); // Current date
        var newBackupDir = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
        var newBackupName = 'mongodump-' + newBackupDir
        var newBackupPath = dbOptions.autoBackupPath + 'mongodump-' + newBackupDir; // New backup path for current backup process
        // check for remove old backup after keeping # of days given in configuration
        if (dbOptions.removeOldBackup == true) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup); // Substract number of days to keep backup and remove old backup
            oldBackupDir = beforeDate.getFullYear() + '-' + (beforeDate.getMonth() + 1) + '-' + beforeDate.getDate();
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir; // old backup(after keeping # of days)
        }
        var cmd = 'mongodump --host ' + dbOptions.host + ' --port ' + dbOptions.port + ' --db ' + dbOptions.database +/* ' --username ' + dbOptions.user +  ' --password ' + dbOptions.pass + */ ' --out ' + newBackupPath; // Command for mongodb dump process
        exec(cmd, function (error, stdout, stderr) {
            setTimeout(async () => {
            try {
                console.log("Email------------->",newBackupName,newBackupPath)
                // const zipp = child_process.execSync(`${newBackupName}`, {
                //   cwd: newBackupPath
                // });
                // const zipp = zipper.sync.zip(`${newBackupPath}/cure_live`).compress().save(`${newBackupName}.zip`);

                zl.archiveFolder(`${newBackupPath}/cure_live`, `${newBackupPath}/cure_live.zip`).then(function () {
                }, function (err) {
                    console.log(err);
                });
                setTimeout(async () => {
                  const transporter = nodemailer.createTransport({
                    host: config.get('mailer.EMAIL_HOST'),
                    port: config.get('mailer.EMAIL_PORT'),
                    secure: config.get('mailer.EMAIL_PORT'),
                    auth: {
                      user: config.get('mailer.EMAIL_USER'),
                      pass: config.get('mailer.EMAIL_PASS')
                    },
                  });
                  const info = await transporter.sendMail({
                    from: '"Cure" <admin@getcure.app>',
                    to: "ankitbabbar@apptunix.com",
                    cc: ["rishab@apptunix.com"],
                    subject: "Cure Database Backup",
                    text: "Cure Database Backup",
                    html: `Cure Database Backup name :- ${newBackupName}`,
                    attachments: [{
                        filename: `cure_live.zip`,
                        path: `${newBackupPath}/cure_live.zip`
                    }]
                  });
                  console.log("EmailService", info);
                },400)
              } catch (error) {
                console.error("EmailService", error);
              }
            }, 1500);
            if (functions.empty(error)) {
                // check for remove old backup after keeping # of days given in configuration
              	if (dbOptions.removeOldBackup == true) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec("rm -rf " + oldBackupPath, function (err) { });
                    }
                }
            }
        });
    }
}