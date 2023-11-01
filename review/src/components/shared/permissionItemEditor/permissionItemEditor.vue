<script setup lang="ts">

  import { onMounted, onUnmounted, Ref, ref, watch } from 'vue';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
  import { PermissionSetting } from '@/enums/settings/PermissionSetting';
  import { PermissionItemEditorTreeNode } from '@/models/settings/PermissionItemEditorTreeNode';
  import  PermissionGroupPermissionItem from '@/models/settings/PermissionGroupPermissionItem';
  import PermissionGroupDetails from '@/models/settings/PermissionGroupDetails';
  import { PermissionEditorAccessType } from '@/enums/settings/PermissionEditorAccessType';
  import PermissionItemEditorItem from './permissionItemEditorItem.vue';
  import { useAlerts } from '@/composables/useAlerts';
  import { BusEventName, MAIN_BUS } from '@/constants/bus';
  import { useEventBus } from '@vueuse/core';
  import { storeToRefs } from "pinia";
  import { usePermissionItemEditorStore } from '@/stores/settings/permissionItemEditorStore';
  import _ from 'lodash';

  const { setPermissionItems,
          setInitialPermissionItems,
          setCurrentPermissionItems,
          updatePermissionItems,
          resetAll,
          getPermissionGroupPermissionItem,
        } = usePermissionItemEditorStore();

  const { permissionItems, updatedItemsCount, current: updatedPermissionItems } = storeToRefs(usePermissionItemEditorStore());

  library.add(
      faInfoCircle,
  );

  interface PermissionItemEditorProps {
    isReadOnly: Boolean,
    currentPermissionGroup: PermissionGroupDetails,
    copiedFromPermissionGroup?: PermissionGroupDetails,
    permissionsUpdated?: boolean
  };

  const props = defineProps<PermissionItemEditorProps>();
  const emit = defineEmits(['update:permissionsUpdated']);

  defineExpose({
    updatedPermissionItems
  });

  const { notifyError } = useAlerts();

  const bus = useEventBus<string>(MAIN_BUS);
  const accessType = ref(PermissionEditorAccessType.Access);
  const treeNodeList: Ref<PermissionItemEditorTreeNode[]> = ref([]);
  const isLoading = ref(false);
  const topLevelTreeNodes: Ref<PermissionItemEditorTreeNode[]> = ref([]);

  onMounted(async () => {
    bus.on(busHandler);
    await initializeEditor();
  });

  onUnmounted(() => {
    bus.off(busHandler);
  })
  
  watch(() => props.copiedFromPermissionGroup, () => {
    if(props.copiedFromPermissionGroup?.id !== 0)
    {
      initializeEditor();
    }
  },{deep: true, immediate: true});

  watch(() => props.currentPermissionGroup.id, () => {
    initializeEditor();
  },{deep: true, immediate: false});

  watch(updatedItemsCount, () => {
    emit("update:permissionsUpdated", updatedItemsCount.value > 0)
  });

  function busHandler(event: string, payload: any): void {
      switch (event) {
          case BusEventName.PermissionSettingIdChange:
              updateTreeNodePermissionSettingId(payload);
              break;
      }
  };

  async function initializeEditor(): Promise<void> {
      isLoading.value = true;

      await resetAll();
      await setPermissionItems();

      if (!permissionItems.value || permissionItems.value.length === 0) {
          notifyError('Failed to load permission items.');
      }
      else {
        await initializePermissionGroupPermissionItems();
        await populatePermissionItemEditorTree();
      }

      accessType.value = treeNodeList.value.every(x => x.currentPermissionSettingId === PermissionSetting.Access) ? PermissionEditorAccessType.Access : PermissionEditorAccessType.Limited;

      isLoading.value = false;
  };

  async function initializePermissionGroupPermissionItems(): Promise<void> {

      let permGroupPermItems: PermissionGroupPermissionItem[] = [];
      let childMostPermissionItems = permissionItems.value.filter(x => x.isChildmost);

      if (props.isReadOnly) {
          permGroupPermItems = props.currentPermissionGroup.permissionGroupPermissionItems;
      }
      else {
          childMostPermissionItems.forEach(item => {

              let permGroupPermItem: PermissionGroupPermissionItem = new PermissionGroupPermissionItem();
              let copyFromMatch: PermissionGroupPermissionItem;

              if (props.copiedFromPermissionGroup) {
                  copyFromMatch = _.cloneDeep(props.copiedFromPermissionGroup.permissionGroupPermissionItems.find(x => x.permissionItemId === item.permissionItemId));
              }

              //If this is an edit
              if (props.currentPermissionGroup.id > 0) {

                  permGroupPermItem = _.cloneDeep(props.currentPermissionGroup.permissionGroupPermissionItems.find(x => x.permissionItemId === item.permissionItemId));

                  //If the source from the edited item is not found (likely a newly added permission item being added to an old permission group) treat it as new and add it to the list
                  if (!permGroupPermItem) {
                      permGroupPermItem = {
                          permissionItemId: item.permissionItemId,
                          permissionGroupId: props.currentPermissionGroup.id,
                          permissionGroupPermissionItemId: 0,
                          permissionSettingId: copyFromMatch ? copyFromMatch.permissionSettingId : PermissionSetting.Access //Default
                      };
                  }
                  else {
                      //Use the copy from value if found, else use the existing value from the edited source
                      permGroupPermItem.permissionSettingId = copyFromMatch ? copyFromMatch.permissionSettingId : permGroupPermItem.permissionSettingId
                  }

              }
              //If this a create
              else {
                  permGroupPermItem.permissionItemId = item.permissionItemId;
                  permGroupPermItem.permissionGroupId = 0;
                  permGroupPermItem.permissionGroupPermissionItemId = 0;
                  permGroupPermItem.permissionSettingId = copyFromMatch ? copyFromMatch.permissionSettingId : PermissionSetting.Access //Default
              }

              permGroupPermItems.push(permGroupPermItem);
          })
      }

      await setInitialPermissionItems(permGroupPermItems);
      await setCurrentPermissionItems(permGroupPermItems);
  };

  function setAccessType(value: PermissionEditorAccessType): void {
      accessType.value = value;

      if (value === PermissionEditorAccessType.Access) {
          for (const node of treeNodeList.value){
              updateTreeNodePermissionSettingId({ permissionItemTreeNode: node, newPermissionSettingId: PermissionSetting.Access });
          }
      } 
      else if (value === PermissionEditorAccessType.Limited) {
        for (const node of treeNodeList.value){
              updateTreeNodePermissionSettingId({ permissionItemTreeNode: node, newPermissionSettingId: PermissionSetting.NoAccess });
          }
      }
  };

  async function populatePermissionItemEditorTree(): Promise<void> {

      treeNodeList.value = permissionItems.value.map(x => ({ permissionItem: x, currentPermissionSettingId: null, parent: null, children: null, depth: null }));

      treeNodeList.value.sort((a, b) => a.permissionItem.menuOrdinal - b.permissionItem.menuOrdinal);

      for (let i = 0; i < treeNodeList.value.length; i += 1) {

          let node = treeNodeList.value[i];
          let parent = treeNodeList.value.find(x => x.permissionItem.permissionItemId === node.permissionItem.parent_PermissionItemId);
          let children = treeNodeList.value.filter(x => x.permissionItem.parent_PermissionItemId === node.permissionItem.permissionItemId);

          node.parent = parent;
          node.children = children;
          node.depth = parent ? parent.depth + 1 : 0;

          //ChildMost nodes will have a value in the permissionGroupPermissionItem store, parents must be calculated after
          if (node.permissionItem.isChildmost) {
              let permGroupPermItem = await getPermissionGroupPermissionItem(node.permissionItem.permissionItemId);
              node.currentPermissionSettingId = permGroupPermItem ? permGroupPermItem.permissionSettingId : PermissionSetting.Access;
          }

          if (parent && !node.parent.children.includes(node)) {
              node.parent.children.push(node);
          }
      }

      //Non-ChildMost (parents with children) values must be calculated as they are not stored in the database and do not have corresponding permissionGroupPermissionItems.
      calculateNonChildMostNodePermissionSettingIds();

      topLevelTreeNodes.value = treeNodeList.value.filter(x => x.depth === 0);
  };

  function calculateNonChildMostNodePermissionSettingIds() {

      //Reverse sort to work way up the tree from the bottom
      let parentNodes = treeNodeList.value.filter(x => !x.permissionItem.isChildmost).sort((a, b) => b.permissionItem.menuOrdinal - a.permissionItem.menuOrdinal);

      parentNodes.forEach(async node => {

          let childrenAreEqual = node.children.every(childItem => childItem.currentPermissionSettingId === node.children[0].currentPermissionSettingId);

          node.currentPermissionSettingId = childrenAreEqual ? node.children[0].currentPermissionSettingId : PermissionSetting.Indeterminate;
      });
  };

  async function updatePermissionGroupPermissionItem(permissionItemTreeNode: PermissionItemEditorTreeNode, newPermissionSettingId: PermissionSetting): Promise<void> {

      //Childmost items are the only items that get saved/updated
      if (!permissionItemTreeNode.permissionItem.isChildmost) {
          return;
      }

      let itemToUpdate = await getPermissionGroupPermissionItem(permissionItemTreeNode.permissionItem.permissionItemId);

      if (itemToUpdate) {

          itemToUpdate.permissionSettingId = newPermissionSettingId;

          await updatePermissionItems(itemToUpdate);
      }
  };

  async function updateTreeNodePermissionSettingId(data: any): Promise<void> {

      if (!data.permissionItemTreeNode.permissionItem.isChildmost && data.newPermissionSettingId === PermissionSetting.Indeterminate) {
          return;
      }

      //Update corresponding permissionGroupPermissionItem in vuex store
      await updatePermissionGroupPermissionItem(data.permissionItemTreeNode, data.newPermissionSettingId);

      //If this is a parent item (an item with children) we need to update all child items to match
      if (data.permissionItemTreeNode.children && data.permissionItemTreeNode.children.length > 0) {
          await updateTreeNodeChildren(data.permissionItemTreeNode, data.newPermissionSettingId);
      }

      //If this item has a parent, and the parents children all match
      if (data.permissionItemTreeNode.parent) {
          await updateTreeNodeParent(data.permissionItemTreeNode, data.newPermissionSettingId);
      }

      //If this item doesn't have a parent neither children then we update the tree node of the item (only the store item was updated so far)
      if(!data.permissionItemTreeNode.parent && (!data.permissionItemTreeNode.children || data.permissionItemTreeNode.children?.length === 0))
      {
        data.permissionItemTreeNode.currentPermissionSettingId = data.newPermissionSettingId
      }
  };

  async function updateTreeNodeChildren(permissionItemTreeNode: PermissionItemEditorTreeNode, newPermissionSettingId: number): Promise<void> {
      permissionItemTreeNode.children.forEach(async node => {

          node.currentPermissionSettingId = newPermissionSettingId;

          await updatePermissionGroupPermissionItem(node, newPermissionSettingId);

          if (node.children && node.children.length > 0) {
              await updateTreeNodeChildren(node, newPermissionSettingId);
          }
      });
  };

  async function updateTreeNodeParent(permissionItemTreeNode: PermissionItemEditorTreeNode, newPermissionSettingId: number): Promise<void> {

      if (!permissionItemTreeNode.parent) {
          return;
      }

      let parentsChildren = permissionItemTreeNode.parent.children;
      let itemMatchesSiblings = parentsChildren.filter(x => x.permissionItem.permissionItemId !== permissionItemTreeNode.permissionItem.permissionItemId).every(childItem => childItem.currentPermissionSettingId === newPermissionSettingId);

      if (itemMatchesSiblings) {
          permissionItemTreeNode.parent.currentPermissionSettingId = newPermissionSettingId;
      }
      else {
          permissionItemTreeNode.parent.currentPermissionSettingId = PermissionSetting.Indeterminate;
      }

      await updatePermissionGroupPermissionItem(permissionItemTreeNode.parent, permissionItemTreeNode.parent.currentPermissionSettingId);

      if (permissionItemTreeNode.parent) {
          await updateTreeNodeParent(permissionItemTreeNode.parent, newPermissionSettingId);
      }
  }

