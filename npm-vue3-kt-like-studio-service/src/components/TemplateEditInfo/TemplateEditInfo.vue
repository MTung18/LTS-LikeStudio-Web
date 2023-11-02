<template>
  <div class="template-edit-info" :class="[props.classBind]">
    <div v-if="props.hits" class="template-edit-info__row">
      <div class="template-edit-info__row-inner">
        <div class="template-edit-info__label">조회수</div>
        <div class="template-edit-info__desc">{{ props.hits }}</div>
      </div>
    </div>

    <div v-if="props.answeredDate" class="template-edit-info__row">
      <div class="template-edit-info__row-inner">
        <div class="template-edit-info__label">답변일시</div>
        <div class="template-edit-info__desc">{{ props.answeredDate }}</div>
      </div>
    </div>

    <div v-if="modifier || writer" class="template-edit-info__row">
      <div v-if="modifier" class="template-edit-info__row-inner">
        <div class="template-edit-info__label">수정일시/수정자</div>
        <div class="template-edit-info__desc">
          <span class="desc__date">{{ props.lastModifiedDate }}</span>
          <span class="desc_between"></span>
          <span>{{ props.modifier }} ({{ props.modifierPosition }})</span>
        </div>
      </div>
      <div v-if="writer" class="template-edit-info__row-inner">
        <div class="template-edit-info__label">작성일시/작성자</div>
        <div class="template-edit-info__desc">
          <span class="desc__date">{{ props.createdDate }}</span>
          <span class="desc_between"></span>
          <span>{{ props.writer }} ({{ props.writerPosition }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  hits: {
    type: Number,
    default: 0,
  },
  answeredDate: {
    type: String,
    default: '',
  },
  lastModifiedDate: {
    type: String,
    default: '',
  },
  modifier: {
    type: String,
    default: '',
  },
  modifierPosition: {
    type: String,
    default: '',
  },
  createdDate: {
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
  classBind: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.template-edit-info {
  position: relative;
  padding: 2.8rem 0;
}

.template-edit-info:after {
  position: absolute;
  top: -1px;
  left: 0;
  content: '';
  width: 100%;
  height: 1px;
  background-color: var(--color-gray-ddd);
}

.template-edit-info__row {
  display: flex;
}

.template-edit-info__row + .template-edit-info__row {
  margin-top: 0.6rem;
}

.template-edit-info__row-inner {
  display: flex;
  align-items: center;
  gap: 0 2rem;
  flex: 1;
}

.template-edit-info__label {
  width: 12rem;
  padding: 0.6rem 0;
  font-size: var(--fz-m);
  font-weight: 700;
}

.template-edit-info__desc {
  display: flex;
  align-items: center;
  font-size: var(--fz-m);
}

.desc_between {
  display: inline-block;
  margin: 0 0.8rem;
  width: 1px;
  height: 1.8rem;
  background-color: var(--color-gray-ddd);
}
</style>
