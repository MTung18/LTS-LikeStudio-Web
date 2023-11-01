<script setup lang="ts">  

import permissionGroupList from "@/components/viewComponents/settings/usersAndPermissions/permissionGroupList.vue";
import userList from "@/components/viewComponents/settings/usersAndPermissions/userList.vue";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const selectedTabIndex = ref(0);

function onCreatePermissionGroup(event: any): void {
  router.push({
    name: 'permissionGroupForm'
  });
}

onMounted(() => {
    if(route.hash.toLocaleLowerCase() === "#pg")
    {
        selectedTabIndex.value = 1;
    }
})

</script>

<template>
    <div class="hq-pg d-flex flex-column" :class="{'pb-0' : selectedTabIndex === 0}">
        <fs-tabs 
            v-model="selectedTabIndex"
            pills 
            active-nav-item-class="bg-index-color-1 hq-pg__tab--active" 
            nav-wrapper-class="hq-pg__header hq-pg__header--sticky justify-content-center contain" 
            :content-class="selectedTabIndex === 0 ? 'd-flex flex-column flex-fill' : 'flex-fill mb-4'"
            :class="{'d-flex flex-column flex-fill' : selectedTabIndex === 0}">
            
            <template #tabs-end>
                <fs-button 
                    v-if="selectedTabIndex == 1"
                    variant="primary"
                    class="ms-auto"
                    @click="onCreatePermissionGroup">
                    Create Permission Group
                </fs-button>
            </template>
            <fs-tab
                active
                title="Users"
                title-item-class="mx-1" title-link-class="hq-pg__tab"
                class="flex-fill"
            >
                <userList />
            </fs-tab>
            <fs-tab
                title="Permission Groups"
                title-item-class="mx-1" title-link-class="hq-pg__tab"
            >
                <permissionGroupList />
            </fs-tab>
        </fs-tabs>
    </div>
</template>
