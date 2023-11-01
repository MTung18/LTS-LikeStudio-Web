export default class OnboardingEmployeeInformation {
  public isDeleted: boolean;
  public isDone: boolean;
  public isHRDone: boolean;
  public planDescription: string;
  public progressSidebarName: string;
  public progressSidebarId: number;
  public sequence: number;
  public type: number;
  public progressSidebarType: number;
  public progressSidebarUrl: string;
  public constructor(init?: Partial<OnboardingEmployeeInformation>) {
    Object.assign(this, init);
  }
}
