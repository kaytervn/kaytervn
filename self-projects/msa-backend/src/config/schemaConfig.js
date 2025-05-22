import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { DATE_FORMAT, TIMEZONE } from "../utils/constant.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (val) => {
  if (!val) return null;
  return dayjs(val).tz(TIMEZONE).format(DATE_FORMAT);
};

const schemaOptions = {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true },
};

const addDateGetters = (schema) => {
  schema.path("createdAt").get(formatDate);
  schema.path("updatedAt").get(formatDate);
};

export { formatDate, addDateGetters, schemaOptions };
