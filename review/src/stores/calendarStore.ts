import { calendarApi } from "@/axios/instances/calendarApi";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useCalendarStore = defineStore("calendar", () => {

    async function getCalendar(employeeId: number[]): Promise<any> {
        return await calendarApi.getCalendar(employeeId);
    }

    async function getListOfEmployee(employeeId?: number): Promise<any> {
        return await calendarApi.getListOfEmployee(employeeId);
    }

    async function getListOfSupervisor(): Promise<any> {
        return await calendarApi.getListOfSupervisor();
    }

    return {
        getCalendar,
        getListOfEmployee,
        getListOfSupervisor
    };
});
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useCalendarStore, import.meta.hot));
}
