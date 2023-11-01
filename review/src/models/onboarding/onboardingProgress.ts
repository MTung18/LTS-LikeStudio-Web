export default class OnboardingProgress  {
    public notStarted: number = 0;
    public inProgressLessThanSevenDays: number = 0;
    public inProgressGreaterThanSevenDays: number = 0;
    public completed: number = 0;
    public constructor(init?: Partial<OnboardingProgress>) {
      Object.assign(this, init);
    }
  } 