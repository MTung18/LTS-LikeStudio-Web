export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const DATE_REGEX = /^\d{4}([./-])\d{2}\1\d{2}$/; //format: YYYY-MM-DD, YYYY/MM/DD
export const SSN_REGEX = /^\d{3}([.-])\d{2}\1\d{4}$/;
export const SSN_REGEX_WITHMASK = /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/;
export const PHONE_REGEX = /^\(\d{3}\)[ -]?\d{3}[ -]?\d{4}/;
