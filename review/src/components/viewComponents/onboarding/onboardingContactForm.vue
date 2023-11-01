<script setup lang="ts">
import { STATES } from "@/constants/common";
import { EmployeeContactReactive, EmployeeContactTypeOption, EmployeeContactStateTypeOption, EmployeeContact } from "@/models/onboarding/OnboardingEmployeeContact";
import { OnboardingEmployeeGender } from "@/models/onboarding/OnboardingEmployeeGender";
import { OnboardingEmployeeRelationship } from "@/models/onboarding/OnboardingEmployeeRelationship";
import { OnboardingEmployeePrefix } from "@/models/onboarding/OnboardingEmployeePrefix";
import { useEmployeeContactStore } from "@/stores/onboardingEmployeeContactStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faCircleExclamation } from "@fortawesome/pro-light-svg-icons";
import { onMounted, ref, watch, computed, reactive, ComputedRef } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useAlerts } from "@/composables/useAlerts";
import { storeToRefs } from 'pinia';
import { useOnboardingStore } from '@/stores/onboardingStore';
import FsInput from "@/components/global/fsInput/fsInput.vue";
import { useLoadingStore } from "@/stores/loadingStore";
import { useHonorificStore } from "@/stores/honorificStore";

library.add(faEyeSlash, faEye, faCircleExclamation);
const { setLoading } = useLoadingStore();
const form = ref(null);
const router = useRouter();
const { notifySuccess } = useAlerts();
const checkIconSsn = ref(true);
const date = new Date();
date.setDate(date.getDate() - 1);
const formattedDate = date.toISOString().slice(0, 10);
const employeeId = router.currentRoute.value.params.id;
const contactId = router.currentRoute.value.params.contactId;
const store = useEmployeeContactStore();
const {
  fetchEmployeeContactList,
  fetchEmployeeContactDetail,
  updateEmployeeContactDetail,
  addEmployeeContact,
  fetchRelationshipList,
  fetchPrefixList,
  fetchGenderList,
  fetchEmployeeContactSsnById
} = useEmployeeContactStore();

const { fetchHonorificDropdownData } = useHonorificStore();
const { honorificDropdownData } = storeToRefs(useHonorificStore())

const typeForm = {
  create: "CREATE",
  edit: "EDIT",
};

interface PropsT {
  formType: "EDIT" | "CREATE";
}

const { formType } = defineProps<PropsT>();
const isEditForm = formType === typeForm.edit;
const relationshipOfEmployeeContact = ref(new Array<OnboardingEmployeeRelationship>());
const prefixOfEmployeeContact = ref(new Array<OnboardingEmployeePrefix>());
const genderListOfEmployeeContact = ref(new Array<OnboardingEmployeeGender>());

const state = STATES.map(
  (state) => ({
    id: state.value,
    name: state.text,
  })
);

const initialOption: EmployeeContactTypeOption = {
  id: null,
  name: ''
};

const initialStateOption: EmployeeContactStateTypeOption = {
  id: null,
  name: ''
};

const setOptionData = (option: EmployeeContactTypeOption | EmployeeContactStateTypeOption, id: number | string, name: string) => {
  option.id = id;
  option.name = name;
};

const initialData = {
  id: null,
  firstName: "",
  middleName: "",
  lastName: "",
  relation: "",
  relationshipId: null,
  phoneId: null,
  phoneNumber: "",
  phoneExtension: "",
  emailAddress: "",
  emailId: null,
  gender: "",
  genderId: null,
  birthDate: "",
  ssn: "",
  isEmergencyContact: false,
  isDependent: false,
  isBeneficiary: false,
  isPrimaryContact: false,
  namePrefixId: null,
  prefix: "",
  suffix: "",
  address: {
    id: null,
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    addressType: ""
  }
};

const dataEmployeeContactDetail: EmployeeContactReactive = reactive({
  data: { ...initialData },
} as EmployeeContactReactive);

