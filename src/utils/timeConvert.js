import { format, parse } from "date-fns";

function convertTime(timestr) {
  // misal input: "13:00:00", "13:00:00.000000", dll.
  let parsed;

  try {
    parsed = parse(timestr, "HH:mm:ss.SSSSSS", new Date()); // Postgre format
  } catch {
    parsed = parse(timestr, "HH:mm:ss", new Date()); // fallback
  }

  return format(parsed, "HH:mm"); // 24 jam
}

export default convertTime;

export function convertDate(datestr) {
  const parsed = new Date(datestr); // date-fns parse opsional
  return format(parsed, "yyyy-MM-dd");
}
