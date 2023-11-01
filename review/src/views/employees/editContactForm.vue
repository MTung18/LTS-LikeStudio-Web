<script setup lang="ts">
import loadingWave from '@/assets/images/Loading_Wave.svg';
import { computed, onBeforeMount, Ref, ref, toRaw, watch } from 'vue';
import { RouteLocationNormalized, useRoute, useRouter } from 'vue-router';
import { useAlerts } from '@/composables/useAlerts';
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { Form as VeeForm, FormValidationResult } from 'vee-validate';
import { formatSsnOnInput } from '@/utilities/formatUtils';
import deleteConfirmationModal from '@/components/shared/deleteConfirmationModal.vue';
import { EmployeeInformationTab } from '@/enums/EmployeeInformationTab';
import FsAddress from '@/components/global/fsInput/fsAddress/fsAddress.vue';
import Contact from '@/models/employees/Contact';
import { ContactInputFormData } from '@/models/employees/ContactInput';
import Gender from '@/models/employees/Gender';
import RelationshipType from '@/models/employees/RelationshipType';
import NamePrefix from '@/models/employees/NamePrefix';
import _ from 'lodash';

const {
  fetchContactMasterData,
  createEmployeeContactAsync,
  updateEmployeeContactAsync,
  fetchEmployeeContactSsn,
  deleteEmployeeContactAsync,
  checkEmployeeContactCanBeDeletedAsync,
  fetchEmployeeDetails,
  fetchEmployeeContactList,
} = useEmployeeStore();

const {
  contactMasterData,
  employeeContactCreated,
  employeeContactUpdated,
  contactList,
  employeeContactCanBeDeleted,
  employeeDetails,
  employeeContactDeleted,
  employeeContactSSN,
} = storeToRefs(useEmployeeStore());

const { notifySuccess, notifyError } = useAlerts();
const route = useRoute();
const router = useRouter();

const employeeId = computed<number>(() =>
  route.params.id ? Number(route.params.id) : 0
);
const contactId = computed<number>(() =>
  route.params.contactId ? Number(route.params.contactId) : 0
);
const isEdit = computed<boolean>(() => (contactId.value !== 0 ? true : false));

const observer = ref();
const showDeleteModal = ref(false);
const formHasValidated = ref(false);
const showContactTypeError = ref(false);
const prefixListForDropdown = ref(new Array<NamePrefix>());
const relationshipListForDropdown = ref(new Array<RelationshipType>());
const genderListForDropdown = ref(new Array<Gender>());
const employeeContact = ref(new Contact());
const hasAnotherEmergencyContact = ref(true);
const isLoading = ref(false);

const updatedData: Ref<ContactInputFormData> = ref(new ContactInputFormData());
let initialData: ContactInputFormData;

const showCancelModal = ref(false);
const skipRouteGuard = ref(false);
const nextRoute: Ref<RouteLocationNormalized> = ref();

const proceedCancel = () => {
  skipRouteGuard.value = true;
  router.push(nextRoute.value);
};

const onCancel = () => {
  goback();
};

function goback() {
  router.push({
    name: 'employeeInformation',
    params: { id: employeeId.value, tab: EmployeeInformationTab.Contacts },
  });
}

router.beforeEach((to, from, next) => {
  if (formDataChanged.value === true && skipRouteGuard.value === false) {
    nextRoute.value = to;
    showCancelModal.value = true;
    next(false);
  } else next();
});

const formDataChanged = ref(false);

const checkForChanges = _.debounce(() => {
  let obj = updatedData.value;

  Object.keys(obj).forEach(
    (k) => (obj[k] == null || obj[k] == '') && delete obj[k]
  );

  formDataChanged.value = JSON.stringify(initialData) !== JSON.stringify(obj);
}, 500);

watch(() => updatedData.value, checkForChanges, {
  deep: true,
});

const resetForm = async (callResetAgain = false) => {
  formHasValidated.value = false;
  await observer.value.setFieldTouched(false);
  showContactTypeError.value = false;
  updatedData.value = new ContactInputFormData();
  await observer.value.resetForm();
  if (callResetAgain) {
    setTimeout(async () => {
      await resetForm();
    }, 25);
  }
};

