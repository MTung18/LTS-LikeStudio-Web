function leftPad(str: string, ch: string, len: number): string {
    if (str) {
        len = len - str.length + 1;
        return len > 0 ?
            new Array(len).join(ch) + str : str;
    } else {
        return str;
    }
}

function pluralize(singular?: string, applyFilter: boolean = true): string {
    if (!applyFilter) {
        return singular;
    }
    let plural: string = '';
    if (singular) {
        if (singular.endsWith('s')) {
            return singular + 'es';
        }
        plural = singular.endsWith('y') ? singular.substr(0, (singular.length - 1)) + 'ies' : (singular + 's');
        plural = singular.toLowerCase() === 'person' ? singular.substr(0, 1) + 'eople' : plural;
        plural = singular.toLowerCase() === 'equipment' ? singular.substr(0, 1) + 'quipment' : plural;
        plural = singular.toLowerCase() === 'correspondence' ? singular.substr(0, 1) + 'orrespondence' : plural;
    }
    return plural;
}

export {
    leftPad, pluralize
}