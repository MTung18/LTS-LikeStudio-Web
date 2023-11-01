export default class DocumentCategory {
    public id: number;
    public name: string = '';
    public colorCode: string = ''

    public constructor(init?: Partial<DocumentCategory>) {
        Object.assign(this, init);
    }
}