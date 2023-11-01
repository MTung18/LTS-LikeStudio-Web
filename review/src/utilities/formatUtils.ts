import { formatPath } from '@/helper/hqSuite/formatHelper';
import { RequestDate } from "@/models/timeoff/Request";
import moment from "moment";
import { Ref } from "vue";

const LOCALE = "en-US";
const TwoDigit = "2-digit";

export function NumberToString(value) {
  let totalString = "$";
  const formatNumber = value => {
    return Number(value).toLocaleString(LOCALE, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  };

  if (value > 999) {
    totalString += formatNumber(value / 1000) + "K";
  } else {
    totalString += formatNumber(value);
  }
  return totalString;
}

export function FormatDate(input: Date): string {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}/${day}/${year}`;
}

export function FormatDateWithMask(input: Date): string {
  const date = new Date(input);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const yearMask = "XXXX";
  const formattedDate = `${month}/${day}/${yearMask}`;
  return formattedDate;
}

export function FormatDateByLocale(date = "2023-12-31", locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(date));
}

export function FormatDateTime(time: string) {
  const date = new Date(time);
  const dateString = date.toLocaleDateString(LOCALE);
  return `${dateString}`;
}

export function SortByDueDate(list: any[]) {
  const now = new Date();
  const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  list.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return (
      Math.abs(dateA.getTime() - dateOnly.getTime()) -
      Math.abs(dateB.getTime() - dateOnly.getTime())
    );
  });

  return list;
}

export function GetPage(list: any[], pageSize: number, pageNumber: number) {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return list.slice(startIndex, endIndex);
}

// Input: 2023-02-03T02:05:40.857Z
// Output: "02/03/2023 02:05 AM"
export function FormattedDateTime(time: string, includeUnicode?: boolean) {
  const date = new Date(time);
  const dateString = date.toLocaleDateString(LOCALE, {
    day: TwoDigit,
    month: TwoDigit,
    year: "numeric",
  });
  const timeString = date.toLocaleTimeString(LOCALE, {
    hour: TwoDigit,
    minute: TwoDigit,
  });
  let resultDate = "";
  if (includeUnicode) {
    resultDate = `${dateString}` + " \u{1F784} " + `${timeString}`;
  } else {
    resultDate = `${dateString} ${timeString}`;
  }
  return resultDate;
}

export function isValidDateTime(datetime: string): boolean {
  const date = new Date(datetime);
  if (isNaN(date.getTime())) {
    return false;
  }

  if (date > new Date()) {
    return false;
  }

  return true;
}

// Input: 2023-02-03T02:05:40.857Z
// Output: "02/03/2023"
export function formatTime(time: string) {
  return new Date(time).toLocaleDateString(LOCALE, {
    year: "numeric",
    month: TwoDigit,
    day: TwoDigit,
  });
}

// Input: 2023-02-03T02:05:40.857Z
// Output: "2023-02-03"
export function formatDateInputTime(time: string) {
  const d = new Date(time);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// Input: 1
// OutPut: RQ000001
export function formatRequestCode(num: number) {
  if (num == undefined) {
    return "";
  }

  const formatted = num.toString().padStart(6, "0");
  return "RQ" + formatted;
}

// Input: 2023-03-03T02:05:40.857Z
// Output: 01/03/2023 - 31/03/2023
export function getPeriodTimeOfMonth(time: string) {
  const d = new Date(time);
  const year = d.getFullYear();
  const month = d.getMonth();

  const firstDay = new Date(year, month, 1).toString();
  const lastDay = new Date(year, month + 1, 0).toString();

  return `${formatTime(firstDay)} - ${formatTime(lastDay)}`;
}

export function formatNumber(value) {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function FormatPhoneNumberUs(phoneNumber: string) {
  const result = phoneNumber
    .replace(/\D+/g, "")
    .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  return `${result}`;
}

export function FormatSsn(number: number) {
  const result = number.toString().replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3");
  return `${result}`;
}

export function formatSsnOnInput(ssn: string): string { 
  if(!ssn || ssn === "")
  {   
    return "";
  }
      
  var v = ssn;

  var r = v.replace(/\D/g,"");

  r = r.substring(0,9);

  if (r.length > 5) {
      r = r.replace(/^(\d\d\d)(\d{2})(\d{0,4}).*/,"$1-$2-$3");
  }
  else if (r.length > 3) {
      r = r.replace(/^(\d\d\d)(\d{0,3})/,"$1-$2");
  }
  else {
      r = r.replace(/^(\d*)/, "$1");
  }

 return r;
}

export function formatCurrency(amount: any, locales?: string, currency?: string) {
  if (arguments.length === 1) {
    locales = LOCALE;
    currency = "USD";
  }
  const formatter = new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currency || "USD",
  });
  return formatter.format(amount);
}

export function convertUTCDateTimeToLocalDateTime(picker: RequestDate) {
  const timezoneOffset = moment().format('Z');
  const fromDate = moment.utc(picker.fromTime).utcOffset(timezoneOffset).format('MM/DD/YYYY');
  const toDate = moment.utc(picker.toTime).utcOffset(timezoneOffset).format('MM/DD/YYYY');

  if (moment(fromDate).isSame(toDate, 'day')) {
    // If the same date
    const fromTimeFormatted = moment.utc(picker.fromTime).utcOffset(timezoneOffset).format('h:mm A');
    const toTimeFormatted = moment.utc(picker.toTime).utcOffset(timezoneOffset).format('h:mm A');
    return `${fromDate}\u00A0 \u00A0 ${fromTimeFormatted} - ${toTimeFormatted}`;
  } else {
    // If different date
    const fromTimeFormatted = moment.utc(picker.fromTime).utcOffset(timezoneOffset).format('MM/DD/YYYY h:mm A');
    const toTimeFormatted = moment.utc(picker.toTime).utcOffset(timezoneOffset).format('MM/DD/YYYY h:mm A');
    return `${fromTimeFormatted} - ${toTimeFormatted}`;
  }
}

export function showDates(requestDates: RequestDate[]) {
  let dates = ``;
  if (requestDates.length > 0) {
    requestDates
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .some((item, index) => {
        const requestDate = convertUTCDateToLocalDate(item);
        if (!dates.includes(requestDate)) {
          if (index > 0) {
            dates += `, ${requestDate}`;
          } else {
            dates += requestDate;
          }
        }

      });
  }

  return dates;
}

export function convertUTCDateToLocalDate(picker: RequestDate) {
  const timezoneOffset = moment().format('Z');
  const fromDate = moment.utc(picker.fromTime).utcOffset(timezoneOffset).format('MM/DD/YYYY');
  const toDate = moment.utc(picker.toTime).utcOffset(timezoneOffset).format('MM/DD/YYYY');

  if (moment(fromDate).isSame(toDate, 'day')) {
    // If the same date
    return `${fromDate}`;
  } else {
    // If different date
    return `${fromDate} - ${toDate}`;
  }
}

export function showLastNChar(str?: string, numberShowChar = 4) {
  if (str && str.length >= numberShowChar) {
    const _str = str.slice(str.length - 4, str.length);
    const hiddenChars = Array(Number(str.length - numberShowChar))
      .fill("*")
      .join("");
    return `${hiddenChars}${_str}`;
  } else {
    return str;
  }
}

export function capitalizeFirstChar(str?: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

export function randomString(
  length,
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
) {
  let result = "";
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function truncateFileName(initial: string, maxLength = 20) {
  const extension = initial.substring(initial.lastIndexOf('.') + 1); // Get the file extension
  if (initial.length <= 20) {
    return initial;
  }
  const truncatedFilename = initial.substring(0, maxLength); // Truncate the filename (accounting for the extension and ellipsis)

  if (truncatedFilename.includes('.')) {
    return initial;
  }

  // Concatenate the truncated filename, ellipsis, extension, and filetype
  const truncatedFormattedFilename = `${truncatedFilename}...${extension}`;

  return truncatedFormattedFilename;
}
export function setEmployeeInitials(fullName: string): string {
  let name = fullName.split(' '), initials = name[0].substring(0, 1).toUpperCase();

  if (name.length > 1) {
    initials += name[name.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

export function getFirstCharacter(data: string) {
  let result = "";
  if (data && data.length > 0) {
    result = data.charAt(0);
  }
  return result;
}

export function removeAccents(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // str = str.replace(/\s/g, "-");
  // Some system encode vietnamese combining accent as individual utf-8 characters

  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣ 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  str = str.replace(/\s/g, "-");
  str = str.trim();
  // Remove punctuations
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
  return str;
}

export const fsCurrencyConfig = {
  currency: 'USD', currencyDisplay: 'hidden', precision: true
}