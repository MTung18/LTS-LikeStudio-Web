import moment from 'moment';
import { leftPad } from '@/functions/FilterFunctions';

const DEFAULT_FORMAT_STRING: string = 'L';

function formatDate(value: Date | string, formatString: string = DEFAULT_FORMAT_STRING): string {
    if (value) {
        return moment(new Date(value)).format(formatString);
    }
    if (value.toString().indexOf('T') > 0) {
        return formatUTCDate(value);
    }
    return '';
}

function dateForFSInput(date: Date | string): string {
    // fsInput requires strings in YYYY-MM-DD format
    const convertedDate = new Date(date);
    let month = '' + (convertedDate.getMonth() + 1);
    let day = '' + convertedDate.getDate();
    const year = convertedDate.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function formatUTCDate(item: any): string {
    const date: any = item.split("T")[0];
    const [year, month, day] = date.split('-');
    const result: string = [month, day, year].join('/');
    return result;
}

function formatUTCToLocalDate(value: Date | string): string {
    const momentDate = moment(value);
    if (momentDate.isValid()) {
        return momentDate.local().format(DEFAULT_FORMAT_STRING);
    }
    return '';
}

function formatUTCToLocalDateTime(value: Date | string, formatString: string = 'MM/DD/YYYY - h:mm A') {
    const momentUTC = moment.utc(value);
    if (momentUTC) {
        return momentUTC.local().format(formatString);
    }
    return '';
    
}

function attemptFormatDate(inputValue: any): string {
    if (moment(inputValue, 'YYYY-MM-DD', true).isValid()) {
        const date = new Date(moment(inputValue).format('MM/DD/YYYY'));
        return date.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' });
    }

    const inputCast: string = String(inputValue);
    if (inputCast.trim() === '') {
        return ' ';
    }

    const inputLength: number = inputCast.trim().length;

    if (Number(inputCast) <= 31 && Number(inputCast) > 0 && inputLength <= 2) {

        const newDay: string = leftPad(inputCast.trim(), '0', 2);
        const newDate: string = moment().format('L');
        const parsedNewDate: string[] = newDate.split('/');
        const dateString: string = parsedNewDate[0] + '/' + newDay + '/' + parsedNewDate[2];

        if (moment(dateString, 'MM/DD/YYYY').isValid()) {
            return dateString;
        }
        return inputCast;
    }

    const parsed: string[] = inputCast.split('/');
    if (parsed.length !== 3) {
        if (parsed.length === 1 && Number(inputCast) > 0 && inputLength > 4) {
            const input: string = String(inputCast);
            let month: string = '';
            let day: string = '';
            let year: string = '';

            if (inputLength === 8 || inputLength === 6) {
                month = input.substring(0, 2);
                day = input.substring(2, 4);
                year = input.substring(4);
            } else if (inputLength === 7 || inputLength === 5) {
                month = input.substring(0, 1);
                day = input.substring(1, 3);
                year = input.substring(3);
            }
            year = year.length === 2 ? new Date().getFullYear().toString().substring(0, 2) + year : year;
            return leftPad(month, '0', 2) + '/' + leftPad(day, '0', 2) + '/' + year;
        }
        return inputCast;
    }

    if (isNaN(Number(parsed[0].trim())) || isNaN(Number(parsed[1].trim())) || isNaN(Number(parsed[2].trim()))) {
        return inputCast;
    }
    if (parsed[2].trim().length === 2) {
        parsed[2] = new Date().getFullYear().toString().substring(0, 2) + parsed[2];
    }
    if ((parsed[0].length !== 1 && parsed[0].length !== 2) || (parsed[1].length !== 1 && parsed[1].length !== 2) || parsed[2].length !== 4) {
        return inputCast;
    }
    return leftPad(parsed[0].trim(), '0', 2) + '/' + leftPad(parsed[1].trim(), '0', 2) + '/' + parsed[2].trim();
}

function dateCreatedIsValid(inputValue: any): boolean {
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

function getDateAsYMDWithSeparator(date: Date | string, separator: string): string {
    var formattedDate = new Date(date),
        month = '' + (formattedDate.getMonth() + 1),
        day = '' + formattedDate.getDate(),
        year = formattedDate.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join(separator);
}

export {
    formatDate,
    formatUTCToLocalDate,
    formatUTCDate,
    attemptFormatDate,
    dateCreatedIsValid,
    getDateAsYMDWithSeparator,
    dateForFSInput,
    formatUTCToLocalDateTime
}