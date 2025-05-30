/* eslint-disable no-unused-vars */
import cron from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { CONFIG_KEY } from "./constant.js";
import { getConfigValue } from "../config/appProperties.js";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

const getAppUrl = () => {
  return getConfigValue(CONFIG_KEY.API_URL);
};

const activeCommonServices = () => {
  const url = getAppUrl();
  if (!url) {
    console.log("[WARN] No app url found");
    return;
  }
  axios
    .get(url)
    .then(() => {
      console.log(`[${url}] Reloaded`);
    })
    .catch(() => {
      console.error(`[${url}] Error reloading`);
    });
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