const isFormDirty = ref(false);
const originalData = ref(JSON.stringify(store.employeeContactDetail));
const fetchData = async () => {

  await Promise.all([fetchRelationshipList(), fetchGenderList(), fetchHonorificDropdownData()]);

  const getNameById = (id: number | string, options): string | undefined => {
    const option = options.find(option => option.id === id);
    return option?.name;
  };

  if (isEditForm) {
    await fetchEmployeeContactDetail(Number(employeeId), Number(contactId));
    await fetchEmployeeContactSsnById(Number(contactId));

    dataEmployeeContactDetail.data = store.employeeContactDetail;
    dataEmployeeContactDetail.data.ssn = store.employeeContactSSNById ?? '';
    dataEmployeeContactDetail.data.birthDate =
      dataEmployeeContactDetail.data.birthDate ? dataEmployeeContactDetail.data.birthDate.split("T")[0] : '';
    dataEmployeeContactDetail.data.relationshipTypeOption = { ...initialOption };
    dataEmployeeContactDetail.data.namePrefixOption = { ...initialOption };
    dataEmployeeContactDetail.data.genderOption = { ...initialOption };
    dataEmployeeContactDetail.data.stateOption = { ...initialStateOption };

    setOptionData(dataEmployeeContactDetail.data.relationshipTypeOption, dataEmployeeContactDetail.data.relationshipId, dataEmployeeContactDetail.data.relation);
    const optionPrefixName = honorificDropdownData.value.find(honorificsList => honorificsList.honorificId === dataEmployeeContactDetail.data.namePrefixId);
    setOptionData(dataEmployeeContactDetail.data.namePrefixOption, dataEmployeeContactDetail.data.namePrefixId, optionPrefixName?.honorificName);
    setOptionData(dataEmployeeContactDetail.data.genderOption, dataEmployeeContactDetail.data.genderId, getNameById(dataEmployeeContactDetail.data.genderId, store.genderListOfEmployeeContact));
    setOptionData(dataEmployeeContactDetail.data.stateOption, dataEmployeeContactDetail.data.address.state, getNameById(dataEmployeeContactDetail.data.address.state, state));
  }

  originalData.value = JSON.stringify(dataEmployeeContactDetail.data);
  relationshipOfEmployeeContact.value = store.relationshipOfEmployeeContact;
  prefixOfEmployeeContact.value = honorificDropdownData.value.map(
    (honorificsList) => ({
      id: honorificsList.honorificId,
      name: honorificsList.honorificName,
    })
  );

  genderListOfEmployeeContact.value = store.genderListOfEmployeeContact;
};

const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const onboardingNavStore = useOnboardingStore();
const currentNavItem = ref(null)

const handleCheckSideBar = async (emergencyContact: boolean) => {
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  }
  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingContacts'.trim().toLocaleLowerCase());
  await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, emergencyContact, Number(employeeId));
}

