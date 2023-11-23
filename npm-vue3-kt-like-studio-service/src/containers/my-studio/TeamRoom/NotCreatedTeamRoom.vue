<template>
  <div class="team-room container-1200">
    <h3 class="team-room__title">생성된 팀룸이 없어요!</h3>
    <p class="team-room__desc">
      팀룸을 통해 팀원을 초대하고 프로젝트를 공통 관리할 수 있어요.<br />팀룸을
      구성해 팀원들과 프로젝트에 대한 의견을 교환해 보세요.
    </p>
    <TextFields
      v-model="dummyTeamName"
      size="medium"
      placeholder="팀룸의 이름을 입력해 주세요."
      class="max-w-[41.2rem] w-full"
    />
    <div class="mt-[3.2rem] text-center">
      <UIButton component="button" color-type="standard" size="medium"
        >팀룸 만들기</UIButton
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const dummyTeamName = ref('');
</script>

<style scoped>
.team-room {
  padding-top: 12rem;
  padding-bottom: 8rem;
  text-align: center;
}

.team-room__title {
  margin-bottom: 1.6rem;
  font-size: var(--ttl-m);
  font-weight: 700;
}

.team-room__desc {
  margin-bottom: 3.2rem;
  font-size: var(--fz-l);
  color: var(--color-gray-444);
}
</style>
