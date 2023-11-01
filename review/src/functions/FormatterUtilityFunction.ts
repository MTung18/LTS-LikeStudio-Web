import { Buffer } from 'buffer';

export function formatLabel(value: string) {
    return value
        .replace(/(_|-)/g, ' ')
        .trim()
        .replace(/\w\S*/g, function (str) {
            return str.charAt(0).toUpperCase() + str.substr(1)
        })
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

export function flattenObject(obj: any) {
    const flattened: any = {}
    Object.keys(obj).forEach((key: any) => {
        const value: any = obj[key];
        if ((typeof value === 'object' && !(value instanceof Date)) && value !== null && !Array.isArray(value)) {
            Object.assign(flattened, flattenObject(value))
        } else {
            flattened[key] = value;
        }
    });
    return flattened
}

export function encodeBase64(input: string): string {
    if (!input || input === '') {
        return input
    };
    return Buffer.from(input).toString('base64');
}

export function propertyEncodeBase64(properties: string[], object : any): void {
    if (properties != null && properties.length > 0) {
        for (let index = 0; index < properties.length; index++) {
            const propertyNameToEncode = properties[index];
            const valueToEncode = object[propertyNameToEncode];
            if (valueToEncode)
                object[propertyNameToEncode] = encodeBase64(valueToEncode);
        }
    };
}

export function capitalizeFirstChar(str?: string) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}