/* eslint-disable no-unused-vars */
import cron from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { CONFIG_KEY } from "./constant.js";
import { getListConfigValues } from "../config/appProperties.js";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

const activeCommonServices = () => {
  const urls = getListConfigValues(CONFIG_KEY.API_URL);
  for (const url of urls) {
    axios
      .get(url)
      .then(() => {
        console.log(`[${url}] Reloaded`);
      })
      .catch(() => {
        console.error(`[${url}] Error reloading`);
      });
  }
};

const jobs = {
  activeService: new cron.CronJob("* * * * *", async function () {
    activeCommonServices();
  }),
};

const startAllJobs = () => {
  Object.values(jobs).forEach((job) => job.start());
  console.log("All cron jobs have been started");
};

const reloadWebsite = () => {
  activeCommonServices();
};

export { jobs, startAllJobs, reloadWebsite };
