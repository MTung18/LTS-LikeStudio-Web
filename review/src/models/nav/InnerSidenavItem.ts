export default class InnerSidenavItem {
  public id?: number;
  public label?: string;
  public icon?: Array<string>;
  public iconColor?: string;
  public circleColor?: string;
  public to?: ToItem;
  public navItemClass?: string;
  public hovercolor?: string;
  public uiFieldTag?: string;
}

export class ToItem {
  public name?: string;
}

export class InnerSidenav {
  public page: string | Array<string>;
  public backTo: ToItem;
  public data: InnerSidenavItem[];
}
