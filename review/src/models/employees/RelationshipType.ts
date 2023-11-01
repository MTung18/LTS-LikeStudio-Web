export default class RelationshipType {
    public id: number;
    public name: string;

    public constructor(init?: Partial<RelationshipType>) {
        Object.assign(this, init);
    }
}