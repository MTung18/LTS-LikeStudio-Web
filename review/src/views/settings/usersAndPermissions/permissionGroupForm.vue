<script setup lang="ts">

import { computed, onBeforeMount, Ref, ref} from 'vue';
import { storeToRefs } from "pinia";
import { RouteLocationNormalized, useRoute, useRouter} from "vue-router";
import { useAlerts } from '@/composables/useAlerts';
import PermissionGroupDetails from "@/models/settings/PermissionGroupDetails";
import { usePermissionGroupStore } from "@/stores/settings/permissionGroupStore";
import permissionItemEditor from '@/components/shared/permissionItemEditor/permissionItemEditor.vue';
import copyPermissionsModal from '@/components/viewComponents/settings/usersAndPermissions/copyPermissionsModal.vue';
import { useFormValidation } from '@/composables/useFormValidation';
import { Form as VeeForm, FormValidationResult } from 'vee-validate';

const observer = ref();
const { formHasValidated } = useFormValidation('observer');

const { notifyError, notifySuccess } = useAlerts();

const { createPermissionGroup, editPermissionGroup, fetchPermissionGroupDetails, fetchPermissionGroupList, deletePermissionGroup} = usePermissionGroupStore();
const { permissionGroupDetails, permissionGroupList } = storeToRefs(usePermissionGroupStore());

const initialPermissionGroup: Ref<PermissionGroupDetails> = ref(new PermissionGroupDetails());
const currentPermissionGroup: Ref<PermissionGroupDetails> = ref(new PermissionGroupDetails());
const copiedFromPermissionGroup: Ref<PermissionGroupDetails> = ref(null as PermissionGroupDetails);

const route = useRoute();
const router = useRouter();

const componentMounted = ref(false);
const isLoading = ref(false);
const permissionItemEditorRef = ref(null);

const permissionGroupId: number = route.query.id ? Number(route.query.id) : 0;
const editMode = permissionGroupId && permissionGroupId !== 0;
const createMode = !permissionGroupId;

const showCopyPermissionModal = ref(false);
const showDeleteModal = ref(false);
const showCancelModal = ref(false);
const skipRouteGuard = ref(false);
const nextRoute: Ref<RouteLocationNormalized> = ref();

const permissionsUpdated = ref(false);
const formDataChanged = computed<boolean>(()=> {
    return (initialPermissionGroup.value.name != currentPermissionGroup.value.name) ||
    (initialPermissionGroup.value.description != currentPermissionGroup.value.description) || permissionsUpdated.value
    || copiedFromPermissionGroup.value !== null;
});

const alreadyExistingPermissionGroupNames = ref([]);

const onSave = async () => {
    //data needs to be retrived before isLoading = true because permissionItemEditor is removed from dom and the ref will be null 
    currentPermissionGroup.value.permissionGroupPermissionItems = permissionItemEditorRef.value.updatedPermissionItems;

    isLoading.value = true;

    const validationResult: FormValidationResult<any> = await observer.value.validate();

    if(validationResult.valid)
    {
        if(createMode)
        {
            try 
            {
                let result: PermissionGroupDetails = await createPermissionGroup(currentPermissionGroup.value);

                if (result.id !== 0) {
                    notifySuccess("Permission group was created.");
                    skipRouteGuard.value = true;
                    
                    router.push({
                        name: 'permissionGroupDetails',
                        params: {
                            permissionGroupId : result.id 
                        }
                    });

                }
                else {
                    notifyError("Permission group could not be created.");
                }
            } 
            catch(error) {
                notifyError("Permission group could not be created.");
            }
        }
        else if(editMode)
        {
            let result: boolean = await editPermissionGroup(Number(route.query.id), currentPermissionGroup.value);

            if (result) {
                notifySuccess("Permission group was editted.");
                skipRouteGuard.value = true;
                router.go(-1);
            }
            else {
                notifyError("Permission group could not be editted.")
            }
        }
    }
    else
    {
        let error = Object.values(validationResult.errors)[0];
        let errorMessage = error.includes("Field is required") ? "Please fill the required fields" : error;

        notifyError(errorMessage);
    }

    isLoading.value = false;
}

