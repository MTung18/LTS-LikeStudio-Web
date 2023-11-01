<script setup lang="ts">
interface Props {
  statusValue?: number;
  color: string;
  background: string;
  text: string;
  employeeId: number;
  isFormSubmit: boolean;
  formDoneAmount: number;
  totalFormAmount: number;
}

const props = withDefaults(defineProps<Props>(), {
  statusValue: 1,
  color: "#FFFFFF",
  background: "#F79F1F",
  text: "",
  employeeId: 0,
  isFormSubmit: false,
  formDoneAmount: 0,
  totalFormAmount: 12
});

function getOnboardStatusForIsDone() {
  if (props.isFormSubmit) {
    return {
      text: 'Submitted',
      color: '#FFFFFF',
      background: '#1ABC9C'
    }
  } else {
    if (props.formDoneAmount > 0 && props.formDoneAmount <= props.totalFormAmount) {
      return {
        text: 'In Progress',
        color: '#FFFFFF',
        background: '#F79F1F'
      }
    } else if (props.formDoneAmount == 0) {
      return {
        text: 'Not Started',
        color: '#FFFFFF',
        background: 'rgba(110, 124, 143, 0.5)'
      }
    }
  }
}
</script>

<template>
  <div size="small" class="onboard-status" :style="{
    color: getOnboardStatusForIsDone().color,
    background: getOnboardStatusForIsDone().background,
  }">
    {{ getOnboardStatusForIsDone().text }}
  </div>
</template>

<style scoped lang="scss">
.onboard-status {
  border: none;
  border-radius: 20px;
  padding: 4px 12px;
  line-height: 16px;
  font-weight: 400;
  min-height: 16px;
  cursor: default;

  &:focus {
    outline: 0;
    border: none;
    box-shadow: none;
  }

  &:active {
    outline: 0;
    border: none;
    box-shadow: none;
  }
}
</style>