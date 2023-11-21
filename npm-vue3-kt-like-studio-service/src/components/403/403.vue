<template>
  <div class="not-found">
    <figure class="max-w-[41.7rem]">
      <img src="../../assets/img/img_error_obj-01.png" alt="에러 이미지" />
    </figure>
    <h2 class="mt-[6rem] text-ttl-l font-bold">
      접근 권한이 없는 페이지입니다.
    </h2>
    <p
      class="mt-[1.6rem] text-fz-l text-gray-gray-444 text-center leading-[1.6]"
    >
      입력한 페이지에 대한 접근 권한이 없습니다.<br />
      다시 한 번 확인해 주세요.
    </p>
    <UIButton
      class="!min-w-[18rem] mt-[6rem]"
      component="button"
      color-type="standard"
      size="large"
      @click="this.$router.go(-1)"
      >이전 페이지</UIButton
    >
  </div>
</template>

<script setup>
import UIButton from '@/components/UIButton/UIButton.vue';
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
}
</style>