const onSave = async (resetForNew: boolean) => {
  try {
    if (
      !updatedData.value.isEmergencyContact &&
      !updatedData.value.isBeneficiary &&
      !updatedData.value.isDependent
    ) {
      showContactTypeError.value = true;
      return;
    }
    showContactTypeError.value = false;

    const result: FormValidationResult<any> = await observer.value.validate();
    formHasValidated.value = true;
    if (result.valid) {
      updatedData.value.employeeId = employeeId.value;

      const data = updatedData.value.toContactInput(isEdit.value);

      if (!isEdit.value) {
        await createEmployeeContactAsync(data);

        if (employeeContactCreated.value) {
          notifySuccess('Employee contact saved.');
          if (resetForNew) {
            await resetForm(true);
          } else {
            skipRouteGuard.value = true;
            goback();
          }
        } else {
          notifyError('Employee contact not saved.');
        }
      } else {
        await updateEmployeeContactAsync(data);

        if (employeeContactUpdated.value) {
          notifySuccess('Contact has been updated.');
          skipRouteGuard.value = true;
          goback();
        } else {
          notifyError('Contact failed to update. Try again.');
        }
      }
    } else {
      focusOnFirstError('observer');
    }
  } catch (error: any) {
    notifyError('Employee contact not saved.');
  }
};

