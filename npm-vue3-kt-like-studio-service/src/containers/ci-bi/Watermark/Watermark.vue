<template>
  <div class="article">
    <CIBITitle id="watermark" class="pt-[8rem]">워터마크</CIBITitle>
    <CIBIDesc>
      KT 워드마크는 반드시 원본 파일을 사용해야 한다. 색상 표현에 따라 기본형,
      단색형 두가지로 구분되며, 기본형을 최우선 원칙으로 하지만 상황에 따라
      단색형을 선택적으로 활용할 수 있다. 최소 크기 규정은 KT 워드마크가 가진
      특징을 가장 잘 살릴 수 있는 최소 크기를 나타낸 것이므로 제시된 규정에
      의하여 사용한다.
    </CIBIDesc>
    <figure class="mt-[4rem]">
      <img src="./img/img_kt_ci.webp" alt="kt 로고 워터마크" />
    </figure>
    <ul class="mt-[4rem] grid grid-cols-4">
      <li class="text-center">
        <span class="text-ttl-s font-bold">기본형</span>
        <figure class="w-[8.4rem] mx-auto mt-[6.7rem] mb-[2.7rem]">
          <img src="./img/img_list-01.webp" alt="기본형" />
        </figure>
      </li>
      <li class="text-center">
        <span class="text-ttl-s font-bold">단색형</span>
        <figure class="w-[8.4rem] mx-auto mt-[6.7rem] mb-[2.7rem]">
          <img src="./img/img_list-02.webp" alt="단색형" />
        </figure>
      </li>
      <li class="text-center">
        <span class="text-ttl-s font-bold">최소 공간 규정</span>
        <figure class="w-[15.9rem] mx-auto mt-[1.2rem]">
          <img src="./img/img_list-03.webp" alt="최소 공간 규정" />
        </figure>
      </li>
      <li class="text-center">
        <span class="text-ttl-s font-bold">최소 크기 규정</span>
        <figure class="w-[14.4rem] mx-auto mt-[6.1rem] mb-[1.6rem]">
          <img src="./img/img_list-04.webp" alt="최소 크기 규정" />
        </figure>
      </li>
    </ul>
  </div>
</template>

<script setup>
import CIBIDesc from '@/containers/ci-bi/CIBIDesc.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';
</script>

<style scoped></style>
