<script setup lang="ts">
interface Props {
  isRightText: boolean;
  isShowText: boolean;
  height: string;
  classes: string;
  nrOfCompletedTasksSize: number;
  employeeId: number;
  formDoneAmount: number;
  totalFormAmount: number;
}

const props = withDefaults(defineProps<Props>(), {
  isRightText: false,
  isShowText: true,
  height: "1em",
  classes: 'w-100',
  nrOfCompletedTasksSize: 14,
  formDoneAmount: 0,
  totalFormAmount: 12
});
</script>

<template>
  <div class="d-flex flex-fill">
    <span v-if="!props.isRightText && props.isShowText" class="me-3">{{ formDoneAmount }}/{{ totalFormAmount }}</span>
    <div class="flex-fill d-flex align-items-center">
      <fs-progress :value="props.totalFormAmount ? (formDoneAmount / totalFormAmount) * 100 : 0"
        :variant="formDoneAmount / totalFormAmount == 1 ? 'cyan' : 'cyan'" :height="height">
      </fs-progress>
    </div>
    <span v-if="props?.isRightText && props?.isShowText" class="ms-3 d-flex align-items-center">
      <span :style="{ fontSize: nrOfCompletedTasksSize + 'px' }">
        {{ formDoneAmount }}
      </span>
      /
      <span>
        {{ totalFormAmount == 0 ? 12 : totalFormAmount }}
      </span>
    </span>
  </div>
</template>
<style scoped>

.progress-wrapper {
  width: 100%
}
:deep(.progress) {
  width: 100%;
}

</style>