<template>
    <fs-container fluid class="hq-pg__header hq-pg__header--sub contain">
      <fs-row align-v="center">
        <fs-col cols="auto">
          <h2 class="hq-pg__title">Reports</h2>
        </fs-col>
      </fs-row>
      <div class="fsi-pg h-100">
      <div class="reports-criteria__grid">
        <div class="reports-criteria__sidebar bg-grey--000">
          <fs-container fluid class="contain fsi-pg__container">
            <fs-row>
              <fs-col cols="auto">
                  <section class="mb-3">
                      <h4 class="fsi-pg__title">Temporary Testing Report</h4>
                      <fs-nav vertical>
                        <fs-nav-item @click="openCriteria('testReport')"
                            link-classes="text-cyan">
                            {{"the test template"}}
                        </fs-nav-item>
                      </fs-nav>
                  </section>
              </fs-col>
            </fs-row>
          </fs-container>
        </div>
      </div>
  </div>
    </fs-container>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
    
  export default defineComponent({
    name: 'ReportsComponent',
    setup() {
        const router = useRouter();

        function openCriteria(menuItem: string): void {
            const name: string = menuItem.replace(/[\s+()]/g, '').toLowerCase();
            router.push({ name });
        };
        
        return {
          router,
          openCriteria
        };
    },
})
</script>
  