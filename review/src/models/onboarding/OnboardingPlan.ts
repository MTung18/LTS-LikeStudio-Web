import Employee from "../employees/Employee";

export default class OnboardingPlan {
  public id: number;
  public name: string;
  public description: string;
  public assigneeCount: number;
  public isActive: boolean;
  public isDeleted: boolean;

  public constructor(init?: Partial<OnboardingPlan>) {
    Object.assign(this, init);
  }
}
