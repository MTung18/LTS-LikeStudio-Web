import moment from "moment"
export enum OnboardType {
  ONBOARDS = 0,
  QUICK_HIRES = 1,
  COMPLETED = 2
}
export enum OnboardingStatus {
  IN_PROGRESS = 0,
  SUBMITTED = 1,
  IN_PROGRESS_LESS_THAN_7D = 2,
  NOT_STARTED = 3
}
export const FILTER_ONBOARDS_TYPE = [
  { text: "Onboards", value: OnboardType.ONBOARDS },
  { text: "Quick Hires", value: OnboardType.QUICK_HIRES },
  { text: "Completed", value: OnboardType.COMPLETED }
]
export const getOnboardStatus = (status: number) => {
  switch (status) {
    case OnboardingStatus.IN_PROGRESS:
      return {
        value: 0,
        text: 'In Progress',
        color: '#FFFFFF',
        background: '#F79F1F'
      }
    case OnboardingStatus.SUBMITTED:
      return {
        value: 1,
        text: 'Submitted',
        color: '#FFFFFF',
        background: '#1ABC9C'
      }
    case OnboardingStatus.IN_PROGRESS_LESS_THAN_7D:
      return {
        value: 2,
        text: 'In Progress',
        color: '#FFFFFF',
        background: '#E41767'
      }
    case OnboardingStatus.NOT_STARTED:
      return {
        value: 3,
        text: 'Not Started',
        color: '#6E7C8F',
        background: 'rgba(110, 124, 143, 0.5)'
      }
    default:
      break
  }
}

export const getOnboardStatusByStartDate = (nrOfCompletedTask: number, startDate: string, isApprove: boolean, isSubmitByEmployee: boolean) => {
  if (nrOfCompletedTask === 0 && !isSubmitByEmployee) {
    return {
      value: 3,
      text: 'Not Started',
      color: '#6E7C8F',
      background: 'rgba(110, 124, 143, 0.5)'
    }
  } else {
    if (nrOfCompletedTask > 0 && !isSubmitByEmployee) {
      const currentDateFormat = moment()
      const startDateFormat = moment(startDate)
      const daysDiff = currentDateFormat.diff(startDateFormat, 'days')
      if (daysDiff < 7) {
        return {
          value: 0,
          text: 'In Progress',
          color: '#FFFFFF',
          background: '#F79F1F'
        }
      }
      else if (daysDiff == 7 || daysDiff > 7) {
        return {
          value: 2,
          text: 'In Progress',
          color: '#FFFFFF',
          background: '#E41767'
        }
      }
    } else if (isSubmitByEmployee) {
      return {
        value: 1,
        text: 'Submitted',
        color: '#FFFFFF',
        background: '#1ABC9C'
      }
    }
  }
}