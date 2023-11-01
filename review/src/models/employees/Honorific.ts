export default class Honorific {
    public honorificId: number;
    public honorificName: string;

    public constructor(init?: Partial<Honorific>) {
        Object.assign(this, init);
    }

}