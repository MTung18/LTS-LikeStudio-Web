<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { computed } from 'vue';

library.add(faTimes)

interface HelpCenterProps {
  showHelpCenter?: boolean
}
const props = withDefaults(defineProps<HelpCenterProps>(), {
  showHelpCenter: false
});

const emit = defineEmits(['update:showHelpCenter']);

const localShowHelpCenter = computed({
  get() {
    return props.showHelpCenter;
  },
  set(value) {
    emit("update:showHelpCenter", value);
  },
});

</script>

<template>
  <fs-sidebar 
    sidebar-class="fsi-sidebar help-center" 
    body-class="help-center__body" 
    right 
    backdrop
    backdrop-variant="transparent"
    bg-variant="white" 
    width="425px" 
    shadow="sm"
    header-class="border-bottom bg-grey--000 details_panel_header"
    footer-class="border-top" 
    aria-label="help center" 
    v-model="localShowHelpCenter" 
    title="Help Center">
    <div class="help-center__section">
      <div class="help-center__section-header">USER GUIDE</div>
      <article class="help-center__article">
        <div class="help-center__article-header">WorkforceHQ User Guide</div>
        <div>
          Looking for help on a specific feature? Try looking in our <fs-link href="https://clients.foundationsoft.com/pdfs/WHQ/Workforce_HQ.pdf" target="_blank">User Guide</fs-link>.
        </div>
      </article>
    </div>
  </fs-sidebar>
</template>
