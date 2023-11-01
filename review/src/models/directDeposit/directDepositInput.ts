export default class DirectDepositInput {
    public id: number;
    public employeeId: number;
    public bankRoutingNumber: string;
    public bankAccountNumber: string;
    public accountTypeId: number;
    public distributionMethodId: number;
    public distributionAmount: number;
    public ordinalPosition: number;
    public isPrenoteRequired: boolean;
    public voidedCheckFilePath: string;
    public description: string;
}