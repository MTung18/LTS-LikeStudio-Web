import { PHONE_REGEX, SSN_REGEX, EMAIL_REGEX, SSN_REGEX_WITHMASK } from '@/constants/regex';
import { defineRule } from 'vee-validate';
import { STATES } from '@/constants/common';

const STATE_ABBRS: string[] = STATES.map(s => s.value);

export function defineAddressRules() {
	// https://vee-validate.logaretm.com/v4/guide/global-validators#defining-global-validators
  defineRule('uniqueEmail', (value: any, ctx: any) => {
    const valid: boolean = (ctx === false || !ctx.emailIsDuplicate);
    if (valid) {
      return valid;
    }
    if (ctx.message) {
      return ctx.message;
    } else {
      return false;
    }
  });

  defineRule('deactivatedEmail', (value: any, ctx: any) => {
    const valid: boolean = (ctx === false || !ctx.deactivatedEmail);
    if (valid) {
      return valid;
    }
    if (ctx.message) {
      return ctx.message;
    } else {
      return false;
    }
  });

  defineRule('badToAddress', (value: any, ctx: any) => {
    return ctx === false || !ctx.addressIsBad;
  });

  defineRule('badCcAddress', (value: any, ctx: any) => {
    return ctx === false || !ctx.addressIsBad;
  });

  defineRule('phone', (value: any, ctx: any) => {
    const regex: RegExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const strValue: string = String(value);
    return regex.test(strValue) ? true : 'e.g. (000) 000-0000';
  });

  defineRule('phoneNumber', function (value: string): any {
    if (!value || !value.length) {
      return true;
    }
    return PHONE_REGEX.test(value);
  });

  defineRule('email', function (value: string): any {
    if (!value || !value.length) {
      return true;
    }
    return EMAIL_REGEX.test(value);
  });

  defineRule('usState', function (value: string): any {
    if (!value || !value.length) {
      return true;
    }

    if (STATE_ABBRS.indexOf(value.toUpperCase()) >= 0) {
      return true;
    }

    return `${value} is not a valid US state`;
  });

  defineRule('zipCode', (value: any, ctx: any) => {
    if (value === null || value === undefined || value === '') {
        return true;
    }
    let isValid = false;
    switch (ctx.country) {
      case 'US': {
        const usTest: RegExp = /^\d{5}(-?\d{4})?$/;
        isValid = usTest.test(String(value));
        break;
      }
      case 'CA': {
        const caTest: RegExp = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
        isValid = caTest.test(String(value));
        break;
      }
      default: {
        isValid = String(value)?.length <= 10;
        break;
      }
    }
    if (isValid) {
      return true;
    } else {
      return ctx.country === 'CA' ? 'e.g. A1A 1A1' : 'e.g. 12345 or 12345-6789';
    }
  });

  defineRule("ssn", function (value: string): any {
    if (!value || !value.length) {
      return true;
    }
    return SSN_REGEX.test(value);
  });

  defineRule("ssnWithMask", function (value: string): any {
    if (!value || !value.length) {
      return true;
    }
    return SSN_REGEX_WITHMASK.test(value) ? true : 'e.g. 000-00-0000';
  });
}
