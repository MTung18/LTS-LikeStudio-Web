<script setup lang="ts">

  import { ref, computed } from 'vue';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons';
  import { PermissionSetting } from '@/enums/settings/PermissionSetting';
  import { PermissionItemEditorTreeNode } from '@/models/settings/PermissionItemEditorTreeNode';
  import PermissionSettingInput from './permissionSettingInput.vue';

  library.add(
      faChevronDown, faChevronUp
  );

  interface PermissionItemEditorItemProps {
    node: PermissionItemEditorTreeNode,
    parentIsLabel?: Boolean,
    isReadOnly: Boolean
  };

  const props = defineProps<PermissionItemEditorItemProps>();

  const displayChildren = ref(false);

  const permissionSetting = computed<typeof PermissionSetting>(() => {
      return PermissionSetting;
  });

  const hasChildren = computed<boolean>(() => {
      return props.node.children && props.node.children.length > 0;
  });

  const nodeStyle = computed<string>(() => {
      let common = 'row border ';
      let topLevel = 'bg-grey--000';
      let label = 'bg-grey--100';

      if (props.node.permissionItem.isLabel) {
          return common + label;
      }
      else if (props.node.depth === 0) {
          return common + topLevel;
      }
      else {
          return common;
      }
  });

  const nodeNameStyle = computed<string>(() => {
      let common = 'w-50 ';
      let adjustedDepth = props.parentIsLabel ? props.node.depth - 1 : props.node.depth;
      return adjustedDepth > 1 ? common + 'ps-4' : common + 'fw-bold';
  });

  function toggleDisplayChildren(): void {
      displayChildren.value = !displayChildren.value;
  }

</script>

<template>
  <div>
    <div :class="nodeStyle">
      <div :class="nodeNameStyle">
        <div
          :class="
            node.permissionItem.isLabel ? 'ps-3 text-break' : 'p-3 text-break'
          "
          :role="hasChildren && !node.permissionItem.isLabel ? 'button' : null"
          @click="toggleDisplayChildren()"
        >
          <font-awesome-icon
            class="text-primary"
            v-if="hasChildren && !node.permissionItem.isLabel"
            :icon="['fal', displayChildren ? 'chevron-up' : 'chevron-down']"
          />
          {{ node.permissionItem.permissionItemName }}
        </div>
      </div>
      <div class="w-50 d-inline-flex px-0">
        <div class="border-start w-50 text-center">
          <permission-setting-input
            :permissionSettingType="permissionSetting.Access"
            :node="node"
            :isReadOnly="isReadOnly"
          >
          </permission-setting-input>
        </div>
        <div
          :class="
            node.depth > 0 && !node.permissionItem.isLabel
              ? 'border-start w-50 text-center bg-grey--0000'
              : 'border-start w-50 text-center'
          "
        >
          <permission-setting-input
            :permissionSettingType="permissionSetting.NoAccess"
            :node="node"
            :isReadOnly="isReadOnly"
          >
          </permission-setting-input>
        </div>
      </div>
    </div>

    <div v-show="displayChildren || node.permissionItem.isLabel">
      <permission-item-editor-item
        v-for="item in node.children"
        :key="item.permissionItem.permissionItemId"
        :node="item"
        :parentIsLabel="node.permissionItem.isLabel"
        :isReadOnly="isReadOnly"
      ></permission-item-editor-item>
    </div>
  </div>
</template>