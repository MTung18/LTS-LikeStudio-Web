export class Setting {
  public name: string;
  public value: string;

  public constructor(init?: Partial<Setting>) {
    Object.assign(this, init);
  }
}