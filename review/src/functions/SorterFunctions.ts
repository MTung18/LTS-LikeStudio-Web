import _ from 'lodash';

function stringAsNumberComparer(value1: string, value2: string): number {
    const regex: RegExp = /^[0-9 ]+$/; // Must contain only numbers or space

    let number1Converted: number = null;
    if (value1?.match(regex)) {
        number1Converted = Number(value1);
    }

    let number2Converted: number = null;
    if (value2?.match(regex)) {
        number2Converted = Number(value2);
    }

    if (number1Converted && number2Converted) {
        const result: number = number1Converted < number2Converted ? -1 : 1;
        return result;
    }

    // Make numbers sort before alphanumeric
    if (number1Converted && !number2Converted) {
        return -1
    }

    if (!number1Converted && number2Converted) {
        return 1
    }

    // Neither are numbers use string comparer
    return stringCaseInsensitiveComparer(value1, value2);
}

function stringCaseInsensitiveComparer(value1: string, value2: string): number {
    value1 = value1 || '';
    return value1.localeCompare(value2 || '', undefined, { sensitivity: 'base' });
}

function sort(list: any[], prop?: string, dir: 'asc' | 'desc' = 'asc'): any[] {
    prop ?
        list.sort((a: any, b: any) => (dir.toLowerCase() === 'asc' ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1) :
        list.sort((a: any, b: any) => (dir.toLowerCase() === 'asc' ? a < b : a > b) ? -1 : 1);

    return list;
}

function stringEqualsIgnoreCase(a: string, b: string): boolean {
    if (a === b) {
        return true;
    } else if (a && b) {
        return a.toLowerCase() === b.toLowerCase();
    } else {
        return false;
    }
}

export {
    stringAsNumberComparer,
    stringCaseInsensitiveComparer,
    sort,
    stringEqualsIgnoreCase
}