<template>
  <div class="not-found">
    <figure class="max-w-[41.7rem]">
      <img src="../../assets/img/img_error_obj-01.png" alt="에러 이미지" />
    </figure>
    <h2 class="mt-[6rem] text-ttl-l font-bold">페이지를 찾을 수 없습니다.</h2>
    <p
      class="mt-[1.6rem] text-fz-l text-gray-gray-444 text-center leading-[1.6]"
    >
      잘못된 주소를 입력하셨거나,<br />
      요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
    </p>
    <UIButton
      class="!min-w-[18rem] mt-[6rem]"
      component="button"
      color-type="standard"
      size="large"
      @click="this.$router.push('/')"
      >메인 페이지</UIButton
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
