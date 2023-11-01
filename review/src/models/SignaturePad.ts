export interface ISignaturePad {
    clearSignature(): void;
    lockSignaturePad(): void;
    openSignaturePad(): void;
    isEmpty(): boolean;
    saveSignature(): { isEmpty: boolean; data: any };
    fromData(data: string): void;
    fromDataURL(data: string, options?: any, callback?: any): void;
}