import { DeductionMethod, DeductionMethodName } from "@/enums/DeductionType";
import RadioButton from "@/models/RadioButton";

const deductionMethodOptions: RadioButton[] = [
    { text: DeductionMethodName.AMOUNT, value: DeductionMethod.AMOUNT },
    { text: DeductionMethodName.PERCENT, value: DeductionMethod.PERCENT },
];
export {
    deductionMethodOptions
}