onMounted(async () => {
  setLoading(true);
  try {
    await fetchData();
    if (onboardingSideNavItem.value.length == 0) {
      await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }
})

const action = ref<string>("");
function setAction(value: string) {
  action.value = value;
}

const resetForm = async (callResetAgain = false) => {
  Object.assign(dataEmployeeContactDetail.data,
    JSON.parse(JSON.stringify(initialData))
  );

  dataEmployeeContactDetail.data.relationshipTypeOption = { ...initialOption };
  dataEmployeeContactDetail.data.namePrefixOption = { ...initialOption };
  dataEmployeeContactDetail.data.genderOption = { ...initialOption };
  dataEmployeeContactDetail.data.stateOption = { ...initialStateOption };

  form.value.resetForm();
  if (callResetAgain) {
    setTimeout(async () => {
      await resetForm();
    }, 25);
  }
}

const mapFromEmployeeContactSave = (contact: EmployeeContact) => {
  return {
    id: contact.id || 0,
    employeeId: Number(employeeId),
    firstName: contact.firstName,
    middleName: contact.middleName,
    lastName: contact.lastName,
    relationTypeId: contact.relationshipId,
    phone: {
      id: contact.phoneId || 0,
      phoneTypeId: 1, // Main's value
      phoneNumber: contact.phoneNumber,
      phoneExtension: contact.phoneExtension,
    },
    email: {
      id: contact.emailId || 0,
      emailAddressTypeId: 1, // Main's value
      email: contact.emailAddress,
    },
    genderId: contact.genderId || null,
    birthDate: contact.birthDate,
    ssn: contact.ssn,
    isEmergencyContact: contact.isEmergencyContact,
    isDependent: contact.isDependent,
    isBeneficiary: contact.isBeneficiary,
    isPrimaryContact: contact.isPrimaryContact,
    prefixId: contact.namePrefixId || null,
    suffix: contact.suffix,
    address: {
      id: contact.address.id || 0,
      address1: contact.address.address1,
      address2: contact.address.address2,
      city: contact.address.city,
      state: contact.address.state,
      zip: contact.address.zip,
      country: contact.address.country,
      addressType: contact.address.addressType,
      addressTypeId: 1, // Main's value
    },
  };
}

const checkRelationshipType = ref(false);
let isEmergencyContactExist = ref(false);

function filterByType(list: any[], type: string) {
  if (list) {
    return list.filter((item) => item[type]);
  }
}

const navigateToContactList = async () => {
  router.push({ name: 'onboardingContacts' });
};

async function submitForm() {
  isSaving.value = true;
  await form.value.validate();

  if (
    dataEmployeeContactDetail.data.isEmergencyContact ||
    dataEmployeeContactDetail.data.isDependent ||
    dataEmployeeContactDetail.data.isBeneficiary
  ) {
    checkRelationshipType.value = false;
    dataEmployeeContactDetail.data.relationshipId = dataEmployeeContactDetail.data.relationshipTypeOption.id;
    dataEmployeeContactDetail.data.genderId = dataEmployeeContactDetail.data.genderOption?.id ?? 0;
    dataEmployeeContactDetail.data.namePrefixId = dataEmployeeContactDetail.data.namePrefixOption?.id ?? 0;
    dataEmployeeContactDetail.data.address.state = dataEmployeeContactDetail.data.stateOption?.id ?? "";
    const payload = mapFromEmployeeContactSave(dataEmployeeContactDetail.data);

    if (isEditForm) {
      setLoading(true);
      try {
        await updateEmployeeContactDetail(payload);
      } catch (error) {
        console.error(error)
      } finally {
        try {
          await fetchEmployeeContactList(Number(employeeId));
          const dataEmployeeEmergencyContactsList = filterByType(
            store.employeeContactList,
            "isEmergencyContact"
          );
          isEmergencyContactExist.value = dataEmployeeEmergencyContactsList.length > 0;
        } catch (error) {
          console.error(error)
        } finally {
          try {
            await handleCheckSideBar(isEmergencyContactExist.value);
            await navigateToContactList();
          } catch (error) {
            console.error(error)
          } finally {
            setLoading(false);
            notifySuccess(`Contact updated.`);
            isSaving.value = false;
          }
        }
      }
    } else {
      if (action.value === "saveAndDone") {
        setLoading(true);
        try {
          await addEmployeeContact(payload);
        } catch (error) {
          console.error(error)
        } finally {
          try {
            await fetchEmployeeContactList(Number(employeeId));
            const dataEmployeeEmergencyContactsList = filterByType(
              store.employeeContactList,
              "isEmergencyContact"
            );
            isEmergencyContactExist.value = dataEmployeeEmergencyContactsList.length > 0;
          } catch (error) {
            console.error(error)
          } finally {
            try {
              await handleCheckSideBar(isEmergencyContactExist.value);
              await navigateToContactList();
            } catch (error) {
              console.error(error)
            } finally {
              setLoading(false);
              notifySuccess(`Contact added.`);
              isSaving.value = false;
            }
          }
        }
      } else if (action.value === "saveAndNew") {
        setLoading(true);
        try {
          await addEmployeeContact(payload);
        } catch (error) {
          console.error(error)
        } finally {
          try {
            await fetchEmployeeContactList(Number(employeeId));
            const dataEmployeeEmergencyContactsList = filterByType(
              store.employeeContactList,
              "isEmergencyContact"
            );
            isEmergencyContactExist.value = dataEmployeeEmergencyContactsList.length > 0;
          } catch (error) {
            console.error(error)
          } finally {
            await handleCheckSideBar(isEmergencyContactExist.value);
            Object.assign(dataEmployeeContactDetail.data, {
              isBeneficiary: false,
              isDependent: false,
              isEmergencyContact: false,
            });
            await resetForm(true);
            setLoading(false);
            notifySuccess(`Contact added.`);
            isSaving.value = false;
          }
        }
      }
    }
  } else {
    checkRelationshipType.value = true;
  }
}

watch(dataEmployeeContactDetail, () => {
  if (isEditForm) {
    isFormDirty.value =
      JSON.stringify(dataEmployeeContactDetail.data) !== originalData.value;
  } else {
    isFormDirty.value =
      JSON.stringify(dataEmployeeContactDetail.data) !==
      JSON.stringify(initialData);
  }
});

onBeforeRouteLeave((to, from, next) => {
  if (isForcePush.value) {
    next();
    return;
  }
  if (isFormDirty.value) {
    openSaveChangeModal.value = true
    toPath.value = to.fullPath;
    next(false);
    return false;
  } else {
    next()
    return true
  }
});

// Popup when changed form
const openSaveChangeModal = ref(false);
const toPath = ref("");
const isForcePush = ref(false);
const isSaving = ref(false);

const handleStay = () => {
  openSaveChangeModal.value = false;
};
const handleLeavePage = () => {
  openSaveChangeModal.value = false;
  isForcePush.value = true;
  router.push(toPath.value);
};
</script>

<template>
  <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
    okTextVariant="danger" cancelText="STAY" cancelBtnVariant="light" @close="handleStay" @ok="handleLeavePage">
    <template #content>
      <span class="d-flex">
        <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
        <div style="font-size: 14px">
          <p>Are you sure you want to leave this page?</p>
          <p>You have unsaved changes, your data will be lost.</p>
        </div>
      </span>
    </template>
  </dark-theme-modal>
  <VeeForm @submit="submitForm" ref="form">
    <div class="onboarding-employee-contact scrollForOnboardingContact">
      <fs-container fluid class="hq-pg__header hq-pg__header--sub contain onboarding-employee-contact__header">
        <fs-row align-v="center">
          <fs-col cols="12" md="6">
            <h2 class="hq-pg__title onboardingContactTitle">
              {{ isEditForm ? "Edit Contact" : "Add Contact" }}
            </h2>
          </fs-col>
          <fs-col :ls="6" cols="12" md="6" class="onboarding-employee-contact__saveBtn">
            <RouterLink :to="{ name: 'onboardingContacts' }" variant="btn-dark"
              class="btn bg-white text-muted border border-secondary">CANCEL
            </RouterLink>
            <fs-button class="btn bg-white text-cyan border-cyan" type="submit" v-if="!isEditForm"
              @click="setAction('saveAndNew')">
              Save & NEW</fs-button>

            <fs-button class="btn bg-cyan text-white border-cyan" type="submit" v-if="!isEditForm"
              @click="setAction('saveAndDone')">
              Save & Done</fs-button>

            <fs-button class="btn bg-cyan text-white border-cyan" type="submit" v-else @click="setAction('saveAndDone')"
              :disabled="!isFormDirty">
              Save</fs-button>
          </fs-col>
        </fs-row>
      </fs-container>

      <fs-container fluid class="contain onboarding-employee-contact__container hq-pg__container">
        <div class="onboarding-employee-contact__sections">
          <!-- Contact Name -->
          <section>
            <h3 class="hq-pg__section-head onboarding-employee-contact__subTitle">
              Contact Name
            </h3>
            <div>
              <fs-row>
                <fs-col cols="12" md="2">
                  <fs-input type="fsMultiselectList" v-model="dataEmployeeContactDetail.data.namePrefixOption"
                    :typeaheaddata="prefixOfEmployeeContact" typeaheadkey="name" typeaheadvalueattribute="id"
                    name="Prefix" label="Prefix" :showClear="true" />
                </fs-col>
                <fs-col cols="12" md="8">
                  <fs-row>
                    <fs-col cols="12" md="4">
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.firstName" name="FirstName"
                        label="First Name" rules="required|max:20" :required="true" />
                    </fs-col>
                    <fs-col cols="12" md="4">
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.middleName" name="MiddleName"
                        label="Middle Initial" :rules="dataEmployeeContactDetail.data.middleName ? 'length:1' : ''" />
                    </fs-col>
                    <fs-col cols="12" md="4">
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.lastName" name="LastName"
                        label="Last Name" :required="true" rules="required|max:20" />
                    </fs-col>
                  </fs-row>
                </fs-col>
                <fs-col cols="12" md="2">
                  <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.suffix" name="Suffix"
                    label="Suffix" rules="max:4" />
                </fs-col>
              </fs-row>
            </div>
          </section>

          <!-- Contact Info -->

          <section>
            <h3 class="hq-pg__section-head onboarding-employee-contact__subTitle">
              Contact Info
            </h3>
            <fs-row>
              <fs-col>
                <fs-input type="fsMultiselectList" v-model="dataEmployeeContactDetail.data.relationshipTypeOption"
                  :typeaheaddata="relationshipOfEmployeeContact" typeaheadkey="name" typeaheadvalueattribute="id"
                  rules="required" name="Relationship" label="Relationship" :required="true" :showClear="true" />

                <fs-form-group>
                  <fs-form-checkbox v-model="dataEmployeeContactDetail.data.isEmergencyContact" name="isEmergencyContact">
                    Emergency Contact
                  </fs-form-checkbox>

                  <fs-form-checkbox v-model="dataEmployeeContactDetail.data.isDependent" name="isDependent">
                    Dependent
                  </fs-form-checkbox>

                  <fs-form-checkbox v-model="dataEmployeeContactDetail.data.isBeneficiary" name="isBeneficiary">
                    Beneficiary
                  </fs-form-checkbox>
                </fs-form-group>
              </fs-col>
              <span v-if="checkRelationshipType" class="message-error">
                Field is required.</span>
            </fs-row>
          </section>

          <!-- Phone Number & Email Address -->

          <section class="mt-4">
            <h3 class="hq-pg__section-head onboarding-employee-contact__subTitle">
              Phone Number & Email Address
            </h3>
            <fs-row>
              <fs-col>
                <div>
                  <fs-row>
                    <fs-col cols="12" md="6">
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.emailAddress" name="Email"
                        label="Email Address" rules="email|max:100|required" :maxlength="100" :required="true" />
                    </fs-col>

                    <fs-col cols="12" md="6">
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.phoneNumber" name="Phone"
                        label="Phone Number" rules="phoneNumber|required" maskFormat="(###) ###-####" :required="true" />
                    </fs-col>
                  </fs-row>
                </div>
              </fs-col>
            </fs-row>
          </section>

          <!-- Personal Information -->

          <section>
            <h3 class="hq-pg__section-head onboarding-employee-contact__subTitle">
              Personal Information
            </h3>
            <fs-row>
              <!-- SSN & DoB -->
              <fs-col lg="6" v-if="dataEmployeeContactDetail.data.isBeneficiary === true ||
                dataEmployeeContactDetail.data.isDependent === true
                ">

                <fs-input type="fsTextInput" :input-type="checkIconSsn ? 'password' : 'text'" :required="true"
                  v-model="dataEmployeeContactDetail.data.ssn" rules="ssn|required" name="SSN" label="SSN"
                  maskFormat="###-##-####">
                  <template #input-group-content>
                    <fs-button class="fs-input__overlap-button" @click="checkIconSsn = !checkIconSsn"
                      variant="outline-secondary">
                      <font-awesome-icon :icon="checkIconSsn
                        ? 'fa-light fa-eye'
                        : 'fa-light fa-eye-slash'
                        " />
                    </fs-button>
                  </template>
                </fs-input>

                <fs-input type="fsDateInput" v-model="dataEmployeeContactDetail.data.birthDate" name="Birthday"
                  label="Date of Birth" :max="formattedDate" rules="required|beforeToday" :required="true" />
              </fs-col>
              <fs-col lg="6" v-else>
                <fs-input type="fsTextInput" :input-type="checkIconSsn ? 'password' : 'text'"
                  v-model="dataEmployeeContactDetail.data.ssn" rules="ssn" name="SSN" label="SSN"
                  maskFormat="###-##-####">
                  <template #input-group-content>
                    <fs-button class="fs-input__overlap-button" @click="checkIconSsn = !checkIconSsn"
                      variant="outline-secondary">
                      <font-awesome-icon :icon="checkIconSsn
                        ? 'fa-light fa-eye'
                        : 'fa-light fa-eye-slash'
                        " />
                    </fs-button>
                  </template>
                </fs-input>
                <fs-input type="fsDateInput" v-model="dataEmployeeContactDetail.data.birthDate" name="Birthday"
                  label="Date of Birth" :max="formattedDate" rules="beforeToday" />
              </fs-col>
              <!-- /SSN & DoB -->

              <fs-col lg="6">
                <fs-input type="fsMultiselectList" v-model="dataEmployeeContactDetail.data.genderOption"
                  :typeaheaddata="genderListOfEmployeeContact" typeaheadkey="name" typeaheadvalueattribute="id"
                  name="Gender" label="Gender" :showClear="true" />
              </fs-col>
            </fs-row>
          </section>

          <!--  Address -->

          <section>
            <h3 class="hq-pg__section-head onboarding-employee-contact__subTitle">
              Address
            </h3>
            <fs-row>
              <fs-col>
                <fs-row>
                  <fs-col cols="12">
                    <fs-form-group>
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.address.address1"
                        name="Address" label="Address" rules="max:30" />
                      <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.address.address2"
                        name="AddressOption" label="Address 2" rules="max:30" />
                    </fs-form-group>
                  </fs-col>

                  <fs-col md="6" class="mb-3">
                    <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.address.city" name="City"
                      label="City" rules="max:30" />
                  </fs-col>

                  <fs-col sm="6" md="3" class="mb-3">
                    <fs-input type="fsMultiselectList" v-model="dataEmployeeContactDetail.data.stateOption"
                      :typeaheaddata="state" typeaheadkey="name" typeaheadvalueattribute="id" name="State"
                      label="State" />
                  </fs-col>
                  <fs-col sm="6" md="3">
                    <fs-input type="fsTextInput" v-model="dataEmployeeContactDetail.data.address.zip" name="ZipCode"
                      maskFormat="##########" label="Zip Code" rules="max:10" />
                  </fs-col>
                </fs-row>
              </fs-col>
            </fs-row>
          </section>
        </div>
      </fs-container>
    </div>
  </VeeForm>
</template>
