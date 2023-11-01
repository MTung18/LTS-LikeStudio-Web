import { EmployeeContact, EmployeeContactSave } from "@/models/onboarding/OnboardingEmployeeContact";
import { OnboardingEmployeePrefix } from "@/models/onboarding/OnboardingEmployeePrefix";
import { OnboardingEmployeeGender } from "@/models/onboarding/OnboardingEmployeeGender";
import { OnboardingEmployeeRelationship } from "@/models/onboarding/OnboardingEmployeeRelationship";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import { onboardingEmployeeContactListApi } from "@/axios/instances/onboardingEmployeeContactApi";
import { onboardingEmployeeContactEssApi } from "@/axios/instances/onboardingEmployeeContactEssApi";
import { employeeStatusApi } from "@/axios/instances/employeeStatusApi";

export const useEmployeeContactStore = defineStore(
  "onboardingEmployeeContact",
  () => {
    const employeeContactList: Ref<EmployeeContact[]> = ref(
      new Array<EmployeeContact>()
    );
    const employeeContactDetail: Ref<EmployeeContact> = ref(
      {} as EmployeeContact
    );

    const employeeStatusId: Ref<number> = ref();
    const employeeSubmitStatusId: Ref<boolean> = ref();

    const relationshipOfEmployeeContact: Ref<OnboardingEmployeeRelationship[]> = ref(
      new Array<OnboardingEmployeeRelationship>
    );

    const prefixOfEmployeeContact: Ref<OnboardingEmployeePrefix[]> = ref(
      new Array<OnboardingEmployeePrefix>
    );

    const genderListOfEmployeeContact: Ref<OnboardingEmployeeGender[]> = ref(
      new Array<OnboardingEmployeeGender>
    );
    const employeeContactSSNById: Ref<string> = ref('');

    async function fetchEmployeeContactList(employeeId: number): Promise<void> {
      employeeContactList.value =
        await onboardingEmployeeContactListApi.getEmployeeContacts(employeeId);
    }

    async function fetchEmployeeStatusId(employeeId: string): Promise<void> {
      employeeStatusId.value =
        await employeeStatusApi.getEmployeeStatusId(employeeId);
    }

    async function fetchEmployeeSubmitStatusId(employeeId: string): Promise<void> {
      employeeSubmitStatusId.value =
        await employeeStatusApi.getEmployeeSubmitStatusId(employeeId);
    }

    async function fetchEmployeeContactDetail(employeeId: number, contactId: number): Promise<void> {
      employeeContactDetail.value =
        await onboardingEmployeeContactListApi.fetchEmployeeContactDetail(employeeId, contactId);
    }

    async function deleteEmployeeContactById(id: number): Promise<void> {
      await onboardingEmployeeContactListApi.deleteEmployeeContact(id);
    }

    async function updateEmployeeContactDetail(data: EmployeeContactSave): Promise<void> {
      await onboardingEmployeeContactListApi.updateEmployeeContactDetail(data);
    }

    async function addEmployeeContact(data: EmployeeContactSave): Promise<void> {
      await onboardingEmployeeContactListApi.addEmployeeContact(data);
    }

    async function fetchRelationshipList(): Promise<void> {
      relationshipOfEmployeeContact.value = await onboardingEmployeeContactEssApi.fetchRelationshipList();

      relationshipOfEmployeeContact.value = relationshipOfEmployeeContact.value.map(
        (relationship: OnboardingEmployeeRelationship) => ({
          id: relationship.id,
          name: relationship.name,
        })
      );
    }

    async function fetchPrefixList(): Promise<void> {
      prefixOfEmployeeContact.value = await onboardingEmployeeContactEssApi.fetchPrefixList();
    }

    async function fetchGenderList(): Promise<void> {
      genderListOfEmployeeContact.value = await onboardingEmployeeContactEssApi.fetchGenderList();
    }
    async function fetchEmployeeContactSsnById(employeeContactId: number): Promise<void> {
      employeeContactSSNById.value = await onboardingEmployeeContactListApi.fetchEmployeeContactSsn(employeeContactId);
    }

    return {
      fetchEmployeeContactList,
      employeeContactList,
      fetchEmployeeContactDetail,
      employeeContactDetail,
      deleteEmployeeContactById,
      updateEmployeeContactDetail,
      addEmployeeContact,
      fetchRelationshipList,
      relationshipOfEmployeeContact,
      fetchPrefixList,
      prefixOfEmployeeContact,
      fetchGenderList,
      genderListOfEmployeeContact,
      fetchEmployeeStatusId,
      employeeStatusId,
      fetchEmployeeSubmitStatusId,
      employeeSubmitStatusId,
      employeeContactSSNById,
      fetchEmployeeContactSsnById
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useEmployeeContactStore, import.meta.hot)
  );
}
