<script lang="ts" setup>
import { ref, watch } from 'vue';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faDownload, faFileLines, faEllipsis } from "@fortawesome/pro-light-svg-icons";
import { useLoadingStore } from '@/stores/loadingStore';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { useAlerts } from '@/composables/useAlerts';
import { StaticFiles } from '@/enums/StaticFiles';

library.add(faDownload, faFileLines, faEllipsis);

interface Props {
  isClose?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isClose: 0
});

const { setLoading } = useLoadingStore();
const { getDocumentTemplate } = useReportTemplate();
const { notifyError } = useAlerts();
const isOpen = ref(false);

watch(() => props.isClose, () => {
  if (props.isClose) {
    isOpen.value = false;
  }
})

const openPanel = () => {
  isOpen.value = !isOpen.value;
}

const handleDownloadStaticFile = async (filename: string, isDownload: boolean) => {
  setLoading(true);
  try {
    await getDocumentTemplate(filename, isDownload);
  } catch (error) {
    notifyError(`${filename} is missing`)
  } finally {
    setLoading(false);
  }
}
</script>
<template>
  <div id="mobile-button-i9">
    <fs-button variant="outline-secondary" class="ms-auto rounded-pill p-2" @click="openPanel">
      <font-awesome-icon :icon="['fal', 'fa-ellipsis']" size="lg" />
    </fs-button>
  </div>
  <div v-if="isOpen" id="panel">
    <div class="p-2"><fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9, true)"><font-awesome-icon
          :icon="['fal', 'file-lines']" class="me-2" />Instructions</fs-link></div>
    <div class="p-2"><fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9_PAPER_VERSION, true)"><font-awesome-icon
          :icon="['fal', 'download']" class="me-2" />Download</fs-link></div>
  </div>
</template>

<style scoped lang="scss">
#mobile-button-i9 {
  button {
    border-radius: 50px;
    background: #e9ecef;
    border: none;
    letter-spacing: 1px;
  }

  .btn:hover {
    color: #6e7c8f;
    background-color: #e9ecef;
    border: 1px solid rgba(3, 169, 244);
    border-color: rgba(3, 169, 244);
    box-shadow: none;
  }
}

#panel {
  position: fixed;
  z-index: 1000;
  right: 33px;
  margin-top: 5px;
  border: 0.5px solid #E9ECEF;
  box-shadow: -2px 4px 7px 0px #6e7c8f;
  background: #FFFFFF;

  div:first-child {
    border-bottom: 0.5px solid #E9ECEF;
    ;
  }

  a {
    color: black;
    text-decoration: none;
  }
}
</style>