import _ from 'lodash';

export function dataIsModified<T>(original: T, selected: T): boolean {
    return !_.isEqualWith(original, selected, (originalValue: any, selectedValue: any) => {
        // This function handles the fact that values that come in as numeric are changed to string after editing.
        // This gets evaluated as inequality even though the user sees the same value.

        const zeroToEmptyString: boolean = originalValue === 0 && selectedValue === '';
        const numberAndString: boolean = (typeof originalValue === 'number' && typeof selectedValue === 'string')
            || (typeof selectedValue === 'number' && typeof originalValue === 'string');
        const dateAndString: boolean = (originalValue instanceof Date && typeof selectedValue === 'string')
            || (selectedValue instanceof Date && typeof originalValue === 'string');
        const nullAndEmptyGuid: boolean = (selectedValue === null && originalValue === '00000000-0000-0000-0000-000000000000')
            || (originalValue === null && selectedValue === '00000000-0000-0000-0000-000000000000');

        if (zeroToEmptyString) {
            return false;
        } else if (numberAndString) {
            return originalValue == selectedValue; // tslint:disable-line
        } else if (dateAndString) {
            return new Date(originalValue).getTime() === new Date(selectedValue).getTime();
        } else if (originalValue === null && (selectedValue === '' || (typeof selectedValue === 'undefined') || selectedValue === null)) {
            return true;
        } else if (selectedValue === null && (originalValue === '' || (typeof originalValue === 'undefined') || originalValue === null)) {
            return true;
        } else if (typeof originalValue === 'string' && typeof selectedValue === 'string') {
            return originalValue.trim() === selectedValue.trim();
        } else if (nullAndEmptyGuid) {
            return true;
        } else {
            return undefined;
        }
    });
}