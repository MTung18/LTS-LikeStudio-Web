<script setup lang="ts">
import Contact from "@/models/employees/Contact";
import { computed, ref, Ref } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEdit,
  faEye,
  faEyeSlash,
  faTimes,
} from "@fortawesome/pro-light-svg-icons";
import { faStar as fasStar } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useEmployeeStore } from "@/stores/employeeStore";
import sensitiveText from "@/components/global/sensitiveText.vue";

library.add(faEdit, faEye, faEyeSlash, fasStar, faTimes);

interface Props {
  isOpen: boolean;
  modelValue: Contact;
  employeeContactId: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  modelValue: null,
  employeeContactId: null,
});
const enum EmitNames {
  CLOSE = "close",
  EDIT = "editContact",
}
const emits = defineEmits<{
  (e: EmitNames.CLOSE): void;
  (e: EmitNames.EDIT, value: Contact): void;
}>();

const phoneNumber = computed(() => props.modelValue.phoneNumber || "-");
const emailAddress = computed(() => props.modelValue.emailAddress || "-");
const relation = computed(() => props.modelValue.relation || "-");
const gender = computed(() => props.modelValue.gender || "-");
const ssn: Ref<number> = ref(null);

const { fetchEmployeeContactSsn } = useEmployeeStore();
const formattedBirthDate = computed(() =>
  props.modelValue.birthDate ? formatDate(new Date(props.modelValue.birthDate)) : "-"
);
const formattedSsn = computed(() =>
  ssn.value ? formatSsn(ssn.value) : "XXX-XX-XXXX"
);

function formatDate(date: Date) {
  return date.toLocaleDateString();
}

function formatSsn(ssn: number) {
  let val = ssn.toString().replace(/\D/g, "");
  val = val.replace(/^(\d{3})/, "$1-");
  val = val.replace(/-(\d{2})/, "-$1-");
  val = val.replace(/(\d)-(\d{4}).*/, "$1-$2");
  return val;
}

async function onSsnToggle() {
  if (!ssn.value) {
    ssn.value = await fetchEmployeeContactSsn(props.employeeContactId);
  }
}

const localIsOpen = computed({
  get() {
    return props.isOpen;
  },
  set(value) {
    if (value === false) {
      emits(EmitNames.CLOSE);
    }
  },
});

function onEditContactClick() {
  emits(EmitNames.EDIT, props.modelValue);
}
</script>
<template>
  <fs-sidebar id="onboardingPlanId" sidebar-class="fsi-sidebar" right no-close-on-esc no-close-on-backdrop bg-variant="white" width="425px"
        shadow="sm" header-class="border-bottom bg-grey--000 details_panel_header" footer-class="border-top"
        aria-label="addDocumentMetaData" v-model="localIsOpen" title="View Employee Contact">

    <div class="d-flex flex-column w-100 postion-relative border-bottom">
      <fs-container fluid class="contain border-bottom sticky--top bg-white py-3 mb-3">
        <fs-row class="align-items-center">
          <fs-col>
            <div class="h5 bold">
              <font-awesome-icon v-if="props.modelValue.isPrimaryContact" :icon="['fas', 'star']" class="text-magenta me-1" />
              {{ `${modelValue.firstName} ${modelValue.lastName}` }}
            </div>
          </fs-col>
          <fs-col cols="auto">
            <fs-button variant="outline-primary" @click="onEditContactClick"><font-awesome-icon
                :icon="['fal', 'edit']" /><span class="d-none d-lg-inline">EDIT</span>
            </fs-button>
          </fs-col>
        </fs-row>
      </fs-container>
      <fs-container fluid class="contain">
        <fs-row class="align-items-center">
          <fs-col>
            <fs-badge v-if="modelValue.isEmergencyContact" class="mb-2 p-2 fs-6 fw-normal" variant="magenta">Emergency Contact</fs-badge>
            <fs-badge v-if="modelValue.isDependent" class="mb-2 p-2 fs-6 fw-normal" variant="cyan">Dependent</fs-badge>
            <fs-badge v-if="modelValue.isBeneficiary" class="mb-2 p-2 fs-6 fw-normal" variant="green">Beneficiary</fs-badge>
          </fs-col>
        </fs-row>
        <section class="my-3">
          <fs-row>
            <fs-col>
              <h6 class="border-bottom" style="font-weight: bold">General</h6>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary"><small>Phone Number</small></div>
              <div class="mb-2">{{ phoneNumber }}</div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary">Email Address</div>
              <div class="mb-2">{{ emailAddress }}</div>
            </fs-col>
          </fs-row>          
        </section>
        

        <section class="my-3">
          <fs-row>
            <fs-col>
              <h6 class="border-bottom" style="font-weight: bold">Personal</h6>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary">Relationship</div>
              <div class="mb-2">{{ relation }}</div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary">Gender</div>
              <div class="mb-2">{{ gender }}</div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary">Date of Birth</div>
              <sensitive-text v-if="modelValue.birthDate" class="mb-2" mask="XX-XX-XXXX" :text="formattedBirthDate" />
              <div v-else class="mb-2">-</div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary">SSN</div>
              <sensitive-text v-if="modelValue.isBeneficiary || modelValue.isDependent" class="mb-2" mask="XXX-XX-XXXX"
                :text="formattedSsn" @update:model-value="onSsnToggle" />
              <div v-else class="mb-2">-</div>
            </fs-col>
          </fs-row>
        </section>

        <section class="my-3">
          <fs-row>
            <fs-col>
              <h6 class="border-bottom" style="font-weight: bold">Address</h6>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col>
              <div class="text-secondary">Address</div>
              <div v-if="modelValue.address">
                <div>{{ modelValue.address.address1 }}</div>
                <div v-if="modelValue.address.address2">
                  {{ modelValue.address.address1 }}
                </div>
                <div>
                  {{
                    `${modelValue.address.city}, ${modelValue.address.state} ${modelValue.address.zip}`
                  }}
                </div>
              </div>
              <div v-else>-</div>
            </fs-col>
          </fs-row>
        </section>
      </fs-container>
    </div>
  </fs-sidebar>
</template>
<style>
.bold {
  font-weight: bold;
}
</style>
