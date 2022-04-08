const moment = require("moment");
const Model = require("../models/index");
const mongoose = require("mongoose");
const constant = require('../common/constants');
const CronJob = require('cron').CronJob;


async function startCronJobs() {
  await agenda.start()
}