<script setup lang="ts">

  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faCheck, faChevronDown, faChevronUp, faMinus } from '@fortawesome/pro-light-svg-icons';
  import { PermissionSetting } from '@/enums/settings/PermissionSetting';
  import { PermissionItemEditorTreeNode } from '@/models/settings/PermissionItemEditorTreeNode';
  import { BusEventName, MAIN_BUS } from '@/constants/bus';
  import { useEventBus } from '@vueuse/core';
  import { computed } from 'vue';

  library.add(
      faChevronDown, faChevronUp, faCheck, faMinus
  );

  interface PermissionSettingsInputProps {
    permissionSettingType: PermissionSetting,
    depth?: number,
    node: PermissionItemEditorTreeNode,
    isReadOnly: Boolean
  };

  const props = defineProps<PermissionSettingsInputProps>();

  const bus = useEventBus<string>(MAIN_BUS);

  const readonlyIcon = computed(() => 
  {
    //Default
    let icon = 'check'
    let color = 'text--pm-blue'

    //Indeterminate shows a yellow minus rather than a checkbox
    if (props.node.currentPermissionSettingId === permissionSetting.value.Indeterminate) {
        icon = 'minus';
        color = 'text-yellow'
    }

    return { type: ['fal', icon], style: color };
  });

  const isLabel = computed<boolean>(() => 
  {
    return props.node.permissionItem.isLabel
  });

  const permissionSettingName = computed<string>(() => 
  {
    return PermissionSetting[props.permissionSettingType]
  });

  const permissionSettingId = computed<number>(() => 
  {
    return props.permissionSettingType;
  });

  const uncheckedValue = computed<number>(() => 
  {
    if (permissionSettingId.value === PermissionSetting.NoAccess) {
      return PermissionSetting.Access;
    }
    return PermissionSetting.NoAccess;
  });

  const permissionSetting = computed<typeof PermissionSetting>(() => 
  {
    return PermissionSetting;
  });

  function emitPermissionSettingIdChange(value: number): void {
      bus.emit(BusEventName.PermissionSettingIdChange, { permissionItemTreeNode: props.node, newPermissionSettingId: value });
  }

</script>

<template>
  <div>
    <div v-if="node.depth === 0 || isLabel">
      <strong>{{ permissionSettingName }}</strong>
    </div>
    <div
      v-if="
        (node.currentPermissionSettingId === permissionSettingId ||
          node.currentPermissionSettingId ===
            permissionSetting.Indeterminate) &&
        isReadOnly &&
        !isLabel
      "
      :class="node.depth > 0 ? 'pt-3' : null"
    >
      <font-awesome-icon
        size="2x"
        :class="readonlyIcon.style"
        :icon="readonlyIcon.type"
      >
      </font-awesome-icon>
    </div>
    <fs-form-checkbox
      v-show="!isLabel && !isReadOnly"
      v-model="node.currentPermissionSettingId"
      :class="node.depth > 0 ? 'pt-3' : null"
      class="px-0 mx-0 permission-check"
      :value="permissionSettingId"
      :uncheckedValue="uncheckedValue"
      :disabled="
        node.currentPermissionSettingId === permissionSettingId &&
        node.currentPermissionSettingId !== permissionSetting.Indeterminate
      "
      :indeterminate="
        node.currentPermissionSettingId === permissionSetting.Indeterminate
      "
      :inline="true"
      @change="emitPermissionSettingIdChange(permissionSettingId)"
    ></fs-form-checkbox>
  </div>
</template>

<style>
.form-check-input[type="checkbox"]:indeterminate {
  border-color: #fbc018;
  background-color: #fbc018;
  }

.permission-check:checked {
  opacity: 1;
  border-color: #03A9F4;
  background-color: #03A9F4;
}

</style>
