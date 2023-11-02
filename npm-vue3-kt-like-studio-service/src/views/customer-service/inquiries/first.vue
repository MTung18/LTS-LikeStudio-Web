<template>
  <TemplateBoardWrap title="1:1 문의">
    <!-- dev: 1:1 문의를 한적이 없을 때 -->
    <FirstVisit />
  </TemplateBoardWrap>
</template>

<script setup>
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import FirstVisit from '@/containers/customer-service/inquiries/FirstVisit.vue';
</script>

<style scoped>
.search__button-group {
  display: flex;
  gap: 0 1rem;
  margin-left: 1.6rem;
}

.list {
  margin-bottom: 6rem;
}

.list__item {
  display: flex;
  align-items: center;
  gap: 0 2.6rem;
  height: 8.4rem;
  padding-left: 0.4rem;
  padding-right: 0.8rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.item-no {
  width: 2.6rem;
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.item-title {
  flex: 1;
  overflow: hidden;
}

.item-title.is-notice {
  display: flex;
  align-items: center;
  gap: 0 1.6rem;
}

.item-title.is-notice .item-title-text {
  font-weight: 700;
}

.item-title .item-title-text {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  font-size: var(--fz-l);
  line-height: 1;
}

.item-date {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.item-answer {
  font-size: var(--fz-l);
}

.item-answer .item-answer--complete {
  color: var(--color-primary);
}
</style>
