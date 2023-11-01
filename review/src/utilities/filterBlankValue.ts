export const filterBlank = (val: unknown): unknown => {
    if (val === undefined || val === null || val === '') return '-';
    return val
}

