const enum DeductionMethod {
    AMOUNT = 1,
    PERCENT = 2,
}

const enum DeductionType {
    BENEFIT = 1,
    DEDUCTION = 2
}

const enum DeductionTypeName {
    BENEFIT = "Benefits",
    DEDUCTION = "Deductions"
}

const enum DeductionMethodName {
    AMOUNT = "Amount",
    PERCENT = "Percentage",
}

export {
    DeductionMethod,
    DeductionTypeName,
    DeductionType,
    DeductionMethodName
}