import { formatTime } from "./formatUtils";

interface RequestDate {
  date: string;
  fromTime: string;
  toTime: string;
}

export function getDateFilter(requestDates: RequestDate[]) {
  return requestDates.map(obj => formatTime(obj.date)).join(", ");
}
