import { NamedEntity } from "../namedEntity";

export default class DirectDepositMasterData {
    distributionMethodList: NamedEntity[] = [];
    accountTypeList: NamedEntity[] = [];
    approvalStatusList: NamedEntity[] = [];

    public constructor(init?: Partial<DirectDepositMasterData>) {
        Object.assign(this, init);
    }
}