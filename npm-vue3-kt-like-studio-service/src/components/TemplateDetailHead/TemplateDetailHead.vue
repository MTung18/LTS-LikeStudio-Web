<template>
  <div class="head">
    <h2 class="head__title">{{ props.title }}</h2>
    <ul class="head__list">
      <li v-if="props.category" class="head__item item-category">
        {{ props.category }}
      </li>
      <li
        v-if="props.writer && props.writerPosition"
        class="head__item item-category"
      >
        {{ props.writer }} ({{ props.writerPosition }})
      </li>
      <li v-if="props.date" class="head__item item-date">
        {{ `${props.date.slice(0, 4)}.${props.date.slice(5, 7)}.${props.date.slice(8, 10)}
                        ${props.date.slice(11, 16)}` }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  writer: {
    type: String,
    default: '',
  },
  writerPosition: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.head {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-neutrals-black);
}

.head__title {
  margin-bottom: 2rem;
  font-size: var(--ttl-l);
  font-weight: 700;
}

.head__list {
  display: flex;
  align-items: center;
  gap: 0 2.4rem;
}

.head__item {
  position: relative;
  font-size: var(--fz-m);
}

.head__item.item-date {
  color: var(--color-gray-777);
}

.head__list .head__item:not(:last-child)::before {
  position: absolute;
  right: -1.2rem;
  top: 0;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}
</style>
