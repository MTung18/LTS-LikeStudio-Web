export default class jobTitle {
  public id: number;
  public name: string;

  public constructor(init?: Partial<jobTitle>) {
      Object.assign(this, init);
  }

}