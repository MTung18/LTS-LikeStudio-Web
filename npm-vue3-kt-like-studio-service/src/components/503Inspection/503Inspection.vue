<template>
  <div class="not-found">
    <figure class="max-w-[41.8rem]">
      <img src="../../assets/img/img_error_obj-02.png" alt="에러 이미지" />
    </figure>
    <h2 class="mt-[6rem] text-ttl-l font-bold text-center">
      더 나은 서비스 제공을 위해 점검 중입니다.<br />
      점검시간 동안 서비스 이용이 일시 중단되오니<br />
      깊은 양해 부탁드립니다.
    </h2>
    <div
      class="mt-[3.2rem] py-[2rem] px-[2.8rem] rounded-[5rem] bg-[#F6F6F6] text-fz-l text-gray-gray-444 text-center leading-[1.6]"
    >
      점검 일시 : 2023.07.07 12:00 ~ 2023.07.08 12:00
    </div>
  </div>
</template>

<script setup></script>

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
