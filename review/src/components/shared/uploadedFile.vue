<script setup lang="ts">
import { previewFile } from '@/utilities/fileUtils';
import { truncateFileName } from '@/utilities/formatUtils';
import { faPaperclip } from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faPaperclip);

const props = defineProps(['file']);
</script>

<template>
    <div class="d-flex gap-2 align-items-center mb-2">
        <font-awesome-icon :icon="['fal', 'paperclip']" />
        <fs-link class="text-primary" @click="previewFile(props.file)">{{ truncateFileName(props.file.fileName) }}</fs-link>
    </div>
</template>