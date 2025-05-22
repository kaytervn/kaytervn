import dayjs from "dayjs";

export const formatDate = (dateString: string): string => {
  return dateString.split(' ')[0]; // Get 'dd/mm/yyyy'
};

export const formatBirthDate = (dateString: string) => {
  // Assuming the dateString is in the format "yyyy/MM/dd hh:mm:ss"
  const dateParts = dateString.split(" ")[0].split("/"); // Get the date part and split by "/"
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Return in "yyyy-MM-dd" format
};

export const formatDateFormToString = (val: any) => {
  return val ? dayjs(val).format("DD/MM/YYYY HH:mm:ss") : null;
};