const proceedDelete = async () => {    
    isLoading.value = true;

    let result: boolean = await deletePermissionGroup(permissionGroupId);

    if (result) {
        notifySuccess("Permission group deleted.");
        skipRouteGuard.value = true;
        router.push({ name: 'userAndPermissions', hash: "#pg" });
    }
    else {
        notifyError("Permission group could not be deleted.")
    }
    
    isLoading.value = false;
}

const proceedCancel = () => {
    skipRouteGuard.value = true;
    router.push(nextRoute.value);
}

const handleCopyPermissionGroupSelected = async (selectedPermissionGroupId) => {
    if (selectedPermissionGroupId != null) {
        isLoading.value = true;

        await fetchPermissionGroupDetails(selectedPermissionGroupId);
        copiedFromPermissionGroup.value = new PermissionGroupDetails(permissionGroupDetails.value);

        isLoading.value = false;

        if (!copiedFromPermissionGroup.value?.permissionGroupPermissionItems?.length || copiedFromPermissionGroup.value?.permissionGroupPermissionItems?.length === 0) {
            notifyError('Unable to copy permissions from Permission group.');
        }
    }
}

router.beforeEach((to, from, next)=>{
    if(formDataChanged.value === true && skipRouteGuard.value === false)
    {
        nextRoute.value = to;
        showCancelModal.value = true;
        next(false);
    }
    else next();    
});

onBeforeMount(async () => {
    componentMounted.value = false;
    isLoading.value = true;

    let permissionGroupId = 0;

    if (route.query.id) {
        permissionGroupId = Number(route.query.id);

        try 
        {
            await fetchPermissionGroupDetails(Number(route.query.id));

            if(permissionGroupDetails.value?.id !== 0 && permissionGroupDetails.value?.isDefaultPermissionGroup !== true)
            {
                initialPermissionGroup.value = new PermissionGroupDetails(permissionGroupDetails.value);
                currentPermissionGroup.value = new PermissionGroupDetails(permissionGroupDetails.value);
            }
            else
            {
                throw("Permission group not found or is not editable");
            }
        }
        catch(error)
        {
            notifyError(error);

            router.push({ name: 'userAndPermissions', hash: "#pg" });
        }
    }

    try
    {
        await fetchPermissionGroupList();

        alreadyExistingPermissionGroupNames.value = permissionGroupList.value.filter(item => item.id != permissionGroupId).map(item => item.name);
    }
    catch(error)
    {
        notifyError(error);
    }

    isLoading.value = false;
    componentMounted.value = true;
});

</script>

