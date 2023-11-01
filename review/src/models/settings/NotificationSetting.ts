export class NotificationSetting{
    public notificationSettingId: number;
    public notificationSettingTypeId: number;
    public isSelected: boolean;
    public applicationId: string;

    public constructor(init?: Partial<NotificationSetting>) {
        if (init) {
            Object.assign(this, init);
        }
    }
}