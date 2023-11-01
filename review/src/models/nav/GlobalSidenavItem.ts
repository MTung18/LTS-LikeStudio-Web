export default class GlobalSidenavItem {
    public id?: number;
    public label?: string;
    public icon?: Array<string>;
    public to?: ToItem;
    public navItemClass?: string;
    public uiFieldTag?: string;
}

export class ToItem {
    public name?: string;
}
