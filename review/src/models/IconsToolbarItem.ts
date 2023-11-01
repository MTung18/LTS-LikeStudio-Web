import { Ref } from "vue";

export default class IconsToolbarItem {
    public id: number;
    public icon: Array<string>;
    public color: string;
    public background: string; 
    public selectedColor?: string;
    public selectedBackground?: string; 
    public title?: string;
    public label?: Ref<string | number>;
    public onClickFunction?: Function;
}