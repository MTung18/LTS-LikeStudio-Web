<template>
  <div class="item-detail">
    <div class="item-detail__area">
      <b class="item-detail__title">{{ props.title }}</b>
      <ul class="item-detail__category-list">
        <li class="item-detail__category-item">
          <span>{{ props.position }}</span>
        </li>
        <li class="item-detail__category-item">
          <span>{{ props.writer }}</span>
        </li>
      </ul>
      <div v-if="props.itemLength > 1" class="item-detail__length">
        <Icons icon-name="sheet" />
        <span>{{ props.itemLength }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  title: {
    type: String,
    default: null,
  },
  position: {
    type: String,
    default: null,
  },
  writer: {
    type: String,
    default: null,
  },
  itemLength: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped>
.item-detail {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000 100%);
  display: none;
  flex-direction: column;
}

.template-item:hover .item-detail {
  display: flex;
}

.item-detail__area {
  margin-top: auto;
  padding: 1.6rem 2rem;
}

.item-detail__title {
  display: -webkit-box;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: var(--ttl-m);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
}

.item-detail__category-list {
  display: flex;
  gap: 0 2.8rem;
  margin-top: 1.6rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-neutrals-white-100);
}

.item-detail__category-item {
  position: relative;
  min-width: 0;
  max-width: 50%;
}

.item-detail__category-item:not(:last-child):before {
  position: absolute;
  top: 0;
  right: -1.4rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
}

.item-detail__category-item span {
  flex: 1;
  min-width: 0;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-detail__length {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
  margin-top: 1.2rem;
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-neutrals-white-100);
}

.item-detail__length :deep(.icon-wrap) path {
  fill: var(--color-neutrals-white-100);
}
</style>
