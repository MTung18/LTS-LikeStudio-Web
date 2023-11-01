export default class Note {
  public id: number;
  public title: string;
  public note: string;
  public date: Date;
  public createdBy: string;

  public constructor(init?: Partial<Note>) {
    Object.assign(this, init);
  }
}
