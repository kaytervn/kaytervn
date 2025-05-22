import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDate = (val) => {
  if (!val) return null;
  return dayjs(val).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss");
};

const formatBirthDate = (val) => {
  return val ? dayjs(val).format("DD/MM/YYYY") : null;
};

const formatDistanceToNow = (val) => {
  if (!val) return null;
  const vietnamTime = dayjs(val).tz("Asia/Ho_Chi_Minh").toDate();
  return formatDistanceToNowStrict(vietnamTime, {
    addSuffix: true,
    locale: vi,
  });
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

const addDistanceToNowGetters = (schema) => {
  schema.path("createdAt").get(formatDistanceToNow);
  schema.path("updatedAt").get(formatDistanceToNow);
};

export {
  formatDate,
  addDateGetters,
  schemaOptions,
  formatDistanceToNow,
  addDistanceToNowGetters,
  formatBirthDate,
};
