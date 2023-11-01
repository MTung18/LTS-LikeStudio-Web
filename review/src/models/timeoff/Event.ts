export interface Event {
  id: string;
  eventId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  resourceId: string;
  recurrenceCombo: string;
  recurrenceRule?: string;
  planType?: string;
  note?: string;
  sendNotification?: boolean;
  notificationDate?: Date | string;
  totalLeaveTime?: number;
}
