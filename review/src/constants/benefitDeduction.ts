import { DeductionType, DeductionTypeName } from "@/enums/DeductionType";
import RadioButton from "@/models/RadioButton";

const deductionTabOption = [
    { id: DeductionType.BENEFIT, name: DeductionTypeName.BENEFIT },
    { id: DeductionType.DEDUCTION, name: DeductionTypeName.DEDUCTION },
];

const deductionRadioOptions: RadioButton[] = [
    { value: DeductionType.BENEFIT, text: "Benefit" },
    { value: DeductionType.DEDUCTION, text: "Deduction" },
];

export {
    deductionTabOption,
    deductionRadioOptions
}