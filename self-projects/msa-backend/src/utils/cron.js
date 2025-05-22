/* eslint-disable no-unused-vars */
import cron from "cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import https from "https";
import { CONFIG_KEY } from "./constant.js";
import { getConfigValue } from "../config/appProperties.js";
import axios from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

const getAppUrl = () => {
  return getConfigValue(CONFIG_KEY.API_URL);
};

const jobs = {
  activeService: new cron.CronJob("* * * * *", async function () {
    const url = getAppUrl();
    if (!url) {
      console.log("[WARN] No app url found");
      return;
    }
    https
      .get(url, (res) => {
        if (res.statusCode == 200) {
          console.log(`[WARN] GET request sent successfully to ${url}`);
        } else {
          console.log("[WARN] GET request failed", res.statusCode);
        }
      })
      .on("error", (e) => {
        console.error("[ERROR] Error while sending request");
      });
  }),
};

const startAllJobs = () => {
  Object.values(jobs).forEach((job) => job.start());
  console.log("All cron jobs have been started");
};

const reloadWebsite = () => {
  axios
    .get(getAppUrl())
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toISOString()}:`,
        error.message
      );
    });
};

export { jobs, startAllJobs, reloadWebsite };
