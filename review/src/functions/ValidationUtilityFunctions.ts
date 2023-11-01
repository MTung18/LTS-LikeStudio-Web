import moment from 'moment';
import { GoogleAPIAddress } from '@/models/GoogleAPIAddress';

function getFormattedRule(value: any, rule: any): object {
    if (rule.required !== true && (value === null || value === undefined || value === '')) {
        return {};
    } else {
        return rule;
    }
}

function getFormattedStringRule(value: any, required: boolean, rule: string): string {
    if (required !== true && (value === null || value === undefined || value === '')) {
        return '';
    } else {
        return rule;
    }
}

function isDateValid(inputValue: any): boolean {
    if (inputValue.trim() === '') {
        return true;
    }

    if (inputValue === 'Invalid Date') {
        return false;
    }

    if (!moment(inputValue, 'MM/DD/Y', true).isValid()) { // use Y instead of YYYY, or moment will just evaluate first four; set strict to true or will ignore zeros
        return false;
    }

    const isBefore: boolean = !moment(inputValue, 'MM/DD/YYYY').isAfter(moment('12/31/1752', 'MM/DD/YYYY')); // check first four digits for year
    const isAfter: boolean = moment(inputValue, 'MM/DD/Y').isAfter(moment('12/31/9999', 'MM/DD/Y')); // check all digits for year

    if (isBefore || isAfter) {
        return false;
    }

    return true;
}

function checkDateSequence(firstDate: any, secondDate: any): boolean {
    if (firstDate && secondDate) {
        return new Date(firstDate) < new Date(secondDate);
    }
    return true;
}

function lookupNumberValidation(): RegExp {
    return /^([^|'~`"]*)$/;
}

function addressHasValues(address: GoogleAPIAddress): boolean {
    return !!(address.address1?.trim() || address.address2?.trim() || address.city?.trim() ||
        address.country?.trim() || address.state_Province?.trim() || address.zip_PostalCode?.trim());
}

const DEFAULT_ERROR_CLASS: string = '.inputError';
function focusOnFirstError(parentId?: string): void {
    const selector: string = parentId ? `#${parentId} .inputError` : '.inputError';
    const error: HTMLElement = document?.querySelector(selector) as HTMLElement;
    error?.focus();
    error?.scrollIntoView({ block: 'center', inline: 'nearest' });
}

function focusOnError(parentId?: string, elementSelector?: string): void {
    const selector: string = parentId ? `#${parentId} ${elementSelector}` : `${elementSelector}`;
    const error: HTMLElement = document?.querySelector(selector) as HTMLElement;
    error?.focus();
    error?.scrollIntoView({ block: 'center', inline: 'nearest' });
}

function isEmpty(obj: any): boolean {
    return obj ? Object.keys(obj).length === 0 : true;
}

function isNotEmptyGuid (str: any): boolean {
    // Regular expression to match GUID format
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
    // Check if the string matches the GUID format and is not equal to Guid.Empty
    return str.match(guidRegex) && str !== "00000000-0000-0000-0000-000000000000";
}

export {
    getFormattedRule,
    getFormattedStringRule,
    isDateValid,
    checkDateSequence,
    lookupNumberValidation,
    focusOnFirstError,
    focusOnError,
    addressHasValues,
    isEmpty,
    isNotEmptyGuid
}
