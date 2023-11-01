export enum AlertEvent {
    Submitted = 11,
    Canceled = 12,
    Approved = 13,
    Rejected = 14,
    Posted = 15,
    Triggered = 16,
    SubmittedToSupervisor = 17,
    CancelledToSupervisor = 18
}

export enum AlertResourceType {
    TimeOffRequest = 14,
    BulletinBoardMessage = 15,
    PersonalInformation = 16,
    DirectDeposit = 17,
    ConsentHistory = 18,
    Deduction = 19,
    Holiday = 20,
    Event = 21,
    PayStub = 22,
    W2 = 23,
    W4 = 24,
    WHQApproval = 25,
}

export enum SendToType {
    YourSelf,
    YourSupervisors,
}

export enum AlertApplicationId {
    Hrm = 2,
    Ess = 3,
}