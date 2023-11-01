export class PaymentMethod {
  public isPaperCheck: boolean;
  public isDirectDeposit: boolean;
  public isReminded: boolean;

  public constructor(init?: Partial<PaymentMethod>) {
    Object.assign(this, init);
  }
}
