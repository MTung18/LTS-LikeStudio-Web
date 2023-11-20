const locales = "en-US";

export function NumberToString(value) {
 let totalString = "$";
 const formatNumber = value => {
  return Number(value).toLocaleString(locales, {
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

export function FormatDate(date) {
 const year = date.getFullYear();
 const month = (date.getMonth() < 9 ? date.getMonth() + 1 : date.getMonth() + 1)
  .toString()
  .padStart(2, "0");
 const day = date.getDate().toString().padStart(2, "0");
 return `${year}.${month}.${day}`;
}

export function FormatDatePost(date) {
 const year = date.getFullYear();
 const month = (date.getMonth() < 9 ? date.getMonth() + 1 : date.getMonth() + 1)
  .toString()
  .padStart(2, "0");
 const day = date.getDate().toString().padStart(2, "0");
 const hours = String(date.getHours()).padStart(2, '0');
 const minutes = String(date.getMinutes()).padStart(2, '0');
 return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export function FormatMonth(date) {
 const year = date.getFullYear();
 const month = (date.getMonth() < 9 ? date.getMonth() + 1 : date.getMonth() + 1)
  .toString()
  .padStart(2, "0");
 return `${year}.${month}`;
}

export function FormatDateOfBirth(date) {
 const year = date.getFullYear();
 const month = (date.getMonth() < 9 ? date.getMonth() + 1 : date.getMonth() + 1)
  .toString()
  .padStart(2, "0");
 const day = date.getDate().toString().padStart(2, "0");
 return `${year}/${month}/${day}/`;
}

export function FormatTimeToHHMMSS(value) {
 const hours = String(value.getHours()).padStart(2, '0');
 const minutes = String(value.getMinutes()).padStart(2, '0');
 const seconds = String(value.getSeconds()).padStart(2, '0');
 return `${hours}:${minutes}:${seconds}`;
}

export function FormatPhoneNumberUs(phoneNumber) {
 const formattedNumber = phoneNumber.slice(0, 3) + "-" + phoneNumber.slice(3, 5) + "**-*" + phoneNumber.slice(8);
 return formattedNumber;
}

export function FormatName(inputString) {
 const strLength = inputString.length;
 const charactersToReplace = Math.ceil(strLength / 3);

 if (charactersToReplace > 0) {
  const replacedSubstring = '*'.repeat(charactersToReplace);
  const originalSubstring = inputString.slice(0, -charactersToReplace);
  return originalSubstring + replacedSubstring;
 } else {
  return inputString;
 }
}

export function FormatStaffIdNumber(inputString) {
 const firstThreeDigits = inputString.substring(0, 3);
 const remainingDigits = '*'.repeat(inputString.length - 3);
 return firstThreeDigits + remainingDigits;
}

export function FormatEmail(inputString) {
 const [username, domain] = inputString.split('@');
 const maskedUsername = username.slice(0, 3) + '*'.repeat(username.length - 3);
 return maskedUsername + '@' + domain;
}