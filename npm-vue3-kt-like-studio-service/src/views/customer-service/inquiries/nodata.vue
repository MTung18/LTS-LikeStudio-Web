<template>
  <TemplateBoardWrap title="1:1 문의">
    <template v-if="!firstVisit">
      <div class="mt-[4rem] text-center">
        <Button
          class-bind="!min-w-[18rem]"
          component="a"
          href="/customer-service/inquiries/create"
          color-type="primary"
          size="big"
          isIcon
        >
          문의하기
          <Icons
            icon-name="arrow_next_bold"
            icon-color="var(--color-neutrals-white-100)"
          />
        </Button>
      </div>
      <CustomerSearchWrap>
        <CalenderGroup />
        <SearchInput
          v-model="dummyInputValue"
          placeholder="검색어를 입력해주세요"
          size="medium"
          style-type="square"
          color-type="gray"
          class-bind="ml-auto !min-w-[41.2rem]"
        />
        <div class="search__button-group">
          <RoundButton component="button" color-type="filed" size="medium"
            >검색</RoundButton
          >

          <RoundButton component="button" color-type="outlined" size="medium"
            >초기화</RoundButton
          >
        </div>
      </CustomerSearchWrap>
      <TemplateDataNone />
    </template>
    <!-- dev: 1:1 문의를 한적이 없을 때 -->
    <template v-else>
      <FirstVisit />
    </template>
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';

import Button from '@/components/Button/Button.vue';
import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CustomerSearchWrap from '@/components/CustomerSearchWrap/CustomerSearchWrap.vue';
import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import FirstVisit from '@/containers/customer-service/inquiries/FirstVisit.vue';

const dummyInputValue = ref('');
const firstVisit = ref(false);
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