</script>

<template>
  <div>
    <fs-overlay
      spinner-variant="primary"
      :show="isLoading"
      class="fsi-pg__overlay"
      no-wrap
    />
      <div v-if="!isReadOnly">
        <div>
          <div class="p-3 w-100 d-inline-block bg-grey--000">
            <div class="float-start">
              <fs-form-radio
                v-model="accessType"
                :value="0"
                @change="setAccessType(0)"
                ><strong>Full Access for All Features</strong>
              </fs-form-radio>
            </div>
            <div class="float-end">
              <font-awesome-icon
                id="popover-target-owner-access"
                :icon="['fal', 'info-circle']"
                class="fa-lg"
              />
              <fs-popover
                target="popover-target-owner-access"
                triggers="hover"
                placement="right"
                boundary="viewport"
              >
                <template #title>Full Access For All Features</template>
                Grants full access to all features within WorkforceHQ.
              </fs-popover>
            </div>
          </div>
        </div>

        <div :class="accessType === 0 ? 'mt-3 mb-5' : 'mt-3 mb-5 border'">
          <div class="p-3 w-100 d-inline-block bg-grey--000">
            <div class="float-start">
              <fs-form-radio
                v-model="accessType"
                :value="1"
                @change="setAccessType(1)"
                ><strong>Limited Access</strong>
              </fs-form-radio>
            </div>
            <div class="float-end">
              <font-awesome-icon
                id="popover-target-limited-access"
                :icon="['fal', 'info-circle']"
                class="fa-lg"
              />
              <fs-popover
                target="popover-target-limited-access"
                triggers="hover"
                placement="right"
                boundary="viewport"
              >
                <template #title>Limited Access</template>
                Access can be defined by feature within WorkforceHQ.
              </fs-popover>
            </div>
          </div>

          <transition
            name="fade-transition"
            enter-active-class="animate__animated animate__fadeIn animate"
            leave-active-class="animate__animated animate__fadeOut animate__faster animate"
          >
            <div
              v-if="treeNodeList.length > 0"
              class="ps-5 pe-5"
              v-show="accessType === 1"
            >
              <permission-item-editor-item
                class="mt-3 mb-3"
                v-for="item in topLevelTreeNodes"
                :key="item.permissionItem.permissionItemId"
                :node="item"
                :depth="0"
                :isReadOnly="isReadOnly"
              >
              </permission-item-editor-item>
            </div>
          </transition>
        </div>
      </div>

      <div v-else class="contain">
        <permission-item-editor-item
          class="mt-3 mb-3"
          v-for="item in topLevelTreeNodes"
          :key="item.permissionItem.permissionItemId"
          :node="item"
          :depth="0"
          :isReadOnly="isReadOnly"
        >
        </permission-item-editor-item>
      </div>
  </div>
</template>