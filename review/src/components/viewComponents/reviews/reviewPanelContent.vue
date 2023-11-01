<template>
  <div class="d-flex align-items-center justify-content-between border-bottom p-3">
    <strong class="mx-1"> {{ title }} </strong>
    <span><strong> Date Changed: </strong> {{ dateChangedComputed }} </span>
  </div>

  <div class="d-flex flex-grow-1 flex-row">
    <div class="flex-grow-1 p-3">
      <slot></slot>
    </div>
    <div v-if="rejectionPending || modelValue === false" class="border-start p-3">
      <strong class="d-block pb-2"> Rejection Comment <span class="text-danger">*</span></strong>
      <textarea ref="textAreaRef" maxlength="500" :disabled="modelValue === false" v-model="rejectionComment"
        class="form-control" rows="12" cols="28" v-on:keyup="submitOnEnter"></textarea>
    </div>
  </div>

  <div class="border-top">
    <div class="d-flex justify-content-between p-3">
      <fs-button variant="outline-secondary" :disabled="cancelDisabled" @click="$emit('cancel')">
        CANCEL
      </fs-button>

      <div class="d-flex justify-content-end align-items-center">
        <div v-if="rejectionPending" class="d-flex">
          <fs-button variant="outline-secondary" @click="rejectionPending = false">
            Reset
          </fs-button>
          <fs-button variant="outline-danger" :disabled="!rejectionComment" @click="$emit('update:modelValue', false)">
            Save Comment
          </fs-button>
        </div>

        <div v-else-if="modelValue === null" class="d-flex">
          <fs-button variant="outline-danger" @click="reject">
            REJECT
          </fs-button>

          <fs-button variant="outline-cyan" @click="$emit('update:modelValue', true)">
            APPROVE
          </fs-button>
        </div>

        <div v-else-if="modelValue" class="d-flex fw-bold align-items-center me-2">
          <span class="m-1 circle-text bg-cyan text-white">
            <font-awesome-icon :icon="['fas', 'check']" />
          </span> Approved
        </div>

        <div v-else-if="modelValue === false" class="d-flex fw-bold align-items-center me-2">
          <span class="m-1 circle-text bg-red text-white">
            <font-awesome-icon :icon="['fas', 'times']"  />
          </span> Rejected
        </div>

        <div class="d-flex ps-2 ms-2 border-start">
          <fs-button variant="primary" :disabled="submitDisabled" @click="$emit('submit')">
            SUBMIT
          </fs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, nextTick, computed } from "vue"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FormatDate } from "@/utilities/formatUtils"

library.add(faCheck, faTimes)

const props = defineProps({
  modelValue: { type: Boolean || null }, // this indicates if category is approved, rejected, or neither
  title: { type: String, required: true },
  dateChanged: { type: String, required: false },
  submitDisabled: { type: Boolean, required: true },
  cancelDisabled: { type: Boolean, required: true },
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'submit'): void
  (e: 'updateComment', val: string): void
  (e: 'update:modelValue', val: boolean): void
}>()

const dateChangedComputed = computed<string>(() => {
  if (!props.dateChanged) return 'N/A'
  return FormatDate(new Date(props.dateChanged))
})

const rejectionComment = ref<string>('')
const textAreaRef = ref<HTMLTextAreaElement>(null)
const rejectionPending = ref<boolean>(false)

const reject = () => {
  rejectionPending.value = true
  
  nextTick(() => {
    if (textAreaRef.value) {
      textAreaRef.value.focus()
    }
  })
}

const submitOnEnter = (e: KeyboardEvent) => {
  if (rejectionComment.value.trim() && e.key === 'Enter') {
    emit('updateComment', rejectionComment.value)
    emit('update:modelValue', false)
  }
}

watch(() => props.modelValue, (val) => {
  if (!val) {
    rejectionPending.value = false
  }
})
</script>

<style lang="scss" scoped>
.circle-text {
  width: 25px;
  height: 25px;
  line-height: 25px;
  -moz-border-radius: 50%;
  border-radius: 50%;
  text-align: center;
  display: block;
}
</style>
