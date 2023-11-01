import { TimeOffHistory } from "@/models/employees/timeOff/TimeOffHistory";
import { RestOfTimeOff } from "@/models/employees/timeOff/RestOfTimeOff";
export interface HistoryOfPlanType {
  restOfTimeOff: RestOfTimeOff
  timeOffHistories: TimeOffHistory[];
}

export interface HistoryOfPlanTypeReactive {
  data: HistoryOfPlanType;
}
