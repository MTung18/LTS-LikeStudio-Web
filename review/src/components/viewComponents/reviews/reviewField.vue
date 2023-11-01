<template>
  <div class="p-1">
    <strong class="d-block py-2"> {{ friendlyTitle }} </strong>
    <div class="d-flex align-items-center">
      <span v-if="isMasked" class="bg-light px-2 py-1 rounded text-secondary min-size"> {{ initialMaskedValue }} </span>
      <span v-else class="bg-light px-2 py-1 rounded text-secondary min-size"> {{ initialValue }} </span>

      <span class="p-2"> <font-awesome-icon :icon="['fa', 'arrow-right']" size="sm" /> </span>

      <span v-if="isMasked" class="bg-primary bg-opacity-25 px-2 py-1 text-primary--dk rounded min-size">
        {{ finalMaskedValue }}
      </span>
      <span v-else class="bg-primary bg-opacity-25 px-2 py-1 text-primary--dk rounded min-size"> {{ finalValue }} </span>

      <div class="p-2 masked-button" v-if="isMasked" :title="visible ? 'Hide' : 'Show'">
        <span v-if="!visible" @click="visible = true">
          <font-awesome-icon icon="fa fa-eye-slash" />
        </span>
        <span v-else @click="visible = false">
          <font-awesome-icon icon="fa fa-eye" />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faEyeSlash } from '@fortawesome/pro-solid-svg-icons'

const props = defineProps({
  title: { type: String, required: true },
  initialValue: { type: String, required: true },
  finalValue: { type: String, required: true }
})

library.add(faEye, faEyeSlash)

const visible = ref<boolean>(false)
const maskedTitles = ['Social Security No', 'Drivers License Number']

const friendlyTitle = computed<string>(() => props.title.replace(/([A-Z])/g, ' $1').trim())

const isMasked = computed<boolean>(() => maskedTitles.includes(friendlyTitle.value))

const maskedValue = computed<string>(() => {
  switch (friendlyTitle.value) {
    case 'Social Security No':
      return 'XXX-XX-XXXX'
    case 'Drivers License Number':
      return 'XXXXXXX'
    default:
      return 'XXXX'
  }
})

const initialMaskedValue = computed<string>(() => {
  return visible.value ? props.initialValue : maskedValue.value
})

const finalMaskedValue = computed<string>(() => {
  return visible.value ? props.finalValue : maskedValue.value
})
</script>

<style scoped>
.min-size {
  min-height: 30px;
  min-width: 25px;
}

.masked-button:hover {
  cursor: pointer;
}
</style>
