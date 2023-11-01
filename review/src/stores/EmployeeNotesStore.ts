import { ref, Ref } from 'vue';
import { defineStore } from 'pinia'
import Note from '@/models/employees/Note';
import { whqEmployeesApi } from "@/axios/instances/whqEmployeesApi";
import { encodeBase64 } from '@/functions/FormatterUtilityFunction';

export const useEmployeeNotesStore = defineStore('employeeNote', () => {
    const employeeNotes: Ref<Note[]> = ref([]);

    async function fetchEmployeeNotes(employeeId: number) {
        employeeNotes.value = await whqEmployeesApi.getEmployeeNotesAsync(employeeId);
    }

    async function deleteEmployeeNote(noteId: number): Promise<Boolean> {
        return await whqEmployeesApi.deleteEmployeeNoteAsync(noteId);
    }

    async function createEmployeeNote(employeeId: number, note: Note): Promise<Boolean> {
        // To avoid WAF rule error encode to base 64 before sending it
        note.title = encodeBase64(note.title);
        note.note = encodeBase64(note.note);
        return await whqEmployeesApi.createEmployeeNoteAsync(employeeId, note);
    }

    return {
        fetchEmployeeNotes,
        deleteEmployeeNote,
        createEmployeeNote,
        employeeNotes
    }
});