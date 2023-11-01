export enum ActionPlacement {
    Header,
    Footer
}

export class PanelActionConfig {
    public name: string;
    public handler: Function;
    public icon: string[];
    public placement: ActionPlacement;
    public class: string;
    public tooltip: string;
    public variant?:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info'
        | 'dark'
        | 'light'
        | 'link'
        | 'outline-primary'
        | 'outline-secondary'
        | 'outline-success'
        | 'outline-danger'
        | 'outline-warning'
        | 'outline-info'
        | 'outline-dark'
        | 'outline-light';
    public constructor(init?: Partial<PanelActionConfig>) {
        Object.assign(this, init);
    }
}

export class PanelConfig {
    public source: any;
    public showHeader: boolean;
    public showFooter: boolean;
    public title: string;
    public subTitle: string;
    public actions: PanelActionConfig[];

    public constructor(init?: Partial<PanelConfig>) {
        Object.assign(this, init);
    }
}