const scrollToTop = () => {
  const mainDivElement = document.getElementsByClassName('hq-pg');
  if (mainDivElement && mainDivElement.length > 0) {
    mainDivElement[0].scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleDeleteModal = () => {
  if (employeeContactCanBeDeleted.value) showDeleteModal.value = true;
};

const dateOfBirthAndSSNRequired = computed<boolean>(() => {
  return updatedData.value.isDependent || updatedData.value.isBeneficiary
    ? true
    : false;
});

const proceedDelete = async () => {
  if (employeeContactCanBeDeleted.value && showDeleteModal.value) {
    await deleteEmployeeContactAsync(contactId.value);
    if (employeeContactDeleted.value) {
      showDeleteModal.value = false;
      notifySuccess('Contact has been deleted.');
      setTimeout(() => {
        goback();
      }, 1000);
    }
  }
};

onBeforeMount(async () => {
  isLoading.value = true;

  await fetchContactMasterData();

  prefixListForDropdown.value = contactMasterData.value.namePrefixes;
  relationshipListForDropdown.value =
    contactMasterData.value.relationships.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  genderListForDropdown.value = contactMasterData.value.genders;

  if (isEdit.value === true) {
    Promise.allSettled([
      //0
      await fetchEmployeeContactList(employeeId.value),
      //1
      await fetchEmployeeDetails(employeeId.value),
      //2
      await checkEmployeeContactCanBeDeletedAsync(contactId.value),
      //3
      await fetchEmployeeContactSsn(contactId.value),
    ])
      .then((promiseResult) => {
        employeeContact.value = contactList.value.find(
          (contact) => contact.id === contactId.value
        );
        hasAnotherEmergencyContact.value = contactList.value.some(
          (contact) =>
            contact.id !== contactId.value && contact.isEmergencyContact
        );

        updatedData.value = new ContactInputFormData(employeeContact.value);

        if (
          employeeContactSSN.value &&
          employeeContactSSN.value !== 0 &&
          promiseResult[3].status === 'fulfilled'
        ) {
          updatedData.value.socialSecurityNumber =
            employeeContactSSN.value.toString();
        }
      })
      .catch(() => {
        notifyError('Employee contact information could not be loaded.');
      });
  }

  initialData = JSON.parse(JSON.stringify(toRaw(updatedData.value)));

  isLoading.value = false;
});

function formatSSN() {
  updatedData.value.socialSecurityNumber = formatSsnOnInput(
    updatedData.value.socialSecurityNumber
  );
}
</script>

<template>
  <div class="hq-pg">
    <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
      <template #overlay>
        <div class="text-center">
          <img :src="loadingWave" />
        </div>
      </template>
    </fs-overlay>
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
      <fs-row align-v="center">
        <fs-col>
          <h2 class="hq-pg__title">
            {{ isEdit ? 'Edit' : 'Add' }} Employee Contact
          </h2>
        </fs-col>
        <fs-col cols="auto">
          <fs-button variant="outline-secondary" @click="onCancel()">
            CANCEL
          </fs-button>
          <fs-button
            v-if="!isEdit"
            variant="outline-primary"
            @click="onSave(false)"
            :disabled="!formDataChanged"
          >
            SAVE & DONE
          </fs-button>
          <fs-button
            variant="primary"
            @click="onSave(true)"
            :disabled="!formDataChanged"
          >
            {{ isEdit ? 'Update' : 'SAVE & NEW' }}
          </fs-button>
        </fs-col>
      </fs-row>
    </fs-container>
    <fs-container fluid class="contain hq-pg__container" v-if="!isLoading">
      <VeeForm ref="observer" id="observer" v-slot="{ meta }">
        <fs-row>
          <fs-col lg="8">
            <section class="mb-3">
              <h3 class="hq-pg__section-head">General</h3>
              <p>
                <b>Contact Type <span class="mandatory">*</span></b>
              </p>
              <fs-row class="align-items-center row-cols-auto">
                <div class="col">
                  <fs-form-checkbox
                    class="mb-2"
                    style="margin-left: -0.5em"
                    v-model="updatedData.isEmergencyContact"
                    :disabled="isEdit ? !hasAnotherEmergencyContact : false"
                    :class="showContactTypeError ? 'inputError' : ''"
                  >
                    <span class="ms-1">Emergency Contact</span>
                  </fs-form-checkbox>
                </div>
                <div class="col">
                  <fs-form-checkbox
                    class="mb-2"
                    style="margin-left: -0.5em"
                    v-model="updatedData.isBeneficiary"
                  >
                    <span style="margin-left: 0.5em">Beneficiary</span>
                  </fs-form-checkbox>
                </div>
                <div class="col">
                  <fs-form-checkbox
                    class="mb-2"
                    style="margin-left: -0.5"
                    v-model="updatedData.isDependent"
                  >
                    <span>Dependent</span>
                  </fs-form-checkbox>
                </div>
              </fs-row>

              <fs-row class="mb-2">
                <span class="text-danger" v-if="showContactTypeError">
                  Must select at least one Contact Type
                </span>
              </fs-row>

              <fs-row class="align-items-center">
                <fs-col>
                  <fs-input
                    type="fsMultiselectList"
                    label="Prefix"
                    id="prefixId"
                    labelId="prefixLabelId"
                    v-model="updatedData.prefixDropdown"
                    :typeaheaddata="prefixListForDropdown"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="prefix"
                    :showClear="true"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                    :rules="{ required: false }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                  ></fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    label="First Name"
                    :maxlength="20"
                    :rules="{ required: true }"
                    name="firstName"
                    :required="true"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    v-model="updatedData.firstName"
                  >
                  </fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    label="Middle Name"
                    :maxlength="20"
                    :rules="{ required: false }"
                    name="middleName"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    v-model="updatedData.middleName"
                  ></fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    label="Last Name"
                    :maxlength="20"
                    :rules="{ required: true }"
                    name="lastName"
                    :required="true"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    v-model="updatedData.lastName"
                  ></fs-input>
                </fs-col>
                <fs-col>
                  <fs-input
                    type="fsTextInput"
                    label="Suffix"
                    :maxlength="10"
                    :rules="{ required: false }"
                    name="suffix"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    v-model="updatedData.suffix"
                  ></fs-input>
                </fs-col>
              </fs-row>

              <fs-row class="align-items-center">
                <fs-col md="6">
                  <fs-input
                    type="fsTextInput"
                    label="Phone Number"
                    labelId="phone"
                    v-model="updatedData.phoneNumber"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :rules="{
                      required: true,
                      phoneNumber: true
                    }"
                    :required="true"
                    :validate-on-input="false"
                    :validate-on-change="true"
                    :name="'phoneNumber'"
                    placeholder="Phone Number"
                    mask-format="(###) ###-####"
                  >
                  </fs-input>
                </fs-col>
                <fs-col md="6">
                  <fs-input
                    type="fsTextInput"
                    label="Email Address"
                    labelId="email"
                    :maxlength="100"
                    v-model="updatedData.emailAddress"
                    :rules="{ 
                      required: false, 
                      email: true
                    }"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :validate-on-input="false"
                    :validate-on-change="true"
                    :required="false"
                    name="email"
                    placeholder="Email Address"
                  >
                  </fs-input>
                </fs-col>
              </fs-row>
            </section>
          </fs-col>
        </fs-row>
        <fs-row>
          <fs-col lg="8">
            <section class="mb-3">
              <h3 class="hq-pg__section-head">Personal</h3>
              <fs-row class="align-items-center">
                <fs-col md="6">
                  <fs-input
                    type="fsMultiselectList"
                    label="Relationship"
                    id="relationshipId"
                    labelId="relationshipLabelId"
                    v-model="updatedData.relationshipDropdown"
                    :required="true"
                    :rules="{ required: true }"
                    :typeaheaddata="relationshipListForDropdown"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="relationship"
                    :showClear="false"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                  >
                  </fs-input>
                </fs-col>
                <fs-col md="6">
                  <fs-input
                    type="fsMultiselectList"
                    label="Gender"
                    id="genderId"
                    labelId="genderLabelId"
                    v-model="updatedData.genderDropdown"
                    :typeaheaddata="genderListForDropdown"
                    typeaheadkey="name"
                    typeaheadvalueattribute="id"
                    name="gender"
                    :showClear="false"
                    autocomplete="donotfill"
                    :dropdownSearchable="true"
                  >
                  </fs-input>
                </fs-col>
                <fs-col md="6">
                  <fs-row class="align-items-center">
                    <fs-col>
                      <fs-input
                        type="fsDateInput"
                        id="dateOfBirth"
                        labelId="dob"
                        v-model="updatedData.birthDate"
                        :formMeta="{ ...meta, validated: formHasValidated }"
                        label="Date of Birth"
                        :required="dateOfBirthAndSSNRequired"
                        :rules="{ required: dateOfBirthAndSSNRequired }"
                        :validate-on-input="false"
                        :validate-on-change="true"
                        name="dateOfBirth"
                      >
                      </fs-input>
                    </fs-col>
                  </fs-row>
                </fs-col>
                <fs-col md="6">
                  <fs-row class="align-items-center">
                    <fs-col>
                      <fs-input
                        id="ssn"
                        type="fsTextInput"
                        v-model="updatedData.socialSecurityNumber"
                        label="SSN"
                        :required="dateOfBirthAndSSNRequired"
                        :rules="{
                          required: true,
                          ssnWithMask: true
                        }"
                        :formMeta="{ ...meta, validated: formHasValidated }"
                        :validate-on-input="false"
                        :validate-on-change="true"
                        name="ssn"
                        sensitiveContent
                        sensitiveMask="XXX-XX-XXXX"
                        @input="formatSSN"
                      />
                    </fs-col>
                  </fs-row>
                </fs-col>
              </fs-row>
            </section>
          </fs-col>
        </fs-row>
        <fs-row>
          <fs-col lg="8">
            <section class="mb-3">
              <h3 class="hq-pg__section-head">Address</h3>
              <fs-address
                v-model:googleAddress="updatedData.contactAddress"
                :isCountryEnabled="false"
              />
            </section>
          </fs-col>
        </fs-row>
      </VeeForm>
      <div v-if="isEdit">
        <span id="contactDeleteBtn">
          <fs-button
            :disabled="!employeeContactCanBeDeleted"
            variant="danger"
            @click="handleDeleteModal()"
            >Delete Contact</fs-button
          >
        </span>
        <div class="mt-2">
          <i class="b-fa b-fa-exclamation-circle text-danger"></i>
          <span style="color: #6e7c8f">
            Deleting this contact will remove them from all Contact Types. To
            remove this contact from a specific Contact Type, simply uncheck the
            appropriate checkbox
            <fs-link class="ms-auto text-primary" tag="a" @click="scrollToTop()"
              >above</fs-link
            >
          </span>
        </div>
      </div>
    </fs-container>
    <deleteConfirmationModal
      v-model:showDeleteModal="showDeleteModal"
      @OK="proceedDelete()"
      @CANCEL="showDeleteModal = false"
    >
      Are you sure you want to delete this
      <b>{{ employeeContact.firstName + ' ' + employeeContact.lastName }}</b>
      from {{ employeeDetails?.fullName }}? <br /><br />
      Deleting this contact will remove them as a(n):
      <br />
      <b>
        <span v-if="employeeContact.isPrimaryContact"
          >Primary Contact<br
        /></span>
        <span v-if="employeeContact.isEmergencyContact"
          >Emergency Contact<br
        /></span>
        <span v-if="employeeContact.isDependent">Dependent<br /></span>
        <span v-if="employeeContact.isBeneficiary">Beneficiary</span>
      </b>
    </deleteConfirmationModal>
    <fs-modal
      v-model="showCancelModal"
      centered
      content-class="phq-modal"
      header-class="phq-modal__header"
      title-class="phq-modal__title"
      body-class="phq-modal__body"
      footer-class="phq-modal__footer"
      header-text-variant="light"
      header-bg-variant="blue--dk"
      :lazy="true"
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      @ok="proceedCancel"
      @cancel="showCancelModal = false"
      title="Cancel Confirmation"
    >
      Would you like to Save or Discard your changes?

      <template v-slot:modal-footer="slotProps">
        <fs-button
          variant="outline-secondary"
          class="me-auto"
          @click="slotProps.cancel"
          >Cancel</fs-button
        >
        <fs-button variant="secondary" @click="slotProps.ok">Discard</fs-button>
        <fs-button
          variant="primary"
          @click="
            showCancelModal = false;
            onSave(false);
          "
          >Save</fs-button
        >
      </template>
    </fs-modal>
  </div>
</template>

<style scoped>
.mandatory {
  color: red;
}

.eye-icon {
  margin-top: -1%;
}
</style>
