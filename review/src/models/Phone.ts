export class Phone {
    public id: number = 0;
    public number: string = '';
    public allowTexts: boolean = false;
    public main: boolean = false;
    public extension: string = '';
    public notes: string = '';
    public phoneNumberTypeId: number = 0;
    public phoneNumberType: string = '';
    public isValidPhoneNumber: boolean = true;

    public constructor(init?: Partial<Phone>) {
        Object.assign(this, init);
    }
}