<template>
    <div class="hq-pg">
        <fs-overlay
            :show="isLoading"
            spinner-variant="primary"
            class="fsi-pg__overlay"
            no-wrap
        />
        <fs-container
            fluid
            class="hq-pg__header hq-pg__header--sticky contain hq-pg__header--edit"
            >
            <fs-row align-v="center">
                <fs-col cols="auto" class="hq-pg__title">
                {{
                    editMode ? "Edit Permission Group" : "Create Permission Group"
                }}
                </fs-col>
                <fs-col>
                <fs-form-group class="fancy__form-group fancy__form-group--search">
                    <div class="col-md-12 text-end">
                    <fs-button variant="outline-secondary" @click="router.go(-1)"
                        >Cancel</fs-button
                    >
                    <fs-button variant="primary" 
                        @click="onSave" 
                        v-bind:disabled="editMode && !formDataChanged"
                        >Save</fs-button
                    >
                    </div>
                </fs-form-group>
                </fs-col>
            </fs-row>
        </fs-container>
      
        <fs-container fluid class="contain hq-pg__container">
                <fs-row align-v="end" class="mt-4">
                    <fs-col lg="8">
                        <h3 class="hq-pg__section-head">General</h3>
                        <VeeForm ref="observer" v-slot="{ meta }">
                            <fsInput type="fsTextInput" 
                                data-vv-name="name"
                                :rules="{
                                    max: 64,
                                    required: true,
                                    no_duplicate_existingstring: {
                                        arrayOfStrings: alreadyExistingPermissionGroupNames,
                                        message: `Name must be unique`,
                                    },
                                }"
                                :required="true" 
                                label="Name" 
                                :formMeta="{...meta, validated: formHasValidated() }"
                                v-model="currentPermissionGroup.name"/>
                            <fsInput type="fsTextInput" 
                                data-vv-name="description"
                                :rules="{ max: 255 }" 
                                label="Description" 
                                :formMeta="{...meta, validated: formHasValidated() }"
                                v-model="currentPermissionGroup.description"/>
                        </VeeForm>
                    </fs-col>
                </fs-row>
                <fs-row>
                    <fs-col lg="8" class="text-end">
                        <div v-if="copiedFromPermissionGroup">
                            <span class="me-2 text-secondary">Copied From: </span>
                            <span class="p-2 border rounded background-color--cerulean">
                                <span class="text-white">{{
                                copiedFromPermissionGroup.name
                                }}</span>
                                <button
                                v-fs-tooltip.hover
                                title="Clear Permissions"
                                type="button"
                                class="ms-2 close"
                                aria-label="Close"
                                @click="copiedFromPermissionGroup = null;"
                                >
                                &times;
                                </button>
                            </span>
                        </div>
                        <div v-else>
                        <fs-button
                            variant="link"
                            class="text-decoration-none"
                            @click="showCopyPermissionModal = true;"
                            >Copy Permissions</fs-button
                        >
                        </div>
                    </fs-col>
                </fs-row>
                <fs-row v-if="componentMounted" v-show="!isLoading">
                    <fs-col lg="8">
                        <h3 class="hq-pg__section-head ">Permissions</h3>
                        <div class="position-relative flex-fill overflow-hidden">
                            <div class="h-100 list">
                                <div class="list__table overflow-auto">
                                    <permissionItemEditor
                                    :currentPermissionGroup="currentPermissionGroup"
                                    :isReadOnly="false"
                                    :copiedFromPermissionGroup="copiedFromPermissionGroup"
                                    v-model:permissionsUpdated="permissionsUpdated"
                                    ref="permissionItemEditorRef"
                                    />
                                </div>
                            </div>
                        </div>
                    </fs-col>
                </fs-row>
                <fs-row align-v="center" v-if="editMode">
                    <fs-col lg="8">
                        <div id="delete-permission-group" class="d-inline-block">
                        <fs-button variant="danger" 
                            @click="showDeleteModal = true"   
                            v-bind:disabled="currentPermissionGroup.users.length > 0"
                        >Delete Permission Group
                        </fs-button>
                        <fs-tooltip v-if="currentPermissionGroup.users.length > 0"
                            target="delete-permission-group" v-fs-tooltip.hover.right>
                            Permission Group cannot be deleted because it has active users associated with it.
                        </fs-tooltip>
                        </div>
                    </fs-col>
                </fs-row>

        </fs-container>

        <copyPermissionsModal
            v-model:showModal="showCopyPermissionModal"
            :currentPermissionGroupId="
            currentPermissionGroup
                ? currentPermissionGroup.id
                : null
            "
            @onPermissionGroupSelected="handleCopyPermissionGroupSelected"
        />

        <fs-modal
            v-model="showDeleteModal"
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
            @ok="proceedDelete"
            @cancel="showDeleteModal = false"
            :title="
            'Delete Permission Group ' +
            currentPermissionGroup.name
            "
        >
            Are you sure you want to delete this permission group?

            <template v-slot:modal-footer="slotProps">
            <fs-button variant="outline-secondary" @click="slotProps.cancel"
                >Cancel</fs-button
            >
            <fs-button variant="danger" @click="slotProps.ok">Delete</fs-button>
            </template>
      </fs-modal>

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
        title="Close Create Permission Group"
      >
        Are you sure you want to close this page? Any unsaved changes will be
        lost.

        <template v-slot:modal-footer="slotProps">
          <fs-button variant="outline-secondary" @click="slotProps.cancel"
            >Cancel</fs-button
          >
          <fs-button variant="primary" @click="slotProps.ok">Close</fs-button>
        </template>
      </fs-modal>
    </div>
</template>