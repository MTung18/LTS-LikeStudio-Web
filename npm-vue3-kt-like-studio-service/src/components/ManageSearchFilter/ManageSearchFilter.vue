<template>
  <div class="search-filter">
    <div
      class="search-filter__top"
      v-if="props.showTop"
      :class="[props.classBindSlotTop]"
    >
      <div class="top__left">
        <slot name="topLeft" />
      </div>
      <div class="top__center">
        <slot name="topCenter" />
      </div>
      <div class="top__right">
        <slot name="topRight" />
      </div>
    </div>
    <div
      class="search-filter__bottom"
      v-if="props.showBottom"
      :class="[props.classBindSlotBottom]"
    >
      <slot name="bottom" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showTop: {
    type: Boolean,
    default: true,
  },
  showBottom: {
    type: Boolean,
    default: true,
  },
  classBindSlotTop: {
    type: String,
    default: '',
  },
  classBindSlotBottom: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.search-filter {
  max-width: 1200px;
  padding: 2.6rem;
  margin: 7.2rem auto 10rem;
  background-color: #f6f6f6;
}

.search-filter__top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0 4.2rem;
}

.top__left {
  position: relative;
  display: flex;
  align-items: center;
}

.top__left::after {
  position: absolute;
  top: 0;
  right: -2.1rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.top__center {
  display: flex;
  align-items: center;
}

.search-filter__bottom {
  display: flex;
}

.search-filter__top + .search-filter__bottom {
  margin-top: 2.6rem;
}
</style